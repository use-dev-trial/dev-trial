# DevTrial Frontend

## Set up environment variables

```bash
# Create .env file (by copying from .env.example)
cp .env.example .env
```

## Quick Start

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Update database types

```bash
npx supabase gen types typescript --project-id "jqjxalsmucoianxyrxvr" --schema public > ./src/database/database.types.ts
```
