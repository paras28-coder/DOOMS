import { randomBytes, createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';
import { MongoServerError } from 'mongodb';
import { z } from 'zod';
import { Category, Decision, Priority, UserProfile } from '../src/types.js';
import { closeDatabase, connectDatabase, decisions, passwordResets, UserDocument, users } from './database.js';

if (existsSync('.env')) process.loadEnvFile('.env');

const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.APP_ORIGIN) throw new Error('APP_ORIGIN must be set to the production HTTPS origin.');
const configuredOrigin = new URL(process.env.APP_ORIGIN || 'http://localhost:3000');
if (isProduction && configuredOrigin.protocol !== 'https:') throw new Error('APP_ORIGIN must use HTTPS in production.');
const appOrigin = configuredOrigin.origin;
const jwtSecret = process.env.JWT_SECRET || (isProduction ? '' : randomBytes(32).toString('hex'));
if (!jwtSecret || jwtSecret.length < 32 || jwtSecret === 'replace-with-a-long-random-secret-before-deploying') {
  throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters.');
}

type AuthedRequest = Request & { userId?: string; cookies?: Record<string, string> };
const app = express();
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
    },
  },
}));
app.use(express.json({ limit: '64kb' }));

const allowedMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
app.use((req, res, next) => {
  if (allowedMethods.has(req.method)) return next();
  const origin = req.get('origin');
  if (origin && origin !== appOrigin) return res.status(403).json({ error: 'Request origin is not allowed.' });
  if (isProduction && !origin) return res.status(403).json({ error: 'Origin header is required.' });
  if (req.get('x-requested-with') !== 'DecideMate') return res.status(403).json({ error: 'Request verification failed.' });
  next();
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 15, standardHeaders: 'draft-8', legacyHeaders: false });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false });
const recommendationLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
const cookieName = 'decidemate_session';
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
const clearCookieOptions = { httpOnly: true, secure: isProduction, sameSite: 'strict' as const, path: '/' };

const categories = ['Education', 'Career', 'Finance', 'Shopping', 'Lifestyle', 'Other'] as const;
const priorities = ['Best Value', 'Highest Quality', 'Lowest Price', 'Speed & Ease', 'Long-term Impact'] as const;
const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
}).strict();
const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) }).strict();
const profileSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  defaultCategory: z.enum(categories).optional(),
  language: z.string().trim().min(2).max(40).optional(),
  emailNotifications: z.boolean().optional(),
  theme: z.enum(['dark', 'light']).optional(),
}).strict();
const recommendationSchema = z.object({
  question: z.string().trim().min(5).max(1000),
  category: z.enum(categories),
  priority: z.enum(priorities),
  preferences: z.array(z.string().trim().min(1).max(60)).max(12),
  additionalDetails: z.string().trim().max(2000).optional(),
}).strict();
const decisionSchema = z.object({
  id: z.string().min(1).max(100),
  question: z.string().min(1).max(1000),
  category: z.enum(categories),
  priority: z.enum(priorities),
  preferences: z.array(z.string()).max(12),
  additionalDetails: z.string().max(2000).optional(),
  createdAt: z.string().max(100),
  suitabilityScore: z.number().min(0).max(10),
  suitabilitySummary: z.string().max(2000),
  recommendedOption: z.object({ id: z.string(), title: z.string(), specs: z.array(z.string()) }).passthrough(),
  alternatives: z.array(z.object({ id: z.string(), title: z.string(), specs: z.array(z.string()) }).passthrough()).max(5),
  pros: z.array(z.string()).max(20),
  cons: z.array(z.string()).max(20),
  whyRecommended: z.string().max(4000),
  comparison: z.array(z.object({ attribute: z.string(), recommended: z.string(), alt1: z.string(), alt2: z.string() })).max(20),
  isSaved: z.boolean(),
}).passthrough();

function publicUser(row: UserDocument): UserProfile & { id: string } {
  const name = String(row.name);
  return {
    id: row._id, name, email: row.email, avatarText: name.charAt(0).toUpperCase(),
    defaultCategory: row.defaultCategory as Category, language: row.language,
    emailNotifications: row.emailNotifications, theme: row.theme,
  };
}

function issueSession(res: Response, userId: string, authVersion: number) {
  const token = jwt.sign({ sub: userId, ver: authVersion }, jwtSecret, { expiresIn: '7d', issuer: 'decidemate' });
  res.cookie(cookieName, token, cookieOptions);
}

async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.[cookieName] as string | undefined;
  if (!token) return res.status(401).json({ error: 'Please sign in to continue.' });
  let payload: jwt.JwtPayload;
  try {
    const verified = jwt.verify(token, jwtSecret, { issuer: 'decidemate' });
    if (typeof verified === 'string') throw new Error('Invalid token');
    payload = verified;
    if (typeof payload === 'string' || typeof payload.sub !== 'string') throw new Error('Invalid token');
  } catch {
    res.clearCookie(cookieName, clearCookieOptions);
    return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  }
  const account = await users().findOne({ _id: payload.sub }, { projection: { authVersion: 1 } });
  if (!account || account.authVersion !== Number(payload.ver)) {
    res.clearCookie(cookieName, clearCookieOptions);
    return res.status(401).json({ error: 'Your session expired. Please sign in again.' });
  }
  req.userId = payload.sub;
  next();
}

// Parse cookies without another dependency; reject duplicate cookie names.
app.use((req, _res, next) => {
  const header = req.headers.cookie || '';
  const cookies: Record<string, string> = {};
  for (const item of header.split(';')) {
    const separator = item.indexOf('=');
    if (separator < 0) continue;
    const key = item.slice(0, separator).trim();
    if (key in cookies) return next(new Error('Duplicate cookie value.'));
    try { cookies[key] = decodeURIComponent(item.slice(separator + 1).trim()); } catch { return next(new Error('Invalid cookie value.')); }
  }
  (req as AuthedRequest).cookies = cookies;
  next();
});

app.get('/api/health', async (_req, res, next) => {
  try {
    await users().estimatedDocumentCount();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) { next(error); }
});
app.use('/api', apiLimiter);

app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const id = randomBytes(16).toString('hex');
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user: UserDocument = {
      _id: id, name: input.name, email: input.email.toLowerCase(), passwordHash,
      authVersion: 0, defaultCategory: 'Shopping', language: 'English',
      emailNotifications: true, theme: 'dark', createdAt: new Date(),
    };
    await users().insertOne(user);
    issueSession(res, id, user.authVersion);
    res.status(201).json({ user: publicUser(user), decisions: [] });
  } catch (error) { next(error); }
});

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const row = await users().findOne({ email: input.email.toLowerCase() });
    const matches = row ? await bcrypt.compare(input.password, row.passwordHash) : false;
    if (!row || !matches) return res.status(401).json({ error: 'Email or password is incorrect.' });
    issueSession(res, row._id, row.authVersion);
    const decisionRows = await decisions().find({ userId: row._id }).sort({ createdAt: -1 }).toArray();
    const userDecisions = decisionRows.map((item) => item.payload);
    res.json({ user: publicUser(row), decisions: userDecisions });
  } catch (error) { next(error); }
});

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(cookieName, clearCookieOptions);
  res.status(204).end();
});

app.get('/api/auth/me', requireAuth, async (req: AuthedRequest, res) => {
  const row = await users().findOne({ _id: req.userId! });
  if (!row) return res.status(401).json({ error: 'Account not found.' });
  const decisionRows = await decisions().find({ userId: req.userId! }).sort({ createdAt: -1 }).toArray();
  res.json({ user: publicUser(row), decisions: decisionRows.map((item) => item.payload) });
});

app.patch('/api/auth/profile', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const input = profileSchema.parse(req.body);
    const mapping: Record<string, string> = {
      name: 'name', defaultCategory: 'defaultCategory', language: 'language',
      emailNotifications: 'emailNotifications', theme: 'theme',
    };
    const entries = Object.entries(input);
    if (!entries.length) return res.status(400).json({ error: 'Provide at least one profile setting.' });
    const setFields = Object.fromEntries(entries.map(([key, value]) => [mapping[key], value]));
    await users().updateOne({ _id: req.userId! }, { $set: setFields });
    const row = await users().findOne({ _id: req.userId! });
    if (!row) return res.status(401).json({ error: 'Account not found.' });
    res.json({ user: publicUser(row) });
  } catch (error) { next(error); }
});

app.post('/api/auth/change-password', requireAuth, authLimiter, async (req: AuthedRequest, res, next) => {
  try {
    const input = z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(8).max(128) }).strict().parse(req.body);
    const row = await users().findOne({ _id: req.userId! }, { projection: { passwordHash: 1 } });
    if (!row || !(await bcrypt.compare(input.currentPassword, row.passwordHash))) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await users().updateOne({ _id: req.userId! }, { $set: { passwordHash }, $inc: { authVersion: 1 } });
    const updatedUser = await users().findOne({ _id: req.userId! }, { projection: { authVersion: 1 } });
    if (!updatedUser) return res.status(401).json({ error: 'Account not found.' });
    issueSession(res, req.userId!, updatedUser.authVersion);
    res.json({ message: 'Password updated successfully.' });
  } catch (error) { next(error); }
});

const mailer = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
}) : null;

app.post('/api/auth/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const email = z.string().trim().email().max(254).parse(req.body?.email).toLowerCase();
    const row = await users().findOne({ email }, { projection: { _id: 1 } });
    let developmentResetUrl: string | undefined;
    if (row) {
      const token = randomBytes(32).toString('base64url');
      const tokenHash = createHash('sha256').update(token).digest('hex');
      const now = Date.now();
      await passwordResets().deleteMany({ $or: [{ userId: row._id }, { expiresAt: { $lte: new Date(now) } }] });
      await passwordResets().insertOne({
        tokenHash, userId: row._id, expiresAt: new Date(now + 60 * 60 * 1000), createdAt: new Date(now),
      });
      const resetUrl = `${appOrigin}/reset-password?token=${encodeURIComponent(token)}`;
      if (mailer && process.env.MAIL_FROM) {
        await mailer.sendMail({
          from: process.env.MAIL_FROM, to: email, subject: 'Reset your DecideMate password',
          text: `Use this link within 60 minutes to reset your password: ${resetUrl}`,
        });
      } else if (!isProduction) {
        developmentResetUrl = resetUrl;
        console.info(`Development password reset link for ${email}: ${resetUrl}`);
      } else {
        await passwordResets().deleteOne({ tokenHash });
      }
    }
    res.json({ message: 'If an account exists, password reset instructions will be sent.', developmentResetUrl });
  } catch (error) { next(error); }
});

app.post('/api/auth/reset-password', authLimiter, async (req, res, next) => {
  try {
    const input = z.object({ token: z.string().min(20).max(200), password: z.string().min(8).max(128) }).strict().parse(req.body);
    const tokenHash = createHash('sha256').update(input.token).digest('hex');
    const reset = await passwordResets().findOneAndDelete({ tokenHash, expiresAt: { $gt: new Date() } });
    if (!reset) return res.status(400).json({ error: 'This reset link is invalid or expired. Request a new one.' });
    const hash = await bcrypt.hash(input.password, 12);
    await users().updateOne({ _id: reset.userId }, { $set: { passwordHash: hash }, $inc: { authVersion: 1 } });
    await passwordResets().deleteMany({ userId: reset.userId });
    res.clearCookie(cookieName, clearCookieOptions);
    res.json({ message: 'Password updated. Please sign in with your new password.' });
  } catch (error) { next(error); }
});

app.get('/api/decisions', requireAuth, async (req: AuthedRequest, res) => {
  const rows = await decisions().find({ userId: req.userId! }).sort({ createdAt: -1 }).toArray();
  res.json({ decisions: rows.map((row) => row.payload) });
});

app.post('/api/decisions', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const decision = decisionSchema.parse(req.body) as Decision;
    await decisions().insertOne({ _id: decision.id, userId: req.userId!, payload: decision, createdAt: new Date() });
    res.status(201).json({ decision });
  } catch (error) { next(error); }
});

app.put('/api/decisions/:id', requireAuth, async (req: AuthedRequest, res, next) => {
  try {
    const decision = decisionSchema.parse(req.body) as Decision;
    const decisionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (decision.id !== decisionId) return res.status(400).json({ error: 'Decision ID does not match the request.' });
    const result = await decisions().updateOne(
      { _id: decision.id, userId: req.userId! },
      { $set: { payload: decision } },
    );
    if (!result.matchedCount) return res.status(404).json({ error: 'Decision not found.' });
    res.json({ decision });
  } catch (error) { next(error); }
});

app.delete('/api/decisions/:id', requireAuth, async (req: AuthedRequest, res) => {
  const decisionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await decisions().deleteOne({ _id: decisionId, userId: req.userId! });
  if (!result.deletedCount) return res.status(404).json({ error: 'Decision not found.' });
  res.status(204).end();
});

app.delete('/api/decisions', requireAuth, async (req: AuthedRequest, res) => {
  await decisions().deleteMany({ userId: req.userId! });
  res.status(204).end();
});

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const generatedDecisionSchema = z.object({
  suitabilityScore: z.number().min(0).max(10),
  suitabilitySummary: z.string().min(1).max(1000),
  recommendedOption: z.object({ title: z.string(), subtitle: z.string().optional(), price: z.string().optional(), rating: z.number().min(0).max(5).optional(), reviewsCount: z.number().int().nonnegative().optional(), badge: z.string().optional(), specs: z.array(z.string()).max(15), isRecommended: z.boolean().optional(), pros: z.array(z.string()).optional(), cons: z.array(z.string()).optional() }),
  alternatives: z.array(z.object({ title: z.string(), subtitle: z.string().optional(), price: z.string().optional(), rating: z.number().min(0).max(5).optional(), reviewsCount: z.number().int().nonnegative().optional(), badge: z.string().optional(), specs: z.array(z.string()).max(15), pros: z.array(z.string()).optional(), cons: z.array(z.string()).optional() })).min(1).max(3),
  pros: z.array(z.string()).max(10),
  cons: z.array(z.string()).max(10),
  whyRecommended: z.string().min(1).max(2000),
  comparison: z.array(z.object({ attribute: z.string(), recommended: z.string(), alt1: z.string(), alt2: z.string() })).max(10),
});

app.post('/api/recommendations', requireAuth, recommendationLimiter, async (req: AuthedRequest, res, next) => {
  try {
    const input = recommendationSchema.parse(req.body);
    if (!ai) return res.status(503).json({ error: 'Gemini is not configured. Add GEMINI_API_KEY to the server environment to get answers.' });

    let parsed: z.infer<typeof generatedDecisionSchema>;
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        contents: `Answer the user's decision question with practical, personalized decision support. Make the recommendation directly address the question. Do not invent current prices, ratings, reviews, specifications, or facts. When you cannot verify a fact, label it as an estimate or say it needs checking. Return JSON with these keys: suitabilityScore, suitabilitySummary, recommendedOption (title, subtitle, price, rating, reviewsCount, badge, specs, pros, cons), alternatives (same option fields), pros, cons, whyRecommended, comparison (rows with attribute, recommended, alt1, alt2).\nQuestion: ${input.question}\nCategory: ${input.category}\nPriority: ${input.priority}\nPreferences: ${input.preferences.join(', ') || 'none'}\nAdditional context: ${input.additionalDetails || 'none'}`,
        config: { responseMimeType: 'application/json' },
      });
      parsed = generatedDecisionSchema.parse(JSON.parse(response.text || '{}'));
    } catch (error) {
      const providerError = error as { status?: unknown; message?: unknown };
      const status = typeof providerError.status === 'number' ? providerError.status : undefined;
      const rawMessage = error instanceof Error ? error.message : String(providerError.message || error);
      const safeMessage = process.env.GEMINI_API_KEY
        ? rawMessage.replaceAll(process.env.GEMINI_API_KEY, '[redacted]')
        : rawMessage;
      console.error('Gemini recommendation failed:', { status, message: safeMessage });

      if (status === 401 || status === 403) {
        return res.status(502).json({ error: 'Gemini rejected the API key. Check that GEMINI_API_KEY is correct and enabled for the Gemini API, then restart the server.' });
      }
      if (status === 429) {
        return res.status(503).json({ error: 'Gemini is currently over its request or usage limit. Check your Google AI Studio quota and try again later.' });
      }
      if (status === 404) {
        return res.status(502).json({ error: 'The configured Gemini model was not found. Check GEMINI_MODEL in .env and restart the server.' });
      }
      if (error instanceof z.ZodError || error instanceof SyntaxError) {
        return res.status(502).json({ error: 'Gemini returned an answer in an unexpected format. Please try again.' });
      }
      return res.status(502).json({ error: 'Gemini could not answer this question. Check the API server terminal for the Gemini error, then try again.' });
    }
    const decision: Decision = {
      ...parsed,
      id: `dec-${randomBytes(12).toString('hex')}`,
      recommendationSource: 'gemini',
      question: input.question,
      category: input.category,
      priority: input.priority,
      preferences: input.preferences,
      additionalDetails: input.additionalDetails,
      createdAt: new Date().toISOString(),
      recommendedOption: { ...parsed.recommendedOption, id: 'option-recommended', isRecommended: true, badge: parsed.recommendedOption.badge || 'Best Choice' },
      alternatives: parsed.alternatives.map((option, index) => ({ ...option, id: `option-${index + 1}` })),
      isSaved: false,
    };
    res.json({ decision, source: 'gemini' as const });
  } catch (error) { next(error); }
});

if (isProduction) {
  const distPath = path.resolve('dist');
  app.use(express.static(distPath, { index: false, maxAge: '1h' }));
  app.get('*path', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof z.ZodError) return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request.' });
  if (error instanceof MongoServerError && error.code === 11000) {
    if (error.keyPattern?.email) return res.status(409).json({ error: 'An account with this email already exists.' });
    if (error.keyPattern?._id) return res.status(409).json({ error: 'This decision already exists.' });
  }
  console.error('API request failed:', error);
  return res.status(500).json({ error: 'The request could not be completed. Please try again.' });
});

async function start(): Promise<void> {
  await connectDatabase();
  const server = app.listen(port, '0.0.0.0', () => {
    console.info(`DecideMate API listening on http://localhost:${port}${ai ? ' (Gemini enabled)' : ' (Gemini API key missing; recommendations unavailable)'}`);
  });
  const shutdown = () => {
    server.close(() => {
      void closeDatabase().finally(() => process.exit(0));
    });
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

start().catch((error: unknown) => {
  console.error('Could not start DecideMate API:', error);
  process.exitCode = 1;
});
