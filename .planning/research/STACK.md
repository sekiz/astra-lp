# Technology Stack

**Project:** Astra OS — Landing Page
**Researched:** 2026-03-19
**Confidence:** MEDIUM-HIGH (Next.js/Vercel from official docs; library versions from training data at Aug 2025 cutoff — verify before install)

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x | SSR/SSG framework | App Router + React 19; Server Actions handle LinkedIn OAuth callback and form submission without a separate API server; static export possible for pure CDN delivery if backend is dropped later; Turbopack dev is stable |
| React | 19.x | UI layer | Bundled with Next.js 15; concurrent features and Actions API reduce boilerplate for form state |
| TypeScript | 5.x | Type safety | `next.config.ts` now natively supported; reduces runtime errors in OAuth flow and form handling |

**Why Next.js over Astro:** Astro is excellent for content-only sites but LinkedIn OAuth requires a server-side callback route (exchanging auth code for access token — client secret must never be exposed). Next.js Route Handlers handle this natively. Astro SSR adapters add complexity without benefit here. The project also has interactive qualification forms that benefit from React component state.

**Why Next.js over plain Vite/React SPA:** SPAs require a separate backend for OAuth. Next.js collapses frontend + serverless API into one deployment unit on Vercel.

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | 4.x | Utility-first styling | v4 uses native CSS cascade layers and CSS variables instead of PostCSS config — zero-config, faster build. Best-in-class DX for landing pages where every element is custom. No runtime CSS-in-JS overhead hurts Core Web Vitals. |
| CSS Variables (native) | — | Theme tokens | Tailwind v4 exposes design tokens as CSS vars automatically; no extra theming library needed |

**Why not styled-components / Emotion:** Runtime CSS-in-JS increases bundle size and LCP time. Landing page conversion is directly correlated with Core Web Vitals. Tailwind produces zero runtime overhead.

**Why not CSS Modules:** Reasonable choice but slower iteration. Tailwind colocates styles with markup, reducing context switching during rapid landing page iteration.

### Animation / Interaction

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Motion (Framer Motion) | 11.x | Scroll-triggered animations, entrance effects, layout transitions | The `motion` package (rebranded from `framer-motion` in v11) is the standard for React animation. `useInView` + `variants` pattern covers 90% of landing page animation needs. Server-Component-safe with `'use client'` boundaries. Tree-shakeable. |
| CSS animations (native) | — | Simple transitions, hover states | For performance-critical, non-JS-dependent effects (button hovers, color transitions). Reduces JS bundle size by not reaching for Motion for trivial effects. |

**Why not GSAP:** GSAP is more powerful but requires a license for commercial plugins (ScrollTrigger requires GSAP Club for commercial use). Motion is MIT-licensed and integrates with React state natively. For a landing page, Motion is sufficient.

**Why not Lottie:** Adds ~100KB+ for complex SVG animations. Overkill unless the design spec requires pre-composed animation files from a designer. Not recommended without explicit design requirement.

### Internationalization (EN + TR)

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| next-intl | 3.x | Bilingual routing and translation | Purpose-built for Next.js App Router. Supports locale-based routing (`/en/`, `/tr/`), Server Component translations (zero client JS for static text), and TypeScript-safe message keys. Actively maintained as of 2025. |

**Implementation pattern:** Route structure `/[locale]/page.tsx` with middleware for locale detection (Accept-Language header + browser preference). Static messages in `messages/en.json` and `messages/tr.json`. No runtime translation API calls — all content is bundled at build time.

**Why not i18next / react-i18next:** Designed for SPAs, adds client-side hydration overhead. next-intl is native to App Router and uses React Server Components properly.

**Why not next-translate:** Smaller community, less active maintenance compared to next-intl.

### LinkedIn OAuth

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| NextAuth.js (Auth.js) | 5.x (beta) / 4.x (stable) | LinkedIn OAuth provider + session management | Handles the OAuth 3-legged flow (authorization code exchange) server-side. Built-in LinkedIn provider. Session stored in signed JWT cookie — no database required for the landing page use case. |
| LinkedIn OAuth 2.0 API | — | Identity provider | Standard authorization code flow. Scopes: `openid`, `profile`, `email` (OIDC-based, current API). Returns first name, last name, email. Auth code expires in 30 minutes — must exchange immediately via server-side route. |

**Auth.js v5 vs v4 decision:** Auth.js v5 is in beta but designed for App Router. If stability is a concern, use v4 with Pages Router compatibility layer. Recommendation: **use v5 beta** — the LinkedIn provider is well-tested, and v4 will reach EOL. The project scope (landing page, not production app) tolerates beta risk.

**LinkedIn scopes needed:**
- `openid` — OIDC flow (preferred over legacy `r_liteprofile`)
- `profile` — First name, last name, profile picture
- `email` — Email address

**Important:** LinkedIn's legacy `r_liteprofile` + `r_emailaddress` scopes are deprecated in favor of OpenID Connect. Use `openid profile email` with the OIDC endpoint (`https://api.linkedin.com/v2/userinfo`) for new applications.

### Form Handling + Lead Capture Backend

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| React Hook Form | 7.x | Client-side form state and validation | Minimal re-renders, uncontrolled inputs, excellent DX. Standard for React forms in 2025. |
| Zod | 3.x | Schema validation | Type-safe validation shared between client (RHF resolver) and server (Route Handler input validation). One schema = both layers. |
| Next.js Route Handler | (built-in) | Form submission API endpoint | `app/api/waitlist/route.ts` receives POST with lead data. No separate backend service. |
| Resend | 1.x | Transactional email (confirmation) | Simple REST API for sending confirmation emails. Generous free tier (3,000 emails/month). Alternative to SendGrid which has a more complex setup. Optional — only needed if confirmation email is in scope. |

**Lead storage options (choose one):**
1. **Airtable** (via REST API) — Zero-infrastructure, spreadsheet UI for reviewing leads. Ideal for early waitlist (<1,000 entries). Use `@airtable/blocks` or direct REST.
2. **Supabase** (PostgreSQL) — If relational queries or CRM integration are needed later. Adds infra complexity but scales.
3. **Notion API** — If the team already lives in Notion. Ergonomic for non-technical founders to review.

**Recommendation: Airtable** for this milestone. Zero setup, shareable with non-technical team members, and the free tier supports 1,000 records. When the waitlist exceeds capacity, migrate to Supabase.

### Deployment / Hosting

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Vercel | — | Hosting + serverless functions | Zero-config Next.js deployment. Preview URLs per branch. Edge Network CDN. Route Handlers run as serverless functions automatically. Free Hobby tier supports this project (100GB bandwidth, unlimited deployments). LinkedIn OAuth callback URL can be set per environment (preview vs production). |

**Why not Netlify:** Netlify's Next.js support (via `@netlify/plugin-nextjs`) lags Vercel's native support. Route Handlers and App Router edge cases are better handled on Vercel.

**Why not self-hosted / VPS:** Unnecessary operational overhead for a landing page. Vercel's free tier is sufficient.

**Why not Cloudflare Pages:** Worker runtime has Node.js compatibility constraints that can complicate Auth.js session handling. Possible but adds friction.

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Next.js 15 | Astro 4 | Astro lacks server-side route for OAuth code exchange without adapter complexity |
| Framework | Next.js 15 | Remix | Smaller ecosystem, fewer LinkedIn OAuth examples; no meaningful advantage here |
| Styling | Tailwind CSS 4 | CSS Modules | Slower iteration; less community tooling for landing page patterns |
| Styling | Tailwind CSS 4 | Styled Components | Runtime CSS-in-JS hurts Core Web Vitals (LCP/CLS) |
| Animation | Motion (Framer) 11 | GSAP | Commercial license required for ScrollTrigger in commercial projects |
| Animation | Motion (Framer) 11 | Anime.js | Less React-native; no layout animation support |
| i18n | next-intl 3 | i18next | SPA-oriented, adds client bundle for what next-intl does server-side |
| Auth | Auth.js 5 | Custom OAuth | Auth.js handles CSRF, state param, token exchange, session — 200+ lines of security-critical code avoided |
| Lead Storage | Airtable | Supabase | Airtable has zero infra setup; overkill to provision a database for a waitlist |
| Deployment | Vercel | Netlify | Vercel is first-party for Next.js; App Router edge cases handled natively |

---

## Full Dependency List

```bash
# Core
npm install next@15 react@19 react-dom@19

# Styling
npm install tailwindcss@4 @tailwindcss/vite

# Animation
npm install motion

# Internationalization
npm install next-intl

# Authentication (LinkedIn OAuth)
npm install next-auth@beta

# Forms + Validation
npm install react-hook-form zod @hookform/resolvers

# Lead storage (Airtable option)
npm install airtable

# Optional: Confirmation email
npm install resend

# Dev dependencies
npm install -D typescript @types/node @types/react @types/react-dom
```

---

## Version Confidence Notes

| Package | Version | Confidence | Source |
|---------|---------|------------|--------|
| Next.js | 15.x | HIGH | Official Next.js blog (Oct 2024), verified |
| React | 19.x | HIGH | Official, ships with Next.js 15 |
| Tailwind CSS | 4.x | HIGH | Released early 2025, major version |
| Motion (Framer) | 11.x | MEDIUM | Training data (Aug 2025); verify `npm show framer-motion version` |
| next-intl | 3.x | MEDIUM | Training data; verify `npm show next-intl version` |
| Auth.js (next-auth) | 5.0.0-beta | MEDIUM | Training data; v5 was in beta as of Aug 2025; check for stable release |
| React Hook Form | 7.x | HIGH | Stable major version, no breaking changes expected |
| Zod | 3.x | HIGH | Stable major version |
| Airtable SDK | 0.12.x | LOW | Verify — Airtable has restructured SDK; check current package name |

**Action before implementation:** Run `npm show [package] version` for any MEDIUM/LOW confidence entries to confirm current versions.

---

## LinkedIn API Notes (HIGH confidence — from official docs, verified Nov 2025)

LinkedIn OAuth 3-legged flow:
1. Redirect user to `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=...&redirect_uri=...&scope=openid%20profile%20email&state=...`
2. LinkedIn redirects back to `redirect_uri` with `code` param (30-minute expiry)
3. Server exchanges `code` for access token via POST to `https://www.linkedin.com/oauth/v2/accessToken`
4. Call `https://api.linkedin.com/v2/userinfo` (OIDC endpoint) to get name + email

**Critical:** Token exchange (step 3) requires `client_secret` — must happen server-side in a Route Handler, never in client-side code. Auth.js handles this automatically.

**App registration required:** LinkedIn Developer Portal app must be approved for "Sign In with LinkedIn using OpenID Connect" product. This can take 24-48 hours for approval.

---

## Sources

- Next.js 15 official release blog: https://nextjs.org/blog/next-15 (Oct 2024, verified)
- LinkedIn OAuth 3-legged flow: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow (updated Nov 2025, verified)
- Vercel deployment docs: https://vercel.com/docs/deployments/overview (verified)
- Tailwind CSS v4: https://tailwindcss.com/blog/tailwindcss-v4 (training data, MEDIUM confidence)
- Auth.js (next-auth v5): https://authjs.dev (training data, MEDIUM confidence)
- Motion library: https://motion.dev (training data, MEDIUM confidence)
- next-intl: https://next-intl-docs.vercel.app (training data, MEDIUM confidence)
