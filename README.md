<div align="center">

# IntelliApply

### AI-Powered Job Application Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.3-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Claude API](https://img.shields.io/badge/Claude_API-Anthropic-cc785c?style=for-the-badge)](https://docs.anthropic.com/)

Track your job applications, analyze resume-job fit with AI, and generate tailored cover letters — all in one modern interface.

</div>

---

## Features

- **Dashboard** — Overview of all applications with real-time stats (applied, interviewing, offers, response rate)
- **Application Tracker** — Full CRUD for job applications with status tracking, salary ranges, notes, and filtering
- **AI Resume Match** — Paste a job description and get an instant AI-powered analysis of how your resume matches, with a score, strengths, gaps, and improvement suggestions
- **AI Cover Letter Generator** — Generate polished, tailored cover letters in multiple tones (professional, conversational, enthusiastic) based on your resume and the job description
- **Analytics** — Interactive charts showing application pipeline breakdown, weekly trends, and top companies
- **Authentication** — Secure sign-in with GitHub and Google via NextAuth.js

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Prisma ORM 6 |
| AI | Claude API (Anthropic SDK) |
| Auth | NextAuth.js v5 (beta) |
| Validation | Zod |
| Charts | Recharts |

## Screenshots

> Screenshots coming soon. The app features a modern dark theme with purple/blue accents.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Anthropic API key
- GitHub OAuth app (optional)
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/hodoabdirizak/intelliapply.git
   cd intelliapply
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your `.env` file with:
   - `DATABASE_URL` — PostgreSQL connection string
   - `NEXTAUTH_SECRET` — Random secret (`openssl rand -base64 32`)
   - `ANTHROPIC_API_KEY` — From [Anthropic Console](https://console.anthropic.com/)
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — From GitHub OAuth App settings
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — From Google Cloud Console

4. **Set up the database**

   ```bash
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── dashboard/          # Main dashboard with stats
│   ├── applications/       # Application CRUD (list, new, detail/edit)
│   ├── ai/                 # AI tools (resume match, cover letter)
│   ├── analytics/          # Charts and insights
│   └── api/                # REST API endpoints
├── components/             # Reusable React components
│   ├── ui/                 # Primitive UI components (Button, Card, etc.)
│   └── ...                 # Feature components
├── lib/                    # Server utilities (Prisma, auth, AI client)
└── types/                  # TypeScript type definitions
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/applications` | List all applications |
| `GET` | `/api/applications?id=xxx` | Get single application |
| `POST` | `/api/applications` | Create application |
| `PUT` | `/api/applications?id=xxx` | Update application |
| `DELETE` | `/api/applications?id=xxx` | Delete application |
| `POST` | `/api/ai/resume-match` | Analyze resume-job fit |
| `POST` | `/api/ai/cover-letter` | Generate cover letter |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_URL` | Yes | App URL (http://localhost:3000 for dev) |
| `NEXTAUTH_SECRET` | Yes | Random secret for session encryption |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude |
| `GITHUB_CLIENT_ID` | No | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | No | GitHub OAuth app client secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |

## License

MIT

---

<div align="center">
  Built by <a href="https://github.com/hodoabdirizak">Hodo Abdirizak</a>
</div>
