# AEOlyzer — Quick Start Guide

## 30-Second Setup

```bash
# 1. Extract
tar -xzf project-clean.tar.gz
cd project

# 2. Install
npm install

# 3. Start dev server
npm run dev

# 4. Open http://localhost:3000
```

## What You Get

A production-ready **SEO & AEO analyzer** with:

✅ **Dark SaaS UI** — Sleek landing page with gradient headline  
✅ **6-Step Loading Animation** — Visual progress with smooth transitions  
✅ **Interactive Dashboard** — 4-quadrant analysis view  
✅ **Live Charts** — SVG gauges, radar chart, entity tag cloud  
✅ **Competitor Comparison** — Side-by-side scoring radar  
✅ **Supabase Integration** — All scans automatically saved  
✅ **Server Actions** — No API routes needed  
✅ **Fully Responsive** — Mobile, tablet, desktop  
✅ **Type-Safe** — Full TypeScript support  
✅ **Production-Ready** — Builds & deploys to Vercel/Netlify  

## File Structure at a Glance

```
app/
  ├── page.tsx           👈 Landing page (URL input)
  ├── actions.ts         👈 Server Action (scanUrl)
  └── layout.tsx

components/
  ├── Dashboard.tsx      👈 Main results view
  ├── ScoreGauge.tsx     👈 SVG circular gauges
  ├── InsightsList.tsx   👈 Checklist of fixes
  ├── EntityMap.tsx      👈 Entity tag cloud
  ├── AiPreviewCard.tsx  👈 AI citation preview
  ├── LoadingSteps.tsx   👈 Progress animation
  ├── MetaTagsPanel.tsx  👈 Meta tags breakdown
  └── ComparisonView.tsx 👈 Radar chart competitor view

lib/
  ├── analyzer.ts        👈 Analysis engine (mocked data)
  └── supabase.ts        👈 Supabase client
```

## Environment Variables

Your `.env` file already has Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

No additional setup needed!

## Key Features to Try

### 1. Landing Page
- Enter any URL (e.g., `vercel.com`)
- Click example sites for instant scan
- Watch smooth loading animation

### 2. Dashboard
- **Overview Tab** — SEO/AEO scores + insights
- **Meta & Structure Tab** — Full meta tag breakdown
- **Comparison Tab** — Compare vs. competitor

### 3. Insights
- Filter by SEO/AEO
- Click to expand fixes
- Each insight explains the problem & solution

### 4. Competitor Comparison
- Scan your URL
- Enter competitor URL
- View radar chart + diff table

## Customization in 5 Minutes

### Change Colors
Edit `tailwind.config.ts`:
```js
colors: {
  blue: '#your-color',
  cyan: '#your-accent',
}
```

### Add More Entities
Edit `lib/analyzer.ts`, expand `ENTITY_POOLS`:
```js
tech: [
  { name: 'Your Technology', type: 'technology', relevance: 95 },
  // ...
]
```

### Adjust Loading Duration
Edit `app/page.tsx` line 45:
```js
setTimeout(() => { ... }, 5200); // Change 5200ms to desired delay
```

### Modify Insight Rules
Edit `lib/analyzer.ts`, adjust the `insights` array generation or scoring logic.

## Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
```

(Select project folder → deploy)

## Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=.next
```

## Build for Production

```bash
npm run build
npm start
```

Opens on port 3000 by default.

## Useful Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Common Questions

**Q: Can I use real HTML scraping?**  
A: Yes. Replace `analyzeUrl()` in `lib/analyzer.ts` with actual DOM parsing (jsdom, cheerio, playwright).

**Q: How do I add authentication?**  
A: Supabase Auth is optional. Currently anonymous access only. Add `supabase.auth.signUp()` to `lib/supabase.ts` to enable it.

**Q: Can I self-host?**  
A: Yes. Any Node.js host works (Railway, Render, Fly.io, Docker, etc.). Supabase is cloud-hosted, so configure your connection string in `.env`.

**Q: How do I modify the analysis engine?**  
A: Edit `lib/analyzer.ts`. Adjust scoring weights, add new metrics, customize entity detection. The mocked approach uses seeded randomization for consistency.

**Q: Can I connect a real SEO API?**  
A: Yes. Import a library like `moz-api` or `semrush-api`, call their endpoints in `scanUrl()` Server Action, and merge results into the scan object.

## Troubleshooting

**Build fails with TypeScript errors:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Supabase connection error:**
- Check `.env` file has correct URL & API key
- Verify database is running (Supabase Dashboard > Project Status)
- Ensure `scan_results` table exists

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

## Next Steps

1. **Customize branding** — Update logo, colors, company name
2. **Add authentication** — Implement Supabase Auth for user accounts
3. **Connect real scraper** — Replace mocked analyzer with jsdom/cheerio
4. **Add email reports** — Send scan results via SendGrid/Mailgun
5. **Build API** — Expose endpoints for bulk scanning
6. **Add analytics** — Track top-scanned domains, insights trends

---

**Ready to go!** 🚀 Run `npm run dev` and start analyzing.
