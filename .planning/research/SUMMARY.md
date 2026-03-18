# Project Research Summary

**Project:** Astra OS — Landing Page
**Domain:** High-conversion waitlist landing page — AI OS closed-beta campaign
**Researched:** 2026-03-19
**Confidence:** MEDIUM-HIGH (OAuth and architecture HIGH; features and CRO patterns MEDIUM)

## Executive Summary

Astra OS needs a high-conversion waitlist landing page targeting a technical audience (developers, founders, AI practitioners). Research is unambiguous on the approach: Next.js 15 with the App Router on Vercel, with LinkedIn OAuth as the primary conversion mechanism and a 4-question qualifying survey post-auth. This stack is the only practical option for this feature set — LinkedIn OAuth requires a server-side token exchange (client secret must never reach the browser), ruling out purely static site generators like Astro or Vite SPAs. The hybrid Server/Client Component model in Next.js minimizes JS bundle size, maximizes Core Web Vitals scores, and keeps the entire product in a single deployment unit with no separate backend service.

The page's differentiation comes not from technical novelty but from execution discipline: LinkedIn OAuth reduces form friction by eliminating manual entry, "first 100" scarcity framing filters for high-intent signups without fake countdown timers, and copy written peer-to-peer (not marketed at developers) activates trust with a BS-averse audience. Bilingual EN + TR support is strategically valuable but carries 30-40% copy maintenance overhead and layout reflow risk — the recommendation is to ship EN-first and add TR in phase 2 with native-speaker copy, rather than launch with rushed or machine-translated Turkish.

The critical risks concentrate in two areas. LinkedIn OAuth has five known failure modes (client-side token exchange, authorization code expiry, redirect URI mismatch, scope approval delays, missing CSRF state) — all preventable with correct architecture, but the LinkedIn Developer Portal product approval can take 1-3 business days and must be initiated before any implementation begins. The second risk is conversion mechanics: research confirms a clear pattern separating 2-3% from 10%+ conversion rates, and the delta is almost entirely execution quality — copy specificity, friction reduction, and credible scarcity — not technology choices.

## Key Findings

### Recommended Stack

Next.js 15 (App Router) with TypeScript 5, Tailwind CSS 4, and Vercel deployment is the clear consensus stack. Tailwind v4's CSS-native approach (no PostCSS config, no runtime overhead) is ideal for a landing page where Core Web Vitals directly affect conversion. Motion (formerly Framer Motion) v11 handles scroll animations with MIT licensing and React-native integration. Auth.js v5 beta manages the LinkedIn OIDC flow, eliminating ~200 lines of security-critical OAuth boilerplate. Airtable is recommended for lead storage at waitlist scale (sub-1,000 entries, zero infrastructure, shareable with non-technical stakeholders); Supabase is the migration path if the waitlist scales or relational queries are needed.

**Core technologies:**
- **Next.js 15 (App Router):** SSR framework — only option that collapses frontend + serverless OAuth backend into one deployment unit on Vercel
- **Auth.js v5 (next-auth):** LinkedIn OAuth — handles CSRF, state param, token exchange, and session automatically; avoid custom OAuth (security risk)
- **Tailwind CSS 4:** Styling — zero runtime overhead, CSS-native cascade layers, fastest iteration for landing page patterns
- **Motion 11:** Animation — MIT licensed, React-native, `useInView` + `variants` covers all landing page animation needs
- **next-intl 3:** i18n — App Router native, Server Component translations mean zero client JS for static text
- **React Hook Form 7 + Zod 3:** Forms — minimal re-renders, schema shared between client validation and Route Handler input validation
- **Airtable (SDK):** Lead storage — zero infra, spreadsheet UI for non-technical review; migrate to Supabase at scale
- **Vercel:** Deployment — first-party Next.js support, preview URLs per branch, Route Handlers as serverless functions

**Version flag:** Auth.js v5 is in beta (stable v4 available as fallback). Airtable SDK version has LOW confidence — verify current package name before install. Run `npm show [package] version` for any MEDIUM/LOW confidence package before pinning.

### Expected Features

See FEATURES.md for full detail.

**Must have (table stakes):**
- Hero section with headline + single primary CTA button — first 5 seconds determine if user stays
- Value proposition headline — specific technical language beats vague superlatives for developer audiences
- Mobile responsiveness — ~35-40% of traffic even for dev audiences; LinkedIn mobile app is primary share vector
- Fast page load (<3s) — directly correlated with conversion; Next.js Server Components + Tailwind achieve this structurally
- Brief product explanation below hero — users need context before committing to sign up
- Waitlist/signup form with LinkedIn OAuth — the conversion mechanism itself
- Success state / confirmation — post-submit message with clear "what happens next"
- Privacy / data handling notice — required for GDPR/KVKK compliance before any data collection

**Should have (differentiators):**
- LinkedIn OAuth sign-in — eliminates form friction, pre-fills identity, signals "serious product"; this is the primary conversion lever
- Scarcity framing ("First 100") — copy-only, grounded in a real product rationale (high-touch onboarding cohort), no counters or timers
- Qualifying survey (4 questions post-auth) — converts raw email into segmented lead; shown only after OAuth to respect momentum
- Features grid (3 columns: Linux kernel / Open Source / Agent Orchestration) — lets technical audience evaluate fit quickly
- "Why Astra OS?" positioning section — addresses the incumbent objection; unusual for waitlist pages; builds trust with developers
- Polished dark-theme visual identity — signals product quality; dev/AI audience expects dark UI in 2025-2026
- Bilingual EN + TR — strategically valuable; must be native-speaker Turkish, not machine-translated

**Defer (v2+):**
- Social proof section — avoid placeholder social proof; defer until real numbers or names are available
- Turkish localization — ship EN-first; add TR when native copy is ready, not under time pressure
- Video / product demo — adds complexity not justified at waitlist stage
- Social sharing / referral loop — conflicts with "exclusive first 100" framing; appropriate post-launch
- Blog / content section — separate concern; distracts from single conversion goal

### Architecture Approach

The architecture is a hybrid Server/Client Component model within Next.js App Router: the vast majority of the page is static Server Components (zero JS shipped, fully indexable by crawlers), with narrow `'use client'` islands for the waitlist modal and language switcher. Three Route Handlers act as the serverless backend: LinkedIn OAuth initiation, OAuth callback (token exchange + userinfo fetch + session cookie), and waitlist submission (Zod validation + Airtable/Supabase insert). This keeps all secrets server-side and the entire system within a single Vercel deployment. The qualifying form is a client-side state machine (4 in-memory steps, no URL routing between steps) triggered by the OAuth callback redirect.

**Major components:**
1. **Server Components (HeroSection, FeaturesSection, WhyAstraSection, FinalCTASection, Footer)** — static HTML, zero JS, all i18n via dictionary props from `getDictionary(lang)`
2. **Client Islands (WaitlistModal, QualifyingForm, LanguageSwitcher)** — interactive, minimal, isolated from static content
3. **Route Handlers (api/auth/linkedin, api/auth/linkedin/callback, api/waitlist)** — serverless backend; OAuth token exchange and lead storage; secrets never reach client
4. **i18n Layer (middleware + dictionaries/en.json + dictionaries/tr.json)** — locale detection, dictionary loading, all copy externalized from components
5. **Lead Storage (Airtable or Supabase via service role key)** — server-side only insert; no anonymous browser access to data store

### Critical Pitfalls

See PITFALLS.md for full detail on all 16 pitfalls.

1. **LinkedIn OAuth token exchange client-side** — The authorization code-to-token swap will fail with CORS errors AND expose `client_secret`. All token exchange must happen in a Route Handler. This is a hard architectural constraint, not optional.

2. **LinkedIn Developer Portal scope approval delay** — "Sign In with LinkedIn using OpenID Connect" product must be approved before implementation. Approval takes 1-3 business days. Apply on day 1 of the project, before writing any code.

3. **Redirect URI exact-match mismatch** — LinkedIn requires exact URI match including protocol and trailing slashes. Register all environments (localhost, staging, production) explicitly in Developer Portal from the start.

4. **Qualifying form before LinkedIn OAuth (flow inversion)** — Showing questions before auth drops conversion 20-40%. The correct sequence is: Hero CTA → LinkedIn OAuth → 4 qualifying questions. This is an architectural constraint that must be designed correctly from the start.

5. **GDPR/KVKK consent not captured before data collection** — A consent checkpoint (checkbox + privacy policy link) is legally required before the LinkedIn OAuth redirect fires. This applies to both EN and TR versions. A minimal privacy policy page must exist at launch.

6. **LinkedIn OAuth in LinkedIn's in-app browser** — When users open the landing page link from within the LinkedIn mobile app, the OAuth redirect may break in the sandboxed WebView. This must be tested before launch, and a fallback email form should be available.

7. **Hero animations delaying LCP** — Hero headline and CTA must render in initial HTML, not be animated in via JS. Animations are additive decoration only; LCP elements must never start with `opacity: 0` or `visibility: hidden`.

## Implications for Roadmap

Based on combined research, the architecture file's suggested build order is validated and extended here with pitfall awareness and feature prioritization.

### Phase 1: Foundation and Infrastructure

**Rationale:** i18n infrastructure and project scaffold must come first — every component and Route Handler depends on locale routing being in place. LinkedIn Developer Portal approval must be initiated in parallel on day 1 (takes 1-3 business days; blocks Phase 3). SEO metadata is cheapest to implement at scaffold time, expensive to retrofit.

**Delivers:** Next.js project with TypeScript, Tailwind CSS 4, next-intl middleware and `[lang]` route structure, `dictionaries/en.json` schema defined (even if sparse), metadata/OG/robots.txt/sitemap with hreflang alternates, Vercel project configured with all environments (local, staging, production redirect URIs registered in LinkedIn Developer Portal).

**Addresses:** Table-stakes fast load, mobile responsiveness constraint, bilingual toggle infrastructure

**Avoids:** Pitfall 11 (hreflang missing — must be at initial build), Pitfall 3 (redirect URI mismatch — register all environments now), Pitfall 5 (hardcoded copy strings — dictionary structure enforced from day 1)

### Phase 2: Static Page Sections

**Rationale:** No external dependencies — pure content and styling. Server Components only; no auth or data concerns. Both English and Turkish copy should be written simultaneously to avoid content drift. This phase delivers a shippable-looking landing page even without a working auth flow.

**Delivers:** HeroSection, FeaturesSection, WhyAstraSection, FinalCTASection, Footer with LanguageSwitcher. All copy in `en.json` (and `tr.json` if native copy is ready). Dark-theme visual system established. WaitlistTrigger client component renders a static CTA button (not yet wired to OAuth).

**Uses:** Tailwind CSS 4, Motion (scroll animations, entrance effects), next-intl dictionary props

**Avoids:** Pitfall 12 (patronizing copy — write peer-to-peer from the start), Pitfall 6 (fake scarcity — copy grounded in product rationale), Pitfall 13 (hero animation delaying LCP — hero text in initial HTML only), Pitfall 10 (bilingual content drift — both languages written together)

### Phase 3: LinkedIn OAuth Backend

**Rationale:** The Route Handlers must exist before the modal UI can be tested end-to-end. Requires LinkedIn Developer Portal credentials and approved scopes (initiated in Phase 1). This is the highest-risk phase technically — all five OAuth pitfalls are addressed here. Must be tested with cold-start serverless functions, not just local dev.

**Delivers:** `app/api/auth/linkedin/route.ts` (auth initiation with PKCE state), `app/api/auth/linkedin/callback/route.ts` (token exchange, userinfo fetch, signed pre-fill cookie, redirect to `?modal=open&step=qualify`), CSRF state verification, LinkedIn in-app browser tested, error handling for expired codes and user-cancelled auth.

**Avoids:** Pitfall 1 (client-side token exchange — Route Handler only), Pitfall 2 (code expiry — immediate exchange, explicit error handling), Pitfall 3 (redirect URI mismatch — verified per environment), Pitfall 4 (scope approval — confirmed in Developer Portal before coding), Pitfall 5 (CSRF state — cryptographically random nonce, verified on callback)

**Research flag:** This phase warrants deep review before implementation. The LinkedIn OIDC flow has multiple exact-match requirements. Test against actual LinkedIn sandbox credentials, not mocks.

### Phase 4: Waitlist Modal and Qualifying Form

**Rationale:** Depends on Phase 3 (OAuth callback must return the pre-fill cookie before the form can read it). The modal is a client-side state machine — 4 in-memory steps, no URL routing between steps. GDPR consent checkpoint must be added before the OAuth redirect is triggered.

**Delivers:** WaitlistModal orchestrator, LinkedInButton (OAuth initiation), QualifyingForm (4-step state machine with pre-fill from cookie), GDPR consent checkbox + privacy policy link before OAuth fires, fallback email form if OAuth is declined or unavailable, success screen with "what happens next" copy.

**Avoids:** Pitfall 7 (form shown before auth — auth-first flow enforced by component structure), Pitfall 8 (mobile tap targets — 44px minimum, single-column on mobile), Pitfall 9 (LinkedIn in-app browser — OAuth redirect tested in LinkedIn mobile app), Pitfall 15 (GDPR consent — checkbox before any data collection), Pitfall 16 (no fallback — graceful degradation to manual email form)

### Phase 5: Lead Storage Backend

**Rationale:** Depends on Phase 4 form structure being finalized (Supabase/Airtable schema mirrors form fields exactly). The Route Handler is the only writer — no anonymous browser access.

**Delivers:** `app/api/waitlist/route.ts` (Zod validation, Airtable or Supabase insert via service role key), duplicate signup handling (unique constraint on email), confirmation email via Resend (optional, scope decision needed), environment variables documented.

**Avoids:** Pitfall (direct browser-to-database insert — Route Handler only, service role key server-side)

### Phase 6: Polish, QA, and Launch Readiness

**Rationale:** Performance audit and cross-device testing are last because they can only be measured against the complete, integrated product. Lighthouse scores in dev mode are unreliable.

**Delivers:** Lighthouse mobile score 90+ (LCP, CLS, TBT targets met), full OAuth flow tested in LinkedIn iOS and Android apps, responsive layout audit at all breakpoints, EN + TR copy parity review, privacy policy page live, robots.txt and sitemap verified in Google Search Console.

**Avoids:** Pitfall 13 (LCP degraded by animations), Pitfall 14 (render-blocking third-party scripts — async/defer on all analytics)

### Phase Ordering Rationale

- i18n infrastructure before content (Phase 1 → 2) prevents the hardcoded copy anti-pattern and allows bilingual work to proceed in parallel
- LinkedIn Developer Portal approval initiated in Phase 1 means credentials are ready when Phase 3 begins (avoids a 3-day blocker mid-sprint)
- OAuth backend before modal UI (Phase 3 → 4) ensures the pre-fill cookie mechanism is real, not mocked, during form development
- Lead storage schema after form finalization (Phase 4 → 5) prevents schema churn from late field additions
- hreflang and redirect URIs set up in Phase 1 are cheap to configure and expensive to retrofit with SEO/compliance consequences

### Research Flags

Phases likely needing deeper review during planning:

- **Phase 3 (LinkedIn OAuth Backend):** Complex, exact-match requirements from a third-party identity provider. LinkedIn's OIDC implementation has subtle differences from the generic OAuth spec. Validate against LinkedIn official docs and current Auth.js v5 LinkedIn provider implementation before writing code. Consider Auth.js v5 vs v4 stability tradeoff given beta status.
- **Phase 5 (Lead Storage):** Airtable SDK version has LOW confidence in research. Verify current package name and API version before implementation. If Supabase is chosen over Airtable, RLS policy configuration needs explicit review.

Phases with standard patterns (can proceed without additional research):

- **Phase 1 (Foundation):** Next.js App Router scaffold + next-intl are well-documented with official docs. Standard setup.
- **Phase 2 (Static Sections):** Server Components + Tailwind CSS — fully documented, standard landing page patterns.
- **Phase 4 (Modal/Form):** React Hook Form + Zod + client state machine — established patterns, well-documented.
- **Phase 6 (Polish/QA):** Lighthouse audit + responsive testing — standard process, no new research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | MEDIUM-HIGH | Next.js, Vercel, Tailwind HIGH from official sources. Auth.js v5 and Airtable SDK versions MEDIUM/LOW — verify before pinning. |
| Features | MEDIUM | CRO benchmarks and OAuth UX patterns from training data (Aug 2025 cutoff); no external verification in research session. Core patterns are well-established domain knowledge. |
| Architecture | HIGH | Next.js App Router docs, LinkedIn OIDC docs both verified from official sources. Supabase integration pattern MEDIUM (official quickstart inaccessible during research). |
| Pitfalls | HIGH for OAuth (official LinkedIn docs, Nov 2025), HIGH for Web Vitals/LCP (established practice). MEDIUM for GDPR detail, MEDIUM for CRO conversion benchmarks. |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Auth.js v5 stability:** Confirm whether v5 has reached stable release (was in beta at Aug 2025 cutoff). If still beta, evaluate v4 with Pages Router compatibility layer vs tolerating beta risk for a landing page scope.
- **Airtable SDK current package name:** LOW confidence — Airtable restructured their SDK. Run `npm search airtable` and check current official package before Phase 5 planning.
- **Turkish copy availability:** The entire bilingual implementation is gated on having native-speaker Turkish copy. This is a content dependency, not a technical one. Confirm whether TR copy is available before including bilingual work in the roadmap scope or deferring to a post-launch phase.
- **LinkedIn Developer Portal approval timing:** Apply on day 1. If approval is delayed beyond 3 business days, Phase 3 is blocked. Identify a fallback plan (email-only waitlist without OAuth) if approval is unavailable at launch target.
- **Supabase vs Airtable decision:** Research recommends Airtable for <1,000 entries but ARCHITECTURE.md uses Supabase in code examples. The team should make this decision in Phase 1 to avoid schema work being done twice.

## Sources

### Primary (HIGH confidence)

- Next.js App Router official docs (v16.2.0, 2025-12-09 to 2026-03-03) — i18n routing, Server/Client Components, Route Handlers, Metadata API
- LinkedIn Sign In with OpenID Connect official docs (updated 2024-08-08) — authorization endpoint, token endpoint, userinfo endpoint, required scopes, returned fields
- LinkedIn 3-Legged OAuth Flow official docs (updated 2025-11-17) — authorization code flow, state parameter, code expiry
- Next.js 15 official release blog (Oct 2024) — App Router, Turbopack stable
- GDPR Article 6 and Article 13 — lawful basis and transparency requirements

### Secondary (MEDIUM confidence)

- Tailwind CSS v4 — https://tailwindcss.com/blog/tailwindcss-v4 (training data)
- Auth.js (next-auth v5) — https://authjs.dev (training data; beta status as of Aug 2025)
- Motion (Framer Motion v11) — https://motion.dev (training data)
- next-intl v3 — https://next-intl-docs.vercel.app (training data)
- CRO domain knowledge (conversion benchmarks, OAuth UX patterns, developer marketing) — established practice, training data through Aug 2025; verify specific numbers with Unbounce Conversion Benchmark Report before stakeholder use
- KVKK (Turkish data protection law) — mirrors GDPR structure (training data, MEDIUM)
- Supabase + Next.js integration — well-established pattern; official quickstart inaccessible during research session

### Tertiary (LOW confidence)

- Airtable SDK current package name and version — restructured; requires verification before use

---
*Research completed: 2026-03-19*
*Ready for roadmap: yes*
