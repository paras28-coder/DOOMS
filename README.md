# DecideMate AI ⚡

<p align="center">
  <strong>Smarter Decisions. A Brighter Future.</strong><br>
  A modern decision-support dashboard with a futuristic visual design, built with React, Vite, Tailwind CSS, Lucide icons, and Motion.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Framer_Motion-12.0-black?logo=framer&logoColor=white" alt="Framer Motion">
  <img src="https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</p>

---

## 🌟 Key Features

- **Futuristic AI SaaS Design**: Custom cyberpunk-inspired dark theme (`#070B14`, `#101A2D`, `#1677FF`, `#00D9FF`) with subtle neon glow effects and smooth Dark/Light mode switching.
- **Home Dashboard**: Instant decision prompt bar, category cards (*Education, Career, Finance, Shopping, Lifestyle, Other*), and quick decision history.
- **Multi-Step Decision Form**: 3-step progress bar (*Details → Preferences → Results*), priority selection, factor tags (*Budget Friendly, High Quality, Fast Delivery, Eco Friendly*), and constraints input.
- **Decision Recommendations**: Every new decision question is answered using Gemini on the server. If the Gemini key is missing or the provider is unavailable, the app reports an error and lets the user retry.
  - Suitability Score Gauge (**8.8 / 10**) with animated circular SVG glow.
  - Highlighted "Best Choice" recommendation card with ratings and pricing.
  - Interactive tabs: **Comparison Matrix**, **Pros & Cons**, and **Why We Recommend This**.
  - Alternative option cards with expandable specification modals.
- **Account-Scoped History & Bookmarks**:
  - Filter by category or search by query.
  - Bookmark favorite decisions into the **Saved** tab.
  - Delete or revisit decisions stored per account in MongoDB.
- **Accounts**: Email/password registration and login, HTTP-only sessions, profile settings, password change, and one-time password reset links.
- **Fully Responsive**: Optimized for desktop monitors, tablets, and smartphones with a collapsible mobile menu and bottom navigation bar.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
- **API**: Express + Zod validation + HTTP-only JWT session cookies
- **Database**: MongoDB (official Node.js driver)
- **Security**: bcrypt password hashing, Helmet security headers, same-origin request checks, and API rate limits
- **AI**: Server-side Gemini integration for decision question answers

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 22.13+ or 24+
- npm

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/decidemate-ai.git
cd decidemate-ai
```

### 2. Install dependencies and configure the server
```bash
npm ci
```

Copy `.env.example` to `.env` (`Copy-Item .env.example .env` in PowerShell). Set `MONGODB_URI` to a running local MongoDB instance or an Atlas connection string, and set `MONGODB_DB` to your database name. Set `JWT_SECRET` to a unique random value of at least 32 characters before deploying; for example, generate one with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.

Optional settings:

- `GEMINI_API_KEY`: required for Gemini to answer decision questions. Create a key in [Google AI Studio](https://aistudio.google.com/app/apikey); the local decision recommendation fallback is not used.
- SMTP variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`): enable password reset emails. Without SMTP in development, the reset URL is shown in the app and API console.
- In production, set `NODE_ENV=production`, `APP_ORIGIN` to the exact HTTPS origin, a strong `JWT_SECRET`, and SMTP settings if password recovery should be available.

### 3. Start frontend and API together
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The Vite server proxies `/api` requests to the Express API on port 3001.

## Data and deployment notes

User accounts, profiles, password hashes, decisions, and reset tokens are persisted in MongoDB. The API creates a unique email index, account-scoped decision index, and TTL index for expired reset tokens at startup. Passwords are hashed with bcrypt; sessions are signed, HTTP-only, same-site cookies. Reset tokens are one-use, expire after one hour, and only their SHA-256 hashes are stored. The Gemini key stays on the server.

The API is served by the same Express process in production. Build and start it with:

```bash
npm run build
npm start
```

For production, use MongoDB Atlas or another managed MongoDB deployment, keep the connection string in the host's secret manager, and restrict database network access. Existing SQLite data is not migrated automatically.

### Main flows

1. Register or sign in. Protected pages redirect to login when no valid session exists.
2. Start a decision. Gemini generates the answer and recommendation; if Gemini is unavailable, the app displays an error so you can retry.
3. Save, revisit, or delete recommendations. The API checks ownership for every decision operation.
4. Update profile preferences, change the password, or request a single-use password reset link.

Password reset emails require working SMTP configuration. The local development reset link is not returned in production.

### 4. Build for production
```bash
npm run build
```
Preview only the static frontend bundle (without the API):
```bash
npm run preview
```

---

## 📤 How to Push to GitHub (Step-by-Step)

If you haven't pushed this project to GitHub yet, follow these commands:

1. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new).
   - Name your repository (e.g. `decidemate-ai`).
   - Do **not** check "Initialize with README" (since we already have one).
   - Click **Create repository**.

2. **Push your code from your terminal**:
   ```bash
   # Initialize git (if not already initialized)
   git init

   # Stage all files
   git add .

   # Commit changes
   git commit -m "feat: initial commit for DecideMate AI"

   # Set default branch to main
   git branch -M main

   # Link to your GitHub repo (replace YOUR_USERNAME and REPO_NAME)
   git remote add origin https://github.com/YOUR_USERNAME/decidemate-ai.git

   # Push to GitHub
   git push -u origin main
   ```

---

## 🌐 Deploying to Production

Deploy the Node API and static frontend together on a Node host that supports a persistent disk. Configure the production environment variables above and use `npm run build` / `npm start`. A static-only Vite host cannot provide the API or database.

Use a host that can run a persistent Node process and reach your MongoDB deployment. Set `APP_ORIGIN` to the exact browser origin and serve the site over HTTPS so session cookies are secure.

---

## 📁 Directory Layout

```
decidemate-ai/
├── server/                 # Express API, auth, MongoDB, password reset, recommendations
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Reusable UI widgets (Logo, Navbar, Sidebar, ScoreGauge, etc.)
│   ├── context/            # React Contexts (DecisionContext, ThemeContext)
│   ├── pages/              # App Pages (Dashboard, DecisionForm, AIResults, History, Settings, Login)
│   ├── utils/              # API client, recommendation engine, theme storage
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Root router & layout
│   ├── main.tsx            # DOM root
│   └── index.css           # Styling & neon theme variables
├── package.json            # Manifest & dependencies
├── tsconfig.server.json    # Backend TypeScript build
├── tsconfig.json           # Compiler configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
