# NewsHub — a Google News clone (powered by NewsData.io)

A full-stack, server-rendered **Google News** style reader built with **Next.js 14 (App Router)** and **TypeScript**. Every headline comes live from the [NewsData.io](https://newsdata.io) REST API.

![Stack](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![NewsData.io](https://img.shields.io/badge/API-NewsData.io-orange)

## Features

- **Live latest headlines** via NewsData.io `/latest`, rendered with React Server Components (SSR).
- **Keyword search** — a search bar that routes to the dynamic `/search/[q]` page.
- **Category pill filters** — Top, World, Business, Technology, Science, Health, Sports, Entertainment, Politics, Environment — each a dynamic `/category/[slug]` route.
- **Country dropdown** using NewsData.io country codes (us, gb, in, ca, au, de, fr, jp, sg, ae…).
- **Breaking-news ticker** that refreshes every **60 seconds** from an internal `/api/breaking` route handler.
- **`next/image` optimization** for article thumbnails, with graceful placeholders.
- **Suspense boundaries** for streaming — the page shell and ticker render instantly while the feed loads.
- **TypeScript throughout** and a small, dependency-light codebase (Next + React only).

## Quick start

### 1. Get a free API key

Create a free account at **https://newsdata.io** and copy your API key from the dashboard.

### 2. Configure the environment

The app reads the key from the `NEWSDATA_API_KEY` environment variable. Copy the example file and paste your key:

```bash
cp .env.example .env.local
# then edit .env.local and set NEWSDATA_API_KEY=...
```

The key is **never hardcoded** — if it is missing, the app renders a clear message instead of crashing.

### 3. Install and run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Production build

```bash
npm run build
npm run start
```

## How it works

| Route | Description |
| --- | --- |
| `/` | Top headlines (SSR) + ticker + controls |
| `/category/[slug]` | Headlines filtered by NewsData.io category |
| `/search/[q]` | Keyword search results |
| `/api/breaking` | JSON endpoint polled by the ticker every 60s |

All NewsData.io calls live in `lib/newsdata.ts` (server-only). Responses are cached for 60 seconds with Next.js `revalidate`, and pagination uses the `nextPage` token returned by the API ("More headlines →").

## Free-tier friendly (important)

This project is designed to run on the **free NewsData.io plan**. It only uses free endpoints and parameters: `/latest` with `q`, `category`, `country`, `language` and `page`.

The following NewsData.io features require a **paid plan** and are deliberately **not** part of the core flow:

- `sentiment` analysis
- AI fields: `ai_tag`, `ai_region`, `ai_org`, `ai_summary`
- the historical `/archive` endpoint and long date ranges
- advanced full-text query operators

If the API ever responds with `403`/`422` ("upgrade your plan"), `401` (invalid key) or `429` (rate limited), the app detects it, shows a friendly notice, and keeps working. Empty result sets are handled too.

## Project structure

```
app/
  layout.tsx              # shell, header, footer
  page.tsx                # home (top headlines)
  globals.css
  category/[slug]/page.tsx
  search/[q]/page.tsx
  api/breaking/route.ts   # ticker data source
components/
  Controls.tsx            # search bar + category pills + country dropdown (client)
  BreakingTicker.tsx      # 60s polling ticker (client)
  NewsFeed.tsx            # server feed + cards + skeleton
lib/
  newsdata.ts             # NewsData.io client (server-only)
  constants.ts            # categories + country codes
```

## License

MIT — a demo showcase for the NewsData.io API.
