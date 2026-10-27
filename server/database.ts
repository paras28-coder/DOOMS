import { Collection, Db, MongoClient } from 'mongodb';
import { Decision } from '../src/types.js';

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  authVersion: number;
  defaultCategory: string;
  language: string;
  emailNotifications: boolean;
  theme: 'dark' | 'light';
  createdAt: Date;
}

export interface DecisionDocument {
  _id: string;
  userId: string;
  payload: Decision;
  createdAt: Date;
}

export interface PasswordResetDocument {
  _id?: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

let client: MongoClient | undefined;
let database: Db | undefined;

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is required. Set it in .env or the deployment environment.');

  const mongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10_000,
    maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE || 20),
  });
  try {
    await mongoClient.connect();
    const db = mongoClient.db(process.env.MONGODB_DB || 'decidemate');
    await Promise.all([
      db.collection<UserDocument>('users').createIndex({ email: 1 }, { unique: true, name: 'uniq_users_email' }),
      db.collection<DecisionDocument>('decisions').createIndex({ userId: 1, createdAt: -1 }, { name: 'decisions_by_user' }),
      db.collection<PasswordResetDocument>('password_resets').createIndex({ tokenHash: 1 }, { unique: true, name: 'uniq_reset_token_hash' }),
      db.collection<PasswordResetDocument>('password_resets').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'expire_password_resets' }),
    ]);
    client = mongoClient;
    database = db;
    console.info(`MongoDB connected to database "${db.databaseName}".`);
  } catch (error) {
    await mongoClient.close();
    throw error;
  }
}

function getDatabase(): Db {
  if (!database) throw new Error('MongoDB has not connected yet.');
  return database;
}

export function users(): Collection<UserDocument> {
  return getDatabase().collection<UserDocument>('users');
}

export function decisions(): Collection<DecisionDocument> {
  return getDatabase().collection<DecisionDocument>('decisions');
}

export function passwordResets(): Collection<PasswordResetDocument> {
  return getDatabase().collection<PasswordResetDocument>('password_resets');
}

export async function closeDatabase(): Promise<void> {
  if (!client) return;
  await client.close();
  client = undefined;
  database = undefined;
}
