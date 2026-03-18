# Architecture Patterns

**Domain:** High-conversion product landing page — AI OS waitlist campaign
**Project:** Astra OS Landing Page
**Researched:** 2026-03-19
**Confidence:** HIGH (Next.js 16 official docs, LinkedIn OIDC official docs)

---

## Recommended Architecture

Next.js 15+ App Router with a hybrid Server/Client Component model. The page is primarily static HTML (Server Components), with narrow client islands for interactivity (auth flow, multi-step form). A minimal set of Route Handlers (`/api/...`) act as the serverless backend, keeping secrets server-side and brokering LinkedIn OIDC exchange + lead storage.

### High-Level System Diagram

```
Browser
  │
  ├── GET /[lang]                    → Next.js App Router (RSC, static)
  │     └── Page renders all sections as Server Components
  │           └── <WaitlistModal /> — 'use client' island
  │                 ├── Step 0: LinkedIn OAuth button
  │                 ├── Step 1–4: Qualifying questions (client state)
  │                 └── Step 5: Success screen
  │
  ├── GET /api/auth/linkedin         → Route Handler: redirects to LinkedIn
  ├── GET /api/auth/linkedin/callback→ Route Handler: exchanges code for token,
  │                                    fetches /v2/userinfo, sets session cookie
  └── POST /api/waitlist             → Route Handler: validates body, writes to
                                       Supabase (or Airtable), returns 200
```

---

## Component Boundaries

### Page-Level Components (Server Components — zero JS shipped)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `RootLayout` (`app/[lang]/layout.tsx`) | HTML shell, lang attr, metadata, ThemeProvider wrapper | `getDictionary(lang)` for i18n |
| `HeroSection` | Headline, subheadline, primary CTA button | Renders `<WaitlistTrigger>` (client) |
| `FeaturesSection` | 3-column grid: Linux kernel / Open Source / Agent Orchestration | Static content only |
| `WhyAstraSection` | Positioning narrative vs legacy OS incumbents | Static content only |
| `FinalCTASection` | Scarcity reinforcement, second waitlist entry point | Renders `<WaitlistTrigger>` (client) |
| `Footer` | Links, copyright, language switcher | `<LanguageSwitcher>` (client) |

### Client Components (interactive islands — `'use client'`)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `WaitlistTrigger` | Button that opens the modal overlay | Wraps `<WaitlistModal>` via portal |
| `WaitlistModal` | Full auth + qualifying flow orchestrator | `/api/auth/linkedin`, local state |
| `LinkedInButton` | Initiates OAuth redirect | `/api/auth/linkedin` (GET redirect) |
| `QualifyingForm` | 4-step question wizard post-auth | Reads pre-fill from URL params / cookie, POSTs to `/api/waitlist` |
| `LanguageSwitcher` | Toggles `/en` ↔ `/tr` routes | Next.js router (`useRouter`) |

### Route Handlers (serverless — Node.js runtime, secrets stay server-side)

| Route | Method | Responsibility |
|-------|--------|---------------|
| `app/api/auth/linkedin/route.ts` | GET | Builds LinkedIn authorization URL with `openid profile email` scopes + PKCE `state`, redirects browser |
| `app/api/auth/linkedin/callback/route.ts` | GET | Exchanges `code` for access token via `https://www.linkedin.com/oauth/v2/accessToken`, calls `https://api.linkedin.com/v2/userinfo`, stores profile in a short-lived signed cookie, redirects to `/?step=qualify` |
| `app/api/waitlist/route.ts` | POST | Validates payload (zod), writes lead record to Supabase `waitlist` table (or Airtable), returns `{ ok: true }` |

---

## Data Flow

### 1. Page Load Flow (SSR/Static)

```
Request: GET /en
  → middleware.ts: detect locale, rewrite to /en if default
  → app/[lang]/page.tsx (Server Component)
      → getDictionary('en') → loads dictionaries/en.json
      → renders all section components with translated props
      → HeroSection embeds <WaitlistTrigger> (client boundary)
  → Response: fully rendered HTML + minimal client JS for islands
```

### 2. LinkedIn OAuth Flow

```
User clicks "Join with LinkedIn"
  → WaitlistModal renders LinkedInButton
  → Button click: GET /api/auth/linkedin
      → Server generates: state (random nonce), PKCE code_verifier/code_challenge
      → Stores state+verifier in encrypted cookie (httpOnly, SameSite=Lax)
      → 302 redirect to:
         https://www.linkedin.com/oauth/v2/authorization
           ?response_type=code
           &client_id={LINKEDIN_CLIENT_ID}
           &redirect_uri={NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback
           &scope=openid%20profile%20email
           &state={nonce}

LinkedIn consent screen
  → User approves
  → LinkedIn redirects to: /api/auth/linkedin/callback?code=...&state=...

Callback handler
  → Validates state cookie matches returned state (CSRF protection)
  → POST https://www.linkedin.com/oauth/v2/accessToken
       { code, client_id, client_secret, redirect_uri, grant_type=authorization_code }
  → Receives { access_token, id_token }
  → GET https://api.linkedin.com/v2/userinfo (Authorization: Bearer <access_token>)
  → Receives { given_name, family_name, email, sub, picture }
  → Signs profile into a short-lived cookie (15 min TTL)
  → 302 redirect to /?modal=open&step=qualify
```

### 3. Qualifying Form Flow (Post-Auth)

```
WaitlistModal detects ?modal=open&step=qualify in URL
  → Reads pre-fill cookie: { given_name, family_name, email }
  → Renders Step 1–4 as in-memory state machine (no route changes)
  → Steps:
      Step 1: Role selector (Developer / Founder / AI Researcher / Product)
      Step 2: "Do you orchestrate AI agents?" (Yes / No)
      Step 3: "Interested in AI for finance/trading?" (Yes / No)
      Step 4: "What excites you about Astra OS?" (3 options)

User completes Step 4
  → POST /api/waitlist
       {
         given_name, family_name, email,   // from pre-fill cookie
         role, orchestrates_agents,         // Step 1–2
         finance_interest, motivation        // Step 3–4
         locale                             // 'en' | 'tr'
       }
  → Route Handler: zod validates, inserts row to Supabase
  → 200 { ok: true }
  → Modal transitions to Success screen
```

### 4. i18n Flow

```
Request: GET /tr/...
  → middleware: locale detected as 'tr', proceeds
  → app/[lang]/page.tsx: getDictionary('tr') → dictionaries/tr.json
  → All text tokens replaced with Turkish strings
  → <html lang="tr"> set in RootLayout
  → LanguageSwitcher shows "EN" as alternate

LanguageSwitcher click
  → router.push('/en') or router.push('/tr')
  → Next.js router navigation (client-side, full component re-render)
```

---

## Patterns to Follow

### Pattern 1: Narrow Client Boundaries

Keep all static content (Hero text, Features grid, Footer copy) as Server Components. Only the interactive modal and language toggle need `'use client'`. This minimises hydration cost and JS bundle size.

```tsx
// app/[lang]/page.tsx — Server Component
import HeroSection from '@/components/HeroSection'
import WaitlistTrigger from '@/components/WaitlistTrigger' // 'use client'

export default async function Page({ params }) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <HeroSection dict={dict.hero} cta={<WaitlistTrigger label={dict.cta.join} />} />
    </>
  )
}
```

### Pattern 2: Server-Side OAuth — Secrets Never Reach Client

`LINKEDIN_CLIENT_SECRET` is only read inside Route Handlers. The browser never touches it. The client only initiates a redirect; the token exchange is entirely server-side.

```ts
// app/api/auth/linkedin/callback/route.ts
import 'server-only'

const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: searchParams.get('code')!,
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!, // never in client bundle
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/linkedin/callback`,
  }),
})
```

### Pattern 3: Form State Machine (No URL Routing Between Steps)

The 4 qualifying steps live entirely in component state. No URL changes between steps 1–4 — this avoids scroll resets and back-button complications.

```tsx
// components/QualifyingForm.tsx — 'use client'
const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
const [answers, setAnswers] = useState<Partial<Answers>>({})

function handleAnswer(field: keyof Answers, value: string) {
  setAnswers(prev => ({ ...prev, [field]: value }))
  setStep(prev => (prev < 4 ? (prev + 1) as typeof prev : prev))
}
```

### Pattern 4: Dictionary-Keyed i18n (Next.js Native, No External Library)

Two JSON dictionaries (`en.json`, `tr.json`) loaded server-side. No runtime client overhead, no external i18n package required for a two-language site at this scale.

```
dictionaries/
  en.json   — all English copy keyed by section.token
  tr.json   — all Turkish copy, identical key structure
```

Pass the dictionary as props from Server Components down to all leaf components. Client Components receive only the strings they need as serialisable props.

### Pattern 5: Lead Storage via Supabase Route Handler

The Route Handler is the only writer. RLS policy on the `waitlist` table: `INSERT` allowed only from the service role (server-side), no anonymous insert from browser.

```ts
// app/api/waitlist/route.ts
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role — server only
)
await supabase.from('waitlist').insert({ ...validatedData })
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-Side LinkedIn Token Exchange

**What:** Handling `code → token` swap in the browser via a client-side fetch.
**Why bad:** Exposes `LINKEDIN_CLIENT_SECRET` in the JS bundle. LinkedIn will reject apps that do this, and it's a security failure.
**Instead:** All token exchange happens in `app/api/auth/linkedin/callback/route.ts` (server-side).

### Anti-Pattern 2: Storing Lead Data Directly From Browser to Supabase

**What:** Using the `anon` Supabase key in client code with a permissive RLS policy to insert directly.
**Why bad:** Anyone can inject arbitrary data, spam the list, or exfiltrate other rows if RLS is misconfigured.
**Instead:** Browser POSTs to `/api/waitlist`, which validates + inserts using the `service_role` key server-side.

### Anti-Pattern 3: Full Page Per Qualifying Step

**What:** Routing to `/step/1`, `/step/2`, etc. for the 4 qualifying questions.
**Why bad:** Each route change triggers a full scroll-to-top, potential re-render of the page behind the modal, and complex back-button state.
**Instead:** Single modal component with in-memory step state. URL only carries `?modal=open` flag.

### Anti-Pattern 4: Large Client Provider Wrapping Entire Layout

**What:** Wrapping the full `<html>` tree in a client context (auth context, i18n context).
**Why bad:** Turns the entire page into a client bundle, eliminating RSC benefits and hurting FCP.
**Instead:** Pass dictionary strings as props. Auth state is minimal — a pre-fill cookie read only by the modal component. No global context needed.

### Anti-Pattern 5: Hardcoding Copy Strings in Components

**What:** `<h1>The AI Operating System</h1>` directly in JSX.
**Why bad:** Makes bilingual support require parallel component variants.
**Instead:** All copy lives in `dictionaries/en.json` and `dictionaries/tr.json`. Components accept `dict` props.

---

## Suggested Build Order (Phase Dependencies)

The component structure creates natural build dependencies. Phases should respect this order:

```
Phase 1: Foundation
  → Project scaffold (Next.js, TypeScript, Tailwind)
  → i18n infrastructure (middleware, dictionaries, [lang] route)
  → Metadata + SEO (static metadata object, OG image, robots.txt, sitemap)
  → Reason: Everything else depends on i18n being in place first.
            SEO metadata must be in the layout before any content phase.

Phase 2: Static Page Sections (Server Components)
  → HeroSection
  → FeaturesSection
  → WhyAstraSection
  → FinalCTASection
  → Footer + LanguageSwitcher
  → Reason: No external dependencies — pure content + styling.
            Both English and Turkish copy written simultaneously.

Phase 3: LinkedIn OAuth Backend
  → Route Handlers: /api/auth/linkedin + /api/auth/linkedin/callback
  → Reason: Must exist before the form UI can be tested end-to-end.
            Requires LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET env vars.

Phase 4: Waitlist Modal + Qualifying Form (Client Components)
  → WaitlistTrigger, WaitlistModal
  → LinkedInButton → OAuth initiation
  → QualifyingForm (4-step state machine, pre-fill from cookie)
  → Reason: Depends on Phase 3 (OAuth callback must return the pre-fill cookie).

Phase 5: Lead Storage Backend
  → Supabase schema (waitlist table)
  → /api/waitlist Route Handler (validate + insert)
  → Reason: Depends on Phase 4 form structure being finalised (schema mirrors form fields).

Phase 6: Polish + QA
  → Responsive layout audit (mobile breakpoints)
  → Cross-browser test (LinkedIn OAuth redirect on mobile)
  → Copy review (EN + TR consistency)
  → Performance audit (Lighthouse — target 90+ on mobile)
```

---

## Scalability Considerations

| Concern | At 100 users (target) | At 10K users | At 1M users |
|---------|----------------------|--------------|-------------|
| Lead storage | Supabase free tier, single table | Supabase pro, add index on email | Partition table, add dedicated analytics sink |
| Page delivery | Vercel CDN static cache — instant | Same, no change needed | Same — static HTML scales indefinitely |
| OAuth rate limits | LinkedIn: no concern at 100 | LinkedIn: no concern at 10K | Monitor LinkedIn app throttle limits |
| API Routes | Single Vercel function per route | No change | Consider edge runtime for callback handler |
| Duplicate signups | Unique constraint on email in DB | Same | Add dedup queue in front of insert |

---

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `LINKEDIN_CLIENT_ID` | Server only | OAuth app identifier |
| `LINKEDIN_CLIENT_SECRET` | Server only | OAuth token exchange |
| `LINKEDIN_REDIRECT_URI` | Server only | Callback URL (must match LinkedIn app config) |
| `NEXT_PUBLIC_BASE_URL` | Public | Used client-side to construct redirect URI |
| `SUPABASE_URL` | Server only | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Bypasses RLS for server-side inserts |
| `SESSION_SECRET` | Server only | Signs the pre-fill cookie |

---

## SEO Architecture

The landing page targets AI/OS discovery searches. Configuration via Next.js static `metadata` export in `app/[lang]/layout.tsx`:

```ts
export const metadata: Metadata = {
  title: 'Astra OS — AI Operating System | Join the Closed Beta',
  description: 'Linux-based AI OS with kernel-level agent orchestration. First 100 developers shape the platform.',
  alternates: {
    canonical: 'https://astra.os/',
    languages: { 'tr': 'https://astra.os/tr' },
  },
  openGraph: {
    type: 'website',
    images: [{ url: '/opengraph-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
}
```

Key SEO decisions:
- `robots.txt`: Allow all, sitemap reference
- `sitemap.xml`: Two URLs (`/en`, `/tr`) with `hreflang` alternates
- `<html lang="...">` set dynamically per locale in RootLayout
- Streaming metadata is disabled for bots (Next.js default behaviour for known crawlers)
- All page content is in Server Components — fully indexable HTML, no JS required by crawlers

---

## Sources

- Next.js App Router i18n routing — https://nextjs.org/docs/app/guides/internationalization (v16.2.0, 2025-12-09) — HIGH confidence
- Next.js Server and Client Components — https://nextjs.org/docs/app/getting-started/server-and-client-components (v16.2.0, 2026-03-03) — HIGH confidence
- Next.js Route Handlers — https://nextjs.org/docs/app/api-reference/file-conventions/route (v16.2.0, 2026-03-03) — HIGH confidence
- Next.js Metadata API — https://nextjs.org/docs/app/getting-started/metadata-and-og-images (v16.2.0, 2026-03-03) — HIGH confidence
- LinkedIn Sign In with OpenID Connect — https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2 (updated 2024-08-08) — HIGH confidence
  - Authorization endpoint: `https://www.linkedin.com/oauth/v2/authorization`
  - Token endpoint: `https://www.linkedin.com/oauth/v2/accessToken`
  - UserInfo endpoint: `https://api.linkedin.com/v2/userinfo`
  - Required scopes: `openid profile email`
  - Returns: `given_name`, `family_name`, `email`, `email_verified`, `sub`, `picture`
- Supabase + Next.js integration pattern — MEDIUM confidence (training data; official quickstart URL access denied during research; pattern is well-established)
