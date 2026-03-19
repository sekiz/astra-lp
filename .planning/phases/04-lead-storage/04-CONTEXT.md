# Phase 4: Lead Storage & Launch - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Survey submissions are persisted to Airtable via the existing `/[lang]/api/waitlist` Route Handler. The handler currently has a Zod-validated stub that returns `{ success: true }`. Phase 4 replaces the stub with real Airtable writes. Duplicate emails are handled gracefully. A Lighthouse mobile audit on the deployed Vercel URL scores 90+ across LCP, CLS, and TBT. All LEAD-01–04 and PAGE-07 requirements must be satisfied.
</domain>

<decisions>
## Implementation Decisions

### Airtable Integration — fetch-based, not SDK
- Use Airtable REST API v0 directly via `fetch()` — avoids CJS/ESM conflicts with the `airtable` npm package in Next.js App Router
- Endpoint: `https://api.airtable.com/v0/{BASE_ID}/{TABLE_NAME}`
- Auth header: `Authorization: Bearer ${AIRTABLE_API_KEY}` (server-side env var only — never exposed to client)
- Method: POST to create a record

### Airtable Table Schema (to be created by user)
The user must create an Airtable base with a table named `Waitlist` (or configurable via env) with these fields:
- `FirstName` (Single line text)
- `LastName` (Single line text)
- `Email` (Email)
- `Role` (Single select or Single line text) — maps to q1
- `OrchestrationExperience` (Single line text) — maps to q2
- `FinanceInterest` (Single line text) — maps to q3
- `ExcitedAbout` (Single line text) — maps to q4
- `Locale` (Single line text)
- `SubmittedAt` (Date)

### Duplicate Email Handling (LEAD-03)
- Before writing, query Airtable for existing record with same email using filterByFormula
- If found: return `{ success: true }` silently (no error to user)
- This avoids showing an "already registered" message that could alienate users

### Environment Variables
- `AIRTABLE_API_KEY` — personal access token (server-side only, no NEXT_PUBLIC_ prefix)
- `AIRTABLE_BASE_ID` — base ID starting with `app...`
- `AIRTABLE_TABLE_NAME` — table name (default: `Waitlist`)
- All three go in `.env.local` for dev, and Vercel dashboard for production

### Error Handling (LEAD-04)
- Network errors or Airtable API errors: return `{ error: 'Service temporarily unavailable' }` with status 503
- Never expose internal details, stack traces, or Airtable error messages to the client
- Log errors server-side only (console.error in production logs)

### Lighthouse Optimizations (PAGE-07)
Target: Mobile 90+ on LCP, CLS, TBT
Key optimizations:
1. **Font loading**: Add `font-display: swap` / use `next/font` instead of bare CSS import — prevents render-blocking
2. **No layout shift**: All images/icons have explicit dimensions; modal is client-only (no SSR mismatch)
3. **LCP**: Hero h1 is SSR'd (no JS required) — already correct. Radial gradient is CSS-only.
4. **TBT**: No heavy JS on main thread during load. All interactivity is deferred (modal only loads on click).
5. **Meta viewport**: Already in Next.js default `<head>`
6. **Google Fonts**: Replace CSS `@import` in globals.css with `next/font/google` for `Inter` — eliminates render-blocking font request

### next/font Migration
- Current: `--font-sans: ui-sans-serif, system-ui, ...` — no external font loaded (OK for performance)
- Action: Add `Inter` from `next/font/google` in layout.tsx, apply via CSS variable
- This is already a system font stack — may not need change if Lighthouse is already 90+
- Run audit first; only optimize if score is below 90

### Plan Structure
- 04-01: Lead storage tests + Airtable service + updated Route Handler
- 04-02: Lighthouse audit + any performance fixes needed
- 04-03: Final integration test on Vercel (production smoke test)
</decisions>

<code_context>
## Existing Code Insights

### Route Handler Location
`app/[lang]/api/waitlist/route.ts` — already has Zod validation. Phase 4 replaces the stub body.

### Zod Schema (already in route.ts)
```ts
const WaitlistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  q1: z.string().min(1),
  q2: z.string().min(1),
  q3: z.string().min(1),
  q4: z.string().min(1),
  consent: z.literal(true),
  locale: z.enum(['en', 'tr']).optional(),
})
```

### New Files
- `lib/airtable.ts` — Airtable fetch helper (createRecord, checkDuplicate)

### Modified Files
- `app/[lang]/api/waitlist/route.ts` — replace stub body with Airtable write
- `.env.local` — add AIRTABLE_* env vars (placeholder values for dev)
- `app/[lang]/layout.tsx` — next/font integration if needed

### SEO Reminder
Vercel deploy URL: https://astra-lp.vercel.app — Lighthouse audit runs against this URL
</code_context>

---

*Phase: 04-lead-storage*
*Context gathered: 2026-03-19*
