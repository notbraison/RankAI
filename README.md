# AEOlyzer — SEO & AEO Analysis Platform

A modern, high-performance SEO and AEO (Answer Engine Optimization) analyzer built with **Next.js 15**, **Tailwind CSS**, **Lucide React**, and **Supabase**.

## Features

### Core Functionality
- **Landing Page** — Dark-mode SaaS aesthetic with URL input bar, example sites, and feature pills
- **6-Step Loading Animation** — Visual progress through HTML fetching, DOM parsing, meta tag analysis, entity extraction, schema detection, and LLM readability testing
- **Interactive Dashboard** — Multi-tab interface for deep analysis and comparison

### Dashboard Quadrants
1. **Health Gauges** — Circular SVG gauges showing SEO Score and AEO Readiness (0-100) with letter grades
2. **Actionable Insights** — Filterable checklist (Critical/Warning/Opportunity) with expandable fixes for SEO & AEO improvements
3. **Entity Authority Map** — Tag cloud visualization showing detected entities by type and relevance score
4. **AI Citation Preview** — Simulates ChatGPT/Gemini citations with schema coverage and direct-answer paragraph analysis

### Additional Views
- **Meta & Structure Tab** — Full breakdown of meta tags, OpenGraph, Twitter, canonical URLs, and heading hierarchy
- **Competitor Comparison Tab** — Side-by-side radar chart comparing SEO/AEO scores, schema types, meta tags, and entities
- **Scan History** — All results persisted to Supabase for future comparison

## Tech Stack

- **Framework** — Next.js 13 (App Router) with Server Actions
- **Styling** — Tailwind CSS 3.3 + custom CSS animations
- **UI Components** — Lucide React icons, custom SVG gauges & radar charts
- **Database** — Supabase (PostgreSQL)
- **Charts** — Custom SVG implementations (no external chart library dependencies for React compatibility)
- **Typography** — Inter font (Google Fonts)

## Getting Started

### 1. Clone & Install Dependencies

```bash
# Extract the project
tar -xzf project-clean.tar.gz
cd project

# Install dependencies
npm install
```

### 2. Environment Setup

The project includes a `.env` file with Supabase credentials. Verify it contains:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The Supabase migration has already been applied. To verify your tables:

```bash
# Check Supabase dashboard > SQL Editor or run:
npx supabase db list
```

The `scan_results` table stores:
- `id` — UUID primary key
- `url` — scanned URL
- `seo_score` — SEO health score (0-100)
- `aeo_score` — AEO readiness score (0-100)
- `entities` — detected entities (JSONB array)
- `schema_types` — detected JSON-LD schema types
- `meta_tags` — meta tag analysis results
- `headings` — H1-H6 hierarchy
- `insights` — actionable recommendations
- `ai_preview` — AI citation preview text

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start scanning!

### 5. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
project/
├── app/
│   ├── page.tsx              # Landing page with URL input
│   ├── layout.tsx            # Root layout
│   ├── actions.ts            # Server Actions (scanUrl, getRecentScans)
│   └── globals.css           # Global styles
├── components/
│   ├── Dashboard.tsx         # Main results view with tabs
│   ├── ScoreGauge.tsx        # SVG circular progress gauge
│   ├── EntityMap.tsx         # Entity tag cloud + relevance bars
│   ├── AiPreviewCard.tsx     # AI citation preview
│   ├── InsightsList.tsx      # Filterable insights checklist
│   ├── LoadingSteps.tsx      # 6-step animated progress
│   ├── MetaTagsPanel.tsx     # Meta tags & heading breakdown
│   └── ComparisonView.tsx    # Radar chart competitor comparison
├── lib/
│   ├── supabase.ts           # Supabase client & types
│   └── analyzer.ts           # Mocked SEO/AEO analysis engine
├── supabase/
│   └── migrations/           # Database schema
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── tailwind.config.ts        # Tailwind customization
└── next.config.js            # Next.js config (Server Actions enabled)
```

## Analysis Engine

### How It Works

The analyzer is **seeded by URL** for consistent results on repeat scans:

1. **SEO Score** — Based on meta tags, canonical, OG data, robots directives (0-100)
2. **AEO Score** — Based on JSON-LD schemas (FAQ, Article, HowTo), entity recognition, direct-answer paragraphs (0-100)
3. **Insights** — Auto-generates Critical/Warning/Opportunity fixes based on missing schemas and meta tags
4. **Entities** — Extracts topic, technology, person, product, location types with relevance scores
5. **AI Preview** — Creates a synthetic 2-3 sentence summary simulating how an LLM would cite the page

### Customization

To modify the analysis logic:
- Edit `lib/analyzer.ts` — adjust scoring weights, entity pools, insight generation
- Modify `ENTITY_POOLS` to add domain-specific entities
- Update `getGrade()` thresholds for custom letter grade cutoffs

## Deployment

### Vercel (Recommended)

```bash
# Connect your GitHub repo and deploy
vercel
```

### Netlify

The project includes a `netlify.toml` for automatic deployments.

### Docker

```bash
docker build -t aeolyzer .
docker run -p 3000:3000 aeolyzer
```

## Performance

- **Landing Page** — ~12.7 kB JS, ~95 kB total (with shared chunks)
- **CSS-in-JS** — All animations via Tailwind CSS (no runtime overhead)
- **Server Actions** — No API route overhead; direct server-side execution
- **SVG Charts** — Lightweight, no heavy charting libraries

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome 90+)

## Customization

### Colors

Edit `tailwind.config.ts` to customize the dark theme. Current palette:
- **Primary** — Blue (`#3b82f6`)
- **Accent** — Cyan (`#06b6d4`)
- **Success** — Emerald (`#10b981`)
- **Warning** — Amber (`#f59e0b`)
- **Error** — Red (`#ef4444`)
- **Neutral** — Zinc (`#71717a`)

### Mock Data

To use real HTML scraping instead of mocked data:
1. Replace `analyzeUrl()` in `lib/analyzer.ts` with actual HTML parsing (jsdom, cheerio)
2. Update `scanUrl()` Server Action to fetch and parse real pages
3. Add URL validation and error handling

## Troubleshooting

### Build Errors

If you encounter TypeScript errors:
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Supabase Connection Issues

- Verify `.env` file has correct credentials
- Check Supabase project > Settings > API > Generate new keys if needed
- Ensure RLS policies are enabled on `scan_results` table

### Slow Scans

- Loading animation simulates network delay (5.2s). Adjust `setTimeout()` in `app/page.tsx` line 45 to reduce
- Supabase queries should be <100ms; check database performance in Supabase Dashboard

## Future Enhancements

- Real HTML scraping with jsdom/cheerio
- Lighthouse integration for performance metrics
- Historical trend charts
- Bulk scanning API
- Browser extension for quick scans
- Custom entity pool per industry
- Email report generation

## License

MIT

## Support

For issues or feature requests, contact support or submit a GitHub issue.
