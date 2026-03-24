# IntelliApply

Job application tracker with AI-powered resume matching and cover letter generation.

Built with Next.js 15, TypeScript, Tailwind v4, Prisma + PostgreSQL, and the Claude API.

## What it does

- Track job applications with status, salary, notes, location
- AI resume match — paste a JD and get a fit score with strengths/gaps/suggestions
- AI cover letter generator — multiple tones, pulls from your resume + the JD
- Dashboard with stats and charts (pipeline breakdown, weekly trends, top companies)
- Auth via GitHub/Google (NextAuth v5)

## Setup

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY
# optionally GITHUB_CLIENT_ID/SECRET and GOOGLE_CLIENT_ID/SECRET
npx prisma db push
npm run dev
```

## Structure

```
src/
├── app/           # pages + API routes
│   ├── dashboard/
│   ├── applications/
│   ├── ai/        # resume-match, cover-letter
│   ├── analytics/
│   └── api/
├── components/    # UI + feature components
├── lib/           # prisma, auth, anthropic client
└── types/
```

## License

MIT
