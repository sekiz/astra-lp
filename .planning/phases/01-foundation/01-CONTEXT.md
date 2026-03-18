# Phase 1: Foundation - Context

**Gathered:** 2026-03-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Project scaffold, i18n routing infrastructure, SEO metadata, `robots.txt`, `sitemap.xml`, and `/privacy` page. Every component and Route Handler in subsequent phases depends on locale routing being in place. This phase produces no visible UI beyond a skeleton — it is the foundation everything else plugs into.

</domain>

<decisions>
## Implementation Decisions

### URL & Locale Routing
- URL prefix: both locales get a prefix — `astros.com/en/` and `astros.com/tr/`
- Default detection: middleware checks `Accept-Language` header — Turkish browser → `/tr/`, everything else → `/en/`
- Bare `/` redirects to detected locale (not a hard-coded default)
- Language switcher appears in **both** header navbar and footer

### Language Switcher Placement
- Header: `EN | TR` toggle — visible on all screens
- Footer: same toggle — for users who scroll before switching
- Component is a client island (`'use client'`) — minimal JS, isolated from static content

### Claude's Discretion
- Exact middleware implementation (next-intl vs custom)
- Dictionary file schema shape (flat vs nested keys)
- Cookie-based locale persistence (remember user's last switch)
- Privacy page copy content — minimal GDPR/KVKK bullets sufficient for launch

</decisions>

<specifics>
## Specific Ideas

- Tone from PROJECT.md: "Apple polish, Linux freedom" — even the privacy page should feel considered, not a generic legal dump
- Turkish locale is equal-first-class from day one — not bolted on after; this is enforced by requiring all strings in `dictionaries/tr.json` from Phase 1 structure onward
- LinkedIn Developer Portal app registration must happen on Day 1 of this phase (outside code) — approval takes 1-3 business days and blocks Phase 3

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield project

### Established Patterns
- None yet — this phase establishes the patterns all subsequent phases follow

### Integration Points
- `app/[lang]/layout.tsx` — root layout that wraps all page sections; locale dictionary loaded here
- `middleware.ts` — locale detection and redirect logic; runs before all routes
- `dictionaries/en.json` + `dictionaries/tr.json` — source of truth for all user-facing copy; must be created with at least a schema skeleton in this phase
- `app/[lang]/privacy/page.tsx` — compliance page required before any data collection goes live

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2026-03-19*
