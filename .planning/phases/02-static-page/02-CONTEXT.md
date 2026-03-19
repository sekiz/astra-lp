# Phase 2: Static Page - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

All content sections built and styled: Hero, Features (3-column grid), "Why Astra OS?", Final CTA, and Footer. Responsive dark-theme visual system complete. CTA button is visible and styled but NOT wired to any form — that is Phase 3. Bilingual EN+TR copy fills all dictionary keys left empty in Phase 1.

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **Height:** Full viewport (100vh) — hero fills the entire screen on load, maximum impact
- **Background:** Pure black (#0a0a0a) with a subtle radial gradient glow in accent color (#6366f1) centered behind the headline — cinematic, premium feel (Linear/Vercel aesthetic)
- **Content alignment:** Center-aligned — headline, subheadline, scarcity line, and CTA all horizontally centered
- **CTA button:** Solid accent fill — #6366f1 background, white text, with arrow icon. Bold, clear call to action

### Hero Copy Direction
- **Headline style:** Identity claim, developer-direct — punchy specific statement like "The OS Built for the Agent Era." or "Your OS doesn't know what an AI agent is. Astra does." — not lead with kernel jargon, not mission/vision
- **Scarcity framing:** Urgency / limited access — "Closed beta. Limited to the first 100." Hard scarcity signal over exclusivity framing
- **Scarcity presentation:** Text only — no counter, no badge, no progress indicator. Pure copywriting
- **Sub-headline:** 1-2 concrete sentences explaining Astra OS (Linux-based, kernel-level agent orchestration)

### Feature Cards
- **Icons:** Lucide icons rendered in accent color (#6366f1) — consistent with developer-tool aesthetic, no custom SVG work needed
- **Card treatment:** Bordered cards on elevated surface — background: --color-bg-surface (#111111), border: 1px solid --color-border (#262626). Reuses existing CSS tokens. No heavy shadows.
- **Layout:** 3-column grid on desktop, stacks to 1 column on mobile
- **Card content per item:** icon + short headline + 2-3 sentence description (FEAT-05 requirement)
- **Copy tone:** Peer-to-peer technical language — not marketing superlatives (FEAT-06)

### "Why Astra OS?" Section
- **Layout:** Prose paragraphs with bold callouts — 2-3 focused paragraphs making the technical argument; key claims bolded inline. Essay-style, readable.
- **Tone:** Honest critique of incumbents — names macOS and Ubuntu explicitly; explains specifically what they get wrong for AI-agent workloads. No superlatives, technically credible argument (WHY-01, WHY-02, WHY-03 requirements).

### Final CTA Section
- **Style:** Contained dark panel (--color-bg-elevated, #1a1a1a) — feels like a deliberate second pitch, not a repeat of the hero
- **Copy:** Fresh scarcity wording distinct from hero — something like "Ready to shape the future of AI infrastructure?" + "Seats fill fast." rather than repeating hero copy
- **Button:** Same CTA button style as hero ("Get Early Access →") — same component, different label allowed

### Footer
- **Minimal footer:** Privacy policy link, language switcher, copyright — already partially in place from Phase 1 layout
- **Dictionary keys:** Fill in Footer section copy from dictionaries (privacyLink, copyright)

### Claude's Discretion
- Exact copy wording for EN and TR dictionaries — use "Apple polish, Linux freedom" tone guideline
- Specific Lucide icon choices per feature card
- Exact radial glow implementation (CSS gradient vs Tailwind arbitrary values)
- Spacing between sections — reasonable breathing room, not over-padded
- Turkish copy — native-quality translations, not machine-translated

</decisions>

<specifics>
## Specific Ideas

- "Apple polish, Linux freedom" — the page should feel as considered as Apple's site but with the honest, open ethos of Linux culture
- Hero headline reference vibe: developer-direct, not "visionary startup speak". Think: how a senior engineer would pitch this to a peer, not a VC pitch deck
- Why section should feel like a well-written HN comment or technical blog post, not a marketing page — specific, honest, intellectually credible
- Scarcity copy is urgency-first: "Closed beta. Limited to the first 100." — no softening language

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/LanguageSwitcher.tsx` — already wired into header and footer; no changes needed in Phase 2
- `app/[lang]/layout.tsx` — header (ASTRA OS text + switcher) and footer (copyright + switcher) already in place; Phase 2 fills in the `{children}` body sections only
- `app/globals.css` — full dark theme token set already defined: `--color-bg-primary`, `--color-bg-surface`, `--color-bg-elevated`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-accent`, `--color-accent-hover`, `--color-border`
- `dictionaries/en.json` + `dictionaries/tr.json` — key schema already exists with empty strings for Hero, Features, WhyAstra, FinalCTA, Footer sections; Phase 2 fills these in

### Established Patterns
- All styling via Tailwind v4 utility classes + CSS custom property tokens from `@theme` block
- Dictionary-driven copy — NO hardcoded text in components; everything via `useTranslations()` hook
- `app/[lang]/page.tsx` is the target file — Phase 2 builds all content sections here (or extracts to components)
- Next.js App Router: server components by default; `'use client'` only when interactivity is required (e.g., CTA button eventually)

### Integration Points
- `app/[lang]/page.tsx` — main page file where all sections live (currently a minimal placeholder)
- `dictionaries/en.json` + `dictionaries/tr.json` — must be populated with real copy before components render
- `i18n/navigation.ts` — Link component for internal links (privacy page link in footer)
- Header/footer already render; Phase 2 only needs to fill the middle content

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-static-page*
*Context gathered: 2026-03-19*
