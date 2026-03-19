# Requirements: Astra OS Landing Page

**Defined:** 2026-03-19
**Core Value:** Get the first 100 technically credible early adopters onto the waitlist — people who will validate, advocate, and co-shape Astra OS before public launch.

## v1 Requirements

### Page Structure

- [x] **PAGE-01**: Page renders a full-screen Hero section as the first visible element
- [ ] **PAGE-02**: Page renders a 3-column Features section below the hero
- [ ] **PAGE-03**: Page renders a "Why Astra OS?" positioning section explaining the incumbent gap
- [ ] **PAGE-04**: Page renders a Final CTA section with a second waitlist signup opportunity
- [ ] **PAGE-05**: Page renders a minimal Footer with privacy policy link
- [ ] **PAGE-06**: Page is fully responsive on mobile (320px+), tablet (768px+), and desktop (1280px+)
- [ ] **PAGE-07**: Page achieves Lighthouse mobile score 90+ (LCP, CLS, TBT)
- [x] **PAGE-08**: Page uses a dark-theme visual system throughout

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

### Waitlist Form (Manual)

- [ ] **FORM-01**: CTA button opens a waitlist modal with a manual signup form
- [ ] **FORM-02**: Form collects: first name, last name, email (required fields)
- [ ] **FORM-03**: Form collects 4 qualifying questions (radio/single-select; answerable in under 60 seconds)
- [ ] **FORM-04**: Question 1 — "What best describes you?" (Developer / Founder / AI Researcher / Product Manager / Other)
- [ ] **FORM-05**: Question 2 — "Do you currently orchestrate AI agents?" (Yes / No / Exploring)
- [ ] **FORM-06**: Question 3 — "Are you interested in AI for finance or trading?" (Yes / No / Maybe)
- [ ] **FORM-07**: Question 4 — "What excites you most about Astra OS?" (3 options: Kernel-level AI / Open Source freedom / Agent Orchestration power)
- [ ] **FORM-08**: Form shows a step progress indicator (Step 1: identity, Step 2: questions)
- [ ] **FORM-09**: A GDPR/KVKK consent checkbox + privacy policy link is shown before submission
- [ ] **FORM-10**: Form submission POSTs all fields to the waitlist Route Handler
- [ ] **FORM-11**: Post-submit success screen displays confirmation copy + "what happens next" message
- [ ] **FORM-12**: Client-side validation with clear inline error messages (empty fields, invalid email format)

### Lead Storage

- [ ] **LEAD-01**: Waitlist Route Handler validates all incoming fields with Zod schema before writing
- [ ] **LEAD-02**: Validated lead is written to Airtable (or Supabase) via server-side service key only
- [ ] **LEAD-03**: Duplicate email submissions are handled gracefully (no error shown to user)
- [ ] **LEAD-04**: Route Handler returns appropriate error response for storage failures without exposing internals

### Final CTA Section

- [ ] **CTA-01**: Final section repeats the scarcity framing with fresh copy (not a verbatim repeat of hero)
- [ ] **CTA-02**: Section contains a second waitlist CTA button that opens the same waitlist modal

### Bilingual (EN + TR)

- [x] **I18N-01**: All user-facing copy is externalized into `dictionaries/en.json` and `dictionaries/tr.json`
- [x] **I18N-02**: A language switcher in the header/nav allows toggling between EN and TR
- [x] **I18N-03**: URL structure uses `[lang]` routing (`/en/`, `/tr/`) with middleware locale detection
- [x] **I18N-04**: `hreflang` alternate link tags are present in `<head>` for both locales
- [x] **I18N-05**: Turkish copy is native-quality (not machine-translated) — full parity with English content

### SEO & Infrastructure

- [x] **SEO-01**: Page has `<title>`, `<meta description>`, and Open Graph tags configured for both locales
- [x] **SEO-02**: `robots.txt` and `sitemap.xml` are present and correct
- [x] **SEO-03**: Vercel project is configured with local, preview, and production environments before Phase 3

### Compliance

- [x] **COMP-01**: A `/privacy` page exists at launch with a minimal privacy policy covering data collected
- [ ] **COMP-02**: GDPR/KVKK consent checkbox is shown inside the waitlist form before submission
- [ ] **COMP-03**: Cookie usage notice is present (minimal bottom-bar style — not a full-page takeover)

## v2 Requirements

### LinkedIn OAuth (Deferred from v1)

- **AUTH-01**: CTA button initiates LinkedIn OAuth (OpenID Connect) flow replacing manual form
- **AUTH-02**: OAuth flow requests only `openid profile email` scopes
- **AUTH-03**: LinkedIn authorization code is exchanged server-side (Route Handler only)
- **AUTH-04**: OAuth callback pre-fills name, surname, and email into the qualifying survey
- **AUTH-05**: OAuth state/CSRF parameter is generated and verified
- **AUTH-06**: Error handling for expired codes and user-cancelled auth
- **AUTH-07**: Fallback to manual form if OAuth unavailable

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
| LinkedIn OAuth (v1) | Deferred to v2 — reduces Day 1 dependencies; manual form ships faster |
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
| PAGE-01 | Phase 1 | Complete |
| PAGE-02 | Phase 2 | Pending |
| PAGE-03 | Phase 2 | Pending |
| PAGE-04 | Phase 2 | Pending |
| PAGE-05 | Phase 2 | Pending |
| PAGE-06 | Phase 2 | Pending |
| PAGE-07 | Phase 4 | Pending |
| PAGE-08 | Phase 2 | Complete |
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| HERO-04 | Phase 2 | Pending |
| HERO-05 | Phase 2 | Pending |
| FEAT-01 | Phase 2 | Pending |
| FEAT-02 | Phase 2 | Pending |
| FEAT-03 | Phase 2 | Pending |
| FEAT-04 | Phase 2 | Pending |
| FEAT-05 | Phase 2 | Pending |
| FEAT-06 | Phase 2 | Pending |
| WHY-01 | Phase 2 | Pending |
| WHY-02 | Phase 2 | Pending |
| WHY-03 | Phase 2 | Pending |
| CTA-01 | Phase 2 | Pending |
| CTA-02 | Phase 2 | Pending |
| FORM-01 | Phase 3 | Pending |
| FORM-02 | Phase 3 | Pending |
| FORM-03 | Phase 3 | Pending |
| FORM-04 | Phase 3 | Pending |
| FORM-05 | Phase 3 | Pending |
| FORM-06 | Phase 3 | Pending |
| FORM-07 | Phase 3 | Pending |
| FORM-08 | Phase 3 | Pending |
| FORM-09 | Phase 3 | Pending |
| FORM-10 | Phase 3 | Pending |
| FORM-11 | Phase 3 | Pending |
| FORM-12 | Phase 3 | Pending |
| LEAD-01 | Phase 4 | Pending |
| LEAD-02 | Phase 4 | Pending |
| LEAD-03 | Phase 4 | Pending |
| LEAD-04 | Phase 4 | Pending |
| I18N-01 | Phase 1 | Complete |
| I18N-02 | Phase 1 | Complete |
| I18N-03 | Phase 1 | Complete |
| I18N-04 | Phase 1 | Complete |
| I18N-05 | Phase 1 | Complete |
| SEO-01 | Phase 1 | Complete |
| SEO-02 | Phase 1 | Complete |
| SEO-03 | Phase 1 | Complete |
| COMP-01 | Phase 1 | Complete |
| COMP-02 | Phase 3 | Pending |
| COMP-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 51 total (AUTH-01–08 and SURV-01–10 moved to v2; replaced by FORM-01–12)
- Mapped to phases: 51
- Unmapped: 0

---
*Requirements defined: 2026-03-19*
*Last updated: 2026-03-19 — traceability updated after roadmap creation*
