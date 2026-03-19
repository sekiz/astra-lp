---
phase: 2
slug: static-page
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.58.2 (e2e) + Vitest 4.1.0 (unit) |
| **Config file** | `playwright.config.ts` + `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx playwright test && npx vitest run` |
| **Estimated runtime** | ~30 seconds (unit <5s, e2e ~25s) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx playwright test && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 0 | HERO-01,FEAT-01,CTA-01 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 0 | dict parity | unit | `npx vitest run` | ✅ exists | ⬜ pending |
| 2-01-03 | 01 | 1 | HERO-01..05 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-04 | 01 | 1 | PAGE-02,FEAT-01..06 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-05 | 01 | 1 | WHY-01..03 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-06 | 01 | 2 | PAGE-04,CTA-01,CTA-02 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-07 | 01 | 2 | PAGE-05 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-08 | 01 | 3 | PAGE-06 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |
| 2-01-09 | 01 | 3 | HERO-05 | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/static-page.spec.ts` — stubs covering PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, HERO-01, HERO-03, HERO-04, HERO-05, FEAT-01, CTA-01, CTA-02
- [ ] Add non-empty values assertion to `tests/dictionaries.test.ts` — verifies all Phase 2 dictionary keys are populated with actual content (not empty strings)

*Existing `tests/dictionaries.test.ts` covers key parity but not non-empty values.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Copy tone: peer-to-peer technical language | FEAT-06, WHY-03 | Subjective quality judgment | Read feature card bodies and WhyAstra prose — verify no marketing superlatives; names macOS/Ubuntu explicitly |
| Turkish copy native quality | HERO-01, WHY-01 | Linguistic accuracy | Native or near-native Turkish speaker reviews all TR strings in `dictionaries/tr.json` |
| Dark theme visual consistency | PAGE-06 | Visual QA | View at 320px, 768px, 1280px — confirm all text readable, no light-mode flashes |
| Radial gradient glow renders | HERO-02 | CSS rendering | Open browser dev tools, confirm radial gradient on hero section background |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
