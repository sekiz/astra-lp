# Roadmap: Astra OS Landing Page

## Overview

Four phases deliver a high-conversion waitlist landing page for Astra OS. Phase 1 lays the project scaffold, i18n infrastructure, and SEO/compliance foundations before any content exists. Phase 2 builds the complete static page — all sections, copy, and visual system — producing a shippable-looking page even without a working auth flow. Phase 3 wires the conversion engine: LinkedIn OAuth backend plus the qualifying survey UI, delivering the full signup funnel end-to-end. Phase 4 connects lead storage, runs the Lighthouse audit, and confirms the page is launch-ready.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Project scaffold, i18n routing, SEO metadata, and privacy page
- [ ] **Phase 2: Static Page** - All content sections built, responsive dark-theme visual system complete
- [ ] **Phase 3: Conversion Flow** - LinkedIn OAuth backend, qualifying survey UI, GDPR consent
- [ ] **Phase 4: Lead Storage & Launch** - Waitlist Route Handler, Airtable/Supabase write, Lighthouse 90+

## Phase Details

### Phase 1: Foundation
**Goal**: The project infrastructure that every component and Route Handler depends on is in place — locale routing works, copy is externalized from day one, SEO metadata is correct, and the privacy page required for launch compliance exists
**Depends on**: Nothing (first phase)
**Requirements**: PAGE-01, PAGE-08, I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, SEO-01, SEO-02, SEO-03, COMP-01
**Success Criteria** (what must be TRUE):
  1. Visiting `/en/` and `/tr/` each serve the correct locale; middleware redirects bare `/` to the detected locale
  2. All user-facing copy strings are loaded from `dictionaries/en.json` and `dictionaries/tr.json` — no hardcoded text in components
  3. Page `<head>` contains correct `<title>`, `<meta description>`, Open Graph tags, and `hreflang` alternates for both locales
  4. `robots.txt` and `sitemap.xml` are reachable and valid
  5. `/privacy` page loads with a minimal privacy policy covering data collected
**Plans**: 5 plans

Plans:
- [x] 01-01-PLAN.md — Wave 0: Install Playwright + Vitest, create test stubs for all Phase 1 requirements
- [x] 01-02-PLAN.md — Wave 1: Next.js 15 scaffold, Tailwind v4 PostCSS pipeline, next-intl install, dark theme globals
- [x] 01-03-PLAN.md — Wave 2: next-intl routing config, middleware, request config, dictionary schema, root layout with metadata
- [x] 01-04-PLAN.md — Wave 3: robots.ts, sitemap.ts, privacy page, LanguageSwitcher component wired into layout
- [x] 01-05-PLAN.md — Wave 4: Vercel project creation and environment variable configuration (checkpoint)

### Phase 2: Static Page
**Goal**: A fully styled, responsive landing page with all content sections rendered and bilingual copy in place — visitors can read the full value proposition, understand the features, and see the scarcity framing; the waitlist CTA button is visible but not yet wired to OAuth
**Depends on**: Phase 1
**Requirements**: PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, HERO-01, HERO-02, HERO-03, HERO-04, HERO-05, FEAT-01, FEAT-02, FEAT-03, FEAT-04, FEAT-05, FEAT-06, WHY-01, WHY-02, WHY-03, CTA-01, CTA-02
**Success Criteria** (what must be TRUE):
  1. Hero headline and CTA button are visible in the initial HTML response — no JS required to see them
  2. Features section renders as a 3-column grid covering Linux kernel, Open Source, and Agent Orchestration with icon + headline + description per card
  3. "Why Astra OS?" section explains the incumbent gap with specific, technically credible language (not marketing superlatives)
  4. A second CTA section appears near the bottom with fresh scarcity copy distinct from the hero
  5. The page is visually complete and readable at 320px, 768px, and 1280px viewport widths with a consistent dark theme
**Plans**: TBD

### Phase 3: Conversion Flow
**Goal**: A visitor can click "Join the Waitlist", complete LinkedIn OAuth, and be presented with the 4-question qualifying survey — the full conversion funnel works end-to-end with correct security, GDPR consent, and graceful error handling
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08, SURV-01, SURV-02, SURV-03, SURV-04, SURV-05, SURV-06, SURV-07, SURV-08, SURV-09, SURV-10, COMP-02, COMP-03
**Success Criteria** (what must be TRUE):
  1. Clicking the CTA shows a GDPR/KVKK consent checkbox and privacy policy link before the OAuth redirect fires — the button is disabled until consent is checked
  2. LinkedIn OAuth completes server-side: the authorization code is exchanged in a Route Handler (never client-side), and name/email pre-fill the survey
  3. The 4-question survey appears only after successful OAuth, shows a step progress indicator, and is completable in under 60 seconds
  4. Cancelling OAuth, encountering an expired code, or declining LinkedIn auth surfaces a friendly error and offers the fallback email form
  5. A cookie usage notice is visible on the page (minimal bottom-bar style, not a full-page takeover)
**Plans**: TBD

### Phase 4: Lead Storage & Launch
**Goal**: Survey submissions are persisted to Airtable or Supabase via a secure server-side Route Handler, duplicate signups are handled gracefully, and the complete integrated page passes Lighthouse mobile 90+ — the product is launch-ready
**Depends on**: Phase 3
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, PAGE-07
**Success Criteria** (what must be TRUE):
  1. Completing the qualifying survey creates a new row in Airtable (or Supabase) with all fields; the success screen shows a confirmation message with "what happens next" copy
  2. Submitting a duplicate email address does not produce an error message — the user sees the same success screen as a first-time submission
  3. A storage failure returns an appropriate error response to the user without exposing internal details or stack traces
  4. Lighthouse mobile audit on the deployed Vercel URL scores 90+ across LCP, CLS, and TBT
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 5/5 | Complete | 2026-03-19 |
| 2. Static Page | 0/TBD | Not started | - |
| 3. Conversion Flow | 0/TBD | Not started | - |
| 4. Lead Storage & Launch | 0/TBD | Not started | - |
