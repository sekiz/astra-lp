---
phase: 1
slug: foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-19
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright (e2e) + Vitest (unit) |
| **Config file** | `playwright.config.ts` / `vitest.config.ts` — Wave 0 installs |
| **Quick run command** | `npx playwright test --grep @smoke` |
| **Full suite command** | `npx playwright test && npx vitest run` |
| **Estimated runtime** | ~30 seconds (smoke) / ~90 seconds (full) |

---

## Sampling Rate

- **After every task commit:** Run `npx playwright test --grep @smoke`
- **After every plan wave:** Run `npx playwright test && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds (smoke)

---

## Per-Task Verification Map

| Requirement | Test Type | Automated Command | Wave |
|-------------|-----------|-------------------|------|
| PAGE-01 | Playwright smoke | `npx playwright test --grep "page shell"` | Wave 0 |
| PAGE-08 | Playwright DOM | `npx playwright test --grep "dark theme"` | Wave 0 |
| I18N-01 | Vitest unit | `npx vitest run tests/dictionaries.test.ts` | Wave 0 |
| I18N-02 | Playwright DOM | `npx playwright test --grep "language switcher"` | Wave 0 |
| I18N-03 | Playwright navigation | `npx playwright test --grep "locale redirect"` | Wave 0 |
| I18N-04 | Playwright DOM | `npx playwright test --grep "hreflang"` | Wave 0 |
| I18N-05 | Vitest unit | `npx vitest run tests/dictionaries.test.ts` | Wave 0 |
| SEO-01 | Playwright DOM | `npx playwright test --grep "SEO meta tags"` | Wave 0 |
| SEO-02 | Playwright request | `npx playwright test --grep "robots sitemap"` | Wave 0 |
| SEO-03 | Manual | N/A — Vercel dashboard check | Manual only |
| COMP-01 | Playwright smoke | `npx playwright test --grep "privacy page"` | Wave 0 |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `playwright.config.ts` — Playwright config with baseURL (`http://localhost:3000`) and test directory
- [ ] `tests/foundation.spec.ts` — smoke + e2e tests for all requirements above
- [ ] `tests/dictionaries.test.ts` — Vitest unit: `en.json` and `tr.json` key parity check
- [ ] `vitest.config.ts` — Vitest config for dictionary unit tests
- [ ] Framework install: `npm install -D @playwright/test vitest` + `npx playwright install --with-deps chromium`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Vercel environment variables set | SEO-03 | Cloud dashboard — not testable in CI | Check Vercel dashboard: Settings → Environment Variables → confirm `NEXT_PUBLIC_BASE_URL` set for all environments |
| Language switcher visible in both header and footer | I18N-02 | Layout position varies by viewport | Load `/en/` at 320px, 768px, 1280px — confirm EN\|TR toggle visible in nav and footer |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
