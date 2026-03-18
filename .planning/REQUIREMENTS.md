# Requirements: Astra OS Landing Page

**Defined:** 2026-03-19
**Core Value:** Get the first 100 technically credible early adopters onto the waitlist — people who will validate, advocate, and co-shape Astra OS before public launch.

## v1 Requirements

### Page Structure

- [ ] **PAGE-01**: Page renders a full-screen Hero section as the first visible element
- [ ] **PAGE-02**: Page renders a 3-column Features section below the hero
- [ ] **PAGE-03**: Page renders a "Why Astra OS?" positioning section explaining the incumbent gap
- [ ] **PAGE-04**: Page renders a Final CTA section with a second waitlist signup opportunity
- [ ] **PAGE-05**: Page renders a minimal Footer with privacy policy link
- [ ] **PAGE-06**: Page is fully responsive on mobile (320px+), tablet (768px+), and desktop (1280px+)
- [ ] **PAGE-07**: Page achieves Lighthouse mobile score 90+ (LCP, CLS, TBT)
- [ ] **PAGE-08**: Page uses a dark-theme visual system throughout

### Hero Section

- [ ] **HERO-01**: Hero displays a primary headline that speaks to developer identity (specific, not vague)
- [ ] **HERO-02**: Hero displays a sub-headline explaining Astra OS in 1-2 concrete sentences
- [ ] **HERO-03**: Hero displays scarcity copy communicating "First 100 users" closed-beta framing
- [ ] **HERO-04**: Hero displays a single primary CTA button ("Join the Waitlist" / "Get Early Access")
- [ ] **HERO-05**: Hero headline and CTA render in initial HTML (not JS-animated in) to preserve LCP

### Features Section

- [ ] **FEAT-01**: Features section renders a 3-column grid layout
- [ ] **FEAT-02**: Column 1 covers Linux Kernel foundation (stability, security, trust)
- [ ] **FEAT-03**: Column 2 covers Open Source philosophy (transparency, community, freedom)
- [ ] **FEAT-04**: Column 3 covers Agent Orchestration (what it is, why it matters for workflows)
- [ ] **FEAT-05**: Each feature card contains an icon, a short headline, and a 2-3 sentence description
- [ ] **FEAT-06**: Feature copy uses peer-to-peer technical language (not marketing superlatives)

### Why Astra OS Section

- [ ] **WHY-01**: Section explains why current OSes (macOS, Ubuntu + AI tools) fall short for the AI agent era
- [ ] **WHY-02**: Section explains Astra's kernel-level AI integration as the differentiated solution
- [ ] **WHY-03**: Copy is intellectually honest and specific (references kernel-level agent scheduling, not vague claims)

### Waitlist & LinkedIn OAuth Flow

- [ ] **AUTH-01**: CTA button initiates LinkedIn OAuth (OpenID Connect) flow
- [ ] **AUTH-02**: OAuth flow requests only `openid profile email` scopes
- [ ] **AUTH-03**: A GDPR/KVKK consent checkbox + privacy policy link is shown before the OAuth redirect fires
- [ ] **AUTH-04**: LinkedIn authorization code is exchanged server-side (Route Handler only — never client-side)
- [ ] **AUTH-05**: OAuth callback pre-fills name, surname, and email into a signed httpOnly session cookie
- [ ] **AUTH-06**: OAuth state/CSRF parameter is generated and verified to prevent CSRF attacks
- [ ] **AUTH-07**: Error handling exists for expired authorization codes and user-cancelled auth
- [ ] **AUTH-08**: A fallback email-only signup form is available if LinkedIn OAuth is declined or unavailable

### Qualifying Survey (Post-Auth)

- [ ] **SURV-01**: Qualifying survey is shown only after successful LinkedIn OAuth — never before
- [ ] **SURV-02**: Survey pre-fills name/surname/email from the OAuth session cookie
- [ ] **SURV-03**: Survey contains exactly 4 questions (radio/single-select; answerable in under 60 seconds)
- [ ] **SURV-04**: Question 1 — "What best describes you?" (Developer / Founder / AI Researcher / Product Manager / Other)
- [ ] **SURV-05**: Question 2 — "Do you currently orchestrate AI agents?" (Yes / No / Exploring)
- [ ] **SURV-06**: Question 3 — "Are you interested in AI for finance or trading?" (Yes / No / Maybe)
- [ ] **SURV-07**: Question 4 — "What excites you most about Astra OS?" (3 options: Kernel-level AI / Open Source freedom / Agent Orchestration power)
- [ ] **SURV-08**: Survey shows a step progress indicator ("Step 2 of 4")
- [ ] **SURV-09**: Survey submission POSTs all fields to the waitlist Route Handler
- [ ] **SURV-10**: Post-submit success screen displays confirmation copy + "what happens next" message

### Lead Storage

- [ ] **LEAD-01**: Waitlist Route Handler validates all incoming fields with Zod schema before writing
- [ ] **LEAD-02**: Validated lead is written to Airtable (or Supabase) via server-side service key only
- [ ] **LEAD-03**: Duplicate email submissions are handled gracefully (no error shown to user)
- [ ] **LEAD-04**: Route Handler returns appropriate error response for storage failures without exposing internals

### Final CTA Section

- [ ] **CTA-01**: Final section repeats the scarcity framing with fresh copy (not a verbatim repeat of hero)
- [ ] **CTA-02**: Section contains a second waitlist CTA button that opens the same OAuth flow

### Bilingual (EN + TR)

- [ ] **I18N-01**: All user-facing copy is externalized into `dictionaries/en.json` and `dictionaries/tr.json`
- [ ] **I18N-02**: A language switcher in the header/nav allows toggling between EN and TR
- [ ] **I18N-03**: URL structure uses `[lang]` routing (`/en/`, `/tr/`) with middleware locale detection
- [ ] **I18N-04**: `hreflang` alternate link tags are present in `<head>` for both locales
- [ ] **I18N-05**: Turkish copy is native-quality (not machine-translated) — full parity with English content

### SEO & Infrastructure

- [ ] **SEO-01**: Page has `<title>`, `<meta description>`, and Open Graph tags configured for both locales
- [ ] **SEO-02**: `robots.txt` and `sitemap.xml` are present and correct
- [ ] **SEO-03**: LinkedIn Developer Portal app is configured with all environment redirect URIs (local, staging, production)

### Compliance

- [ ] **COMP-01**: A `/privacy` page exists at launch with a minimal privacy policy covering data collected
- [ ] **COMP-02**: GDPR/KVKK consent is captured via checkbox before any data collection begins
- [ ] **COMP-03**: Cookie usage notice is present (minimal bottom-bar style — not a full-page takeover)

## v2 Requirements

### Social Proof

- **SOCL-01**: Social proof section with real signup count or notable early adopter names
- **SOCL-02**: GitHub stars or community activity indicators

### Growth Mechanics

- **GROW-01**: Referral / share mechanic for post-beta-access users
- **GROW-02**: Confirmation email via Resend after successful waitlist submission

### Content

- **CONT-01**: Product demo video section (optional embed, not autoplay)
- **CONT-02**: Blog or changelog section

## Out of Scope

| Feature | Reason |
|---------|--------|
| Live waitlist counter / countdown timer | Fake counters destroy developer trust; copy-only scarcity is deliberate choice |
| Social sharing / referral loop | Conflicts with "exclusive first 100" framing; post-launch feature |
| Pricing section | Premature — no pricing model validated yet |
| Blog / content section | Separate concern; distracts from single conversion goal |
| Chat widget / support bubble | Adds load weight and visual noise; not needed for a clear landing page |
| Multiple hero CTAs | Decision paralysis; one CTA in hero is the correct pattern |
| Auto-playing video | Load cost, UX friction, accessibility concerns |
| Backend infrastructure beyond Route Handlers | Serverless functions on Vercel are sufficient for this milestone |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PAGE-01–08 | Phase 1 + 2 | Pending |
| HERO-01–05 | Phase 2 | Pending |
| FEAT-01–06 | Phase 2 | Pending |
| WHY-01–03 | Phase 2 | Pending |
| CTA-01–02 | Phase 2 | Pending |
| AUTH-01–08 | Phase 3 | Pending |
| SURV-01–10 | Phase 4 | Pending |
| LEAD-01–04 | Phase 5 | Pending |
| I18N-01–05 | Phase 1 + 2 | Pending |
| SEO-01–03 | Phase 1 | Pending |
| COMP-01–03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 52 total
- Mapped to phases: 52
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 after initial definition*
