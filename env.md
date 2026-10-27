# DecideMate environment setup

This guide explains the settings in `.env.example` in simple words. The app reads these settings on the **server**; do not put private keys in frontend code.

## 1. Make your local environment file

From the project folder, copy the example file:

```powershell
Copy-Item .env.example .env
```

Edit `.env` with a text editor. Keep the file private: `.env` is ignored by Git. Commit `.env.example`, but never commit `.env` or paste its contents into a public issue.

## 2. Required settings

### `MONGODB_URI` — database connection

The API needs MongoDB to save accounts and decisions.

- **Using MongoDB Atlas (hosted):** create a free cluster at [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), then in Atlas open **Database → Connect → Drivers**. Create a database user and allow your computer/server's IP under **Network Access**. Copy the Node.js connection string. Replace `<password>` with that database user's password and set the database name if desired.
- **Using MongoDB locally:** install and start MongoDB Community Server, then use `mongodb://127.0.0.1:27017`.

Example (replace the placeholders; do not use this as a real credential):

```env
MONGODB_URI=mongodb+srv://DB_USER:DB_PASSWORD@cluster.example.mongodb.net/?retryWrites=true&w=majority
```

If the password contains characters such as `@`, `:` or `/`, URL-encode them before putting them in the connection string. Keep this URI secret because it can grant database access.

### `JWT_SECRET` — signs login sessions

This must be a random secret with at least 32 characters in production. Generate one with Node.js:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Copy the generated value after `JWT_SECRET=`. Use a different secret for each environment. Do not share it or change it casually after launch, because changing it signs out current users.

## 3. Optional settings

### `GEMINI_API_KEY` — answers to decision questions (required for recommendations)

Every new decision question is sent to Gemini, and the result page is based on Gemini's answer. Create an API key in [Google AI Studio](https://aistudio.google.com/app/apikey), then put it after `GEMINI_API_KEY=`. Keep it on the server and do not add a `VITE_` prefix. If this key is missing or Gemini is temporarily unavailable, the app shows an error and asks you to try again instead of making up a local answer.

`GEMINI_MODEL` selects the model name. The example value is `gemini-2.5-flash`; keep it unless you intentionally choose another model available to your API key.

### SMTP settings — password reset emails

SMTP lets the app email password reset links. Leave these blank for local development; the app can show/log a reset link locally. For production, configure a mail provider that supports SMTP and use the host, port, login, and password supplied by that provider.

For a Gmail account, typical values are:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-address@gmail.com
SMTP_PASSWORD=your-google-app-password
MAIL_FROM=DecideMate <your-address@gmail.com>
```

Gmail requires 2-Step Verification and an **App Password**; use that password, not your normal Google password. Create it in your Google Account's **Security → App passwords** settings. Google may not offer App Passwords for every account. Other email providers have their own SMTP host and credentials. `MAIL_FROM` is the sender name/address your provider permits.

## 4. Other app settings

These usually need no changes for local development:

| Setting | What it controls | Typical value |
| --- | --- | --- |
| `NODE_ENV` | Runtime mode | `development` locally; `production` on your host |
| `PORT` | API server port | `3001` |
| `APP_ORIGIN` | Frontend website origin used by the API | `http://localhost:3000` locally; your exact `https://...` website URL in production |
| `MONGODB_DB` | MongoDB database name | `decidemate` |
| `MONGODB_MAX_POOL_SIZE` | Maximum simultaneous database connections | `20` |
| `SMTP_PORT` | Mail server port | `587` for the Gmail example |
| `SMTP_SECURE` | Whether SMTP uses implicit TLS | `false` for port `587`; typically `true` for port `465` |

When deploying, set these values in your hosting provider's **Environment Variables** or **Secrets** settings rather than uploading a `.env` file. Set `NODE_ENV=production`, `APP_ORIGIN` to the exact HTTPS frontend origin, and provide `MONGODB_URI` and a strong `JWT_SECRET`. Add Gemini and SMTP values only if you want those features enabled.

## 5. Example local setup

```env
NODE_ENV=development
PORT=3001
APP_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=decidemate
MONGODB_MAX_POOL_SIZE=20
JWT_SECRET=paste-a-random-secret-generated-with-the-command-above
GEMINI_API_KEY=paste-your-google-ai-studio-key-here
GEMINI_MODEL=gemini-2.5-flash
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
MAIL_FROM=
```

After saving `.env`, start the app with `npm run dev`. The API will report a startup error if it cannot connect to MongoDB or if required production settings are missing.

If a decision request fails, check the API/server terminal for the Gemini error. Make sure `GEMINI_API_KEY` in `.env` is not blank, that the key is valid for the Gemini API, and restart `npm run dev` after changing it. A `429` message means the key's available request quota or rate limit has been reached.
