# Phase 3: Conversion Flow - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

The waitlist conversion funnel is fully functional: CTA buttons open a modal with a 2-step form. Step 1 collects name and email. Step 2 shows 4 qualifying questions with radio buttons and a GDPR/KVKK consent checkbox. A step progress indicator (Step 1 / Step 2) is visible throughout. A cookie usage notice (minimal bottom-bar) appears on the page. Form submission POSTs to a Route Handler stub (Phase 4 connects actual storage). LinkedIn OAuth is NOT in scope — manual form only (OAuth deferred to v2).
</domain>

<decisions>
## Implementation Decisions

### Modal Architecture
- **Single WaitlistModal component** — `'use client'` component managing all state (open/closed, step 1/2, field values, validation errors, submit state)
- **Portal rendering** — modal overlays the entire page via fixed positioning; no React portal needed (fixed overlay works in Next.js App Router)
- **Trigger** — CTA buttons in Hero and FinalCTA both open the same modal; modal state lives in a shared `WaitlistProvider` context (avoid prop drilling through server components)
- **Close behavior** — Escape key and clicking the backdrop close the modal

### WaitlistProvider Pattern
- Server components (Hero, FinalCTASection) cannot hold state — the CTA button must be extracted to a `'use client'` `CTAButton` component
- `WaitlistProvider` wraps `{children}` in layout.tsx (inside NextIntlClientProvider), providing a `useWaitlist()` hook with `{ open, setOpen }` state
- `CTAButton` calls `setOpen(true)` on click
- `WaitlistModal` reads `open` and `setOpen` from context — renders nothing when `open === false`

### Form Steps
- **Step 1**: First name, last name, email (required). Client-side validation: all fields non-empty, email format valid. "Continue" advances to Step 2.
- **Step 2**: 4 qualifying questions (radio single-select), GDPR consent checkbox (required before submit), "Submit" button. Back button returns to Step 1.
- Progress indicator: "Step 1 of 2" / "Step 2 of 2" — simple text, no animated bar

### The 4 Questions
1. "What best describes you?" — Developer / Founder / AI Researcher / Product Manager / Other
2. "Do you currently orchestrate AI agents?" — Yes / No / Exploring
3. "Are you interested in AI for finance or trading?" — Yes / No / Maybe
4. "What excites you most about Astra OS?" — Kernel-level AI integration / Open Source freedom / Agent Orchestration power

### Form Submission
- On submit: POST to `/api/waitlist` with all fields as JSON
- Route Handler stub: returns `{ success: true }` (Phase 4 wires actual storage)
- Success screen: replaces form content with confirmation message + "what happens next" copy
- Error screen: shows friendly error with retry option

### Cookie Notice
- Minimal bottom-bar style: fixed at bottom of viewport, dismissible (localStorage flag)
- Single sentence: "We use cookies for analytics and session management."
- Two actions: "Accept" (dismisses + sets cookie flag) and "Learn more" (links to /privacy)
- Does NOT block interaction — not a full-page takeover

### Dictionary Keys to Add
All new UI strings go in dictionaries (no hardcoded text):
- `Waitlist.*` — all modal copy (step labels, field placeholders, button labels, question text, options, GDPR text, success/error copy)
- `CookieNotice.*` — cookie bar copy

### Claude's Discretion
- Exact styling of modal overlay (blur, opacity)
- Animation for modal open/close (subtle fade-in)
- Field focus ring styling consistent with accent color
- Error message placement (below each field inline)
- Turkish copies for all new Waitlist and CookieNotice keys
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- CSS tokens: all `--color-*` tokens already defined in globals.css
- `LanguageSwitcher.tsx` — pattern for `'use client'` component with useLocale hook
- `app/[lang]/layout.tsx` — wraps children in `NextIntlClientProvider`; WaitlistProvider added here

### Patterns to Follow
- `'use client'` only for interactive components; server components pass `locale` prop down
- Dictionary-driven copy via `useTranslations()` hook (client components) or `getTranslations()` (server)
- Tailwind v4 utility classes + CSS custom property tokens

### New Files
- `components/WaitlistProvider.tsx` — React context + provider ('use client')
- `components/WaitlistModal.tsx` — full modal with 2 steps ('use client')
- `components/CTAButton.tsx` — button wired to WaitlistProvider ('use client')
- `components/CookieNotice.tsx` — bottom-bar notice ('use client')
- `app/api/waitlist/route.ts` — Next.js Route Handler (POST stub)

### Integration Points
- `app/[lang]/layout.tsx` — add `<WaitlistProvider>` wrapping children (inside NextIntlClientProvider)
- `app/[lang]/layout.tsx` — add `<WaitlistModal />` and `<CookieNotice />` inside WaitlistProvider
- `app/[lang]/page.tsx` → `components/FinalCTASection.tsx` — replace `<button>` with `<CTAButton>`
- Hero section in `page.tsx` — replace `<button>` with `<CTAButton>`
</code_context>

---

*Phase: 03-conversion*
*Context gathered: 2026-03-19*
