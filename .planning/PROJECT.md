# Astra OS — Landing Page

## What This Is

A high-conversion landing page for Astra OS, a next-generation AI Operating System built on a Linux kernel with native Agent Orchestration at its core. The page targets a mixed audience (developers, technical founders, AI/ML practitioners) and drives waitlist signups via scarcity: the first 100 users gain exclusive closed-beta access to shape the platform.

## Core Value

Get the first 100 technically credible early adopters onto the waitlist — people who will validate, advocate, and co-shape Astra OS before public launch.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Hero section with strong value proposition headline, subheadline, and waitlist form
- [ ] "First 100" scarcity messaging communicated through copywriting (no live counter)
- [ ] Features section — 3-column grid: Linux kernel foundation, Open Source philosophy, Agent Orchestration
- [ ] "Why Astra OS?" section — positions against legacy OS incumbents, explains kernel-level AI integration
- [ ] Final CTA section — reinforces scarcity, second waitlist signup form
- [ ] Manual waitlist form (name, last name, email + 4 qualifying questions) — LinkedIn OAuth deferred to v2
- [ ] Bilingual content — English primary, Turkish secondary
- [ ] Qualifying form questions: Role/Sector, AI agent usage, Finance interest, Motivation

### Out of Scope

- Backend/API implementation — this project is the static page structure and copy only
- Payment flows — no monetization in this phase
- Blog or content section — deferred to post-launch
- Mobile app — web-first

## Context

- Product: Astra OS — AI Operating System with kernel-level AI integration, open-source, Linux-based
- Campaign: Closed beta waitlist, first 100 users framing
- Scarcity mechanism: Copywriting-based urgency (no live counter, no progress bar) — clean minimalist approach
- LinkedIn OAuth: Reduces form friction; pre-fills name/surname/email
- Additional qualifying questions (4 total, shown after LinkedIn auth):
  1. Role/Sector — Developer / Founder / AI Researcher / Product (segmentation)
  2. "Do you currently orchestrate AI agents?" Yes/No (product-market fit signal)
  3. "Interested in AI for finance/trading?" Yes/No (vertical focus detection)
  4. "What excites you most about Astra OS?" — 3 options (message resonance)
- Tone: Visionary, developer-friendly, transparent, innovative — "Apple polish, Linux freedom"
- Languages: English (primary) + Turkish (secondary, bilingual)
- Target audience: Developers, Technical Founders/CTOs, AI/ML Practitioners — layered messaging

## Constraints

- **Scope**: Copy + structure only — no backend implementation in this milestone
- **Tone**: Silicon Valley standard — precise, confident, no marketing fluff
- **Form UX**: Maximum 4 qualifying questions post-LinkedIn auth — do not overwhelm users
- **Scarcity**: Text-only urgency (no countdown timers, no progress bars) — minimalist aesthetic

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manual form for v1, LinkedIn OAuth for v2 | Ship faster with fewer dependencies; OAuth adds complexity and portal approval delay | — Decided |
| Copywriting-only scarcity (no counter) | Minimalist aesthetic fits "Apple polish" tone; counters feel aggressive | — Pending |
| Bilingual EN + TR | Reach Turkish technical community alongside global audience | — Pending |
| 4 qualifying questions | Balance between data richness and conversion rate | — Pending |

---
*Last updated: 2026-03-19 after initialization*
