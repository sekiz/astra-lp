---
phase: 01-foundation
plan: 01
subsystem: testing
tags: [playwright, vitest, e2e, smoke-tests, i18n, seo]

# Dependency graph
requires: []
provides:
  - playwright.config.ts with baseURL http://localhost:3000 and webServer config
  - vitest.config.ts pointing at tests/**/*.test.ts
  - tests/foundation.spec.ts: 12 smoke tests covering PAGE-01, PAGE-08, I18N-02, I18N-03, I18N-04, SEO-01, SEO-02, COMP-01
  - tests/dictionaries.test.ts: vitest unit test for I18N-01 and I18N-05 key parity (fails until Plan 03 creates dictionaries)
affects:
  - 01-02-PLAN.md through 01-05-PLAN.md (all subsequent plans can run smoke suite after each commit)

# Tech tracking
tech-stack:
  added:
    - "@playwright/test@1.58.2"
    - "vitest@4.1.0"
  patterns:
    - "testMatch: '**/*.spec.ts' in playwright.config.ts to separate playwright from vitest tests"
    - "Nyquist Wave 0 pattern: test stubs created before any production code"

key-files:
  created:
    - playwright.config.ts
    - vitest.config.ts
    - tests/foundation.spec.ts
    - tests/dictionaries.test.ts
  modified:
    - package.json

key-decisions:
  - "Added testMatch: '**/*.spec.ts' to playwright.config.ts to prevent playwright from attempting to load vitest test files in the same tests/ directory"
  - "Wave 0 tests intentionally fail against a running server — they assert real conditions (HTTP 200, DOM presence) not trivial truths"

patterns-established:
  - "Test separation: playwright uses *.spec.ts, vitest uses *.test.ts — both live in tests/ directory"
  - "Smoke tag pattern: @smoke appended to test name string for grep-based filtering"

requirements-completed: [PAGE-01, PAGE-08, I18N-01, I18N-02, I18N-03, I18N-04, I18N-05, SEO-01, SEO-02, COMP-01]

# Metrics
duration: 3min
completed: 2026-03-19
---

# Phase 1 Plan 01: Wave 0 Test Infrastructure Summary

**Playwright + Vitest test harness with 12 smoke stubs covering all 10 Phase 1 requirements, plus dictionary key-parity unit test ready for Plan 03 dictionaries**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-03-18T23:50:43Z
- **Completed:** 2026-03-18T23:53:29Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Installed @playwright/test and vitest as devDependencies into the existing Next.js 16 project
- Created `playwright.config.ts` with baseURL `http://localhost:3000`, webServer `npm run dev`, testMatch restricted to `*.spec.ts`
- Created `tests/foundation.spec.ts` with 12 Playwright tests tagged `@smoke` spanning I18N-03/04, SEO-01/02, COMP-01, PAGE-01, PAGE-08, and I18N-02
- Created `tests/dictionaries.test.ts` with vitest unit tests for I18N-01 and I18N-05 key parity between `en.json` and `tr.json`
- `npx playwright test --list` exits 0 and lists all 12 tests; `npx vitest run tests/dictionaries.test.ts` fails with expected "Cannot find module" error

## Task Commits

Each task was committed atomically:

1. **Task 1: Install Playwright and Vitest** - `7ce9d11` (chore)
2. **Task 2: Create test configuration files and test stubs** - `539ee93` (feat)

## Files Created/Modified

- `playwright.config.ts` - Playwright config: baseURL localhost:3000, testMatch *.spec.ts, webServer npm run dev
- `vitest.config.ts` - Vitest config: include tests/**/*.test.ts
- `tests/foundation.spec.ts` - 12 Playwright smoke tests covering all Phase 1 requirements
- `tests/dictionaries.test.ts` - Vitest unit test for en.json/tr.json key parity (intentionally fails until Plan 03)
- `package.json` - Added @playwright/test and vitest to devDependencies

## Decisions Made

- Added `testMatch: '**/*.spec.ts'` to `playwright.config.ts` — Playwright's default testMatch includes `*.test.ts`, which caused it to load `dictionaries.test.ts` and crash with a CJS/ESM error when trying to import vitest. Explicit testMatch separates the two test runners cleanly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added testMatch to playwright.config.ts to prevent CJS/ESM crash**
- **Found during:** Task 2 (Create test configuration files and test stubs)
- **Issue:** Playwright's default `testMatch` pattern includes `**/*.test.ts`, causing it to load `tests/dictionaries.test.ts` and crash with "Vitest cannot be imported in a CommonJS module" when running `--list`
- **Fix:** Added `testMatch: '**/*.spec.ts'` to `playwright.config.ts` so Playwright only picks up `.spec.ts` files
- **Files modified:** `playwright.config.ts`
- **Verification:** `npx playwright test --list` exits 0, lists 12 tests from foundation.spec.ts
- **Committed in:** `539ee93` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix was necessary for correct operation. No scope creep.

## Issues Encountered

- The project already had a Next.js scaffold committed (commit `b3f127b`) when Task 1 ran, so the initial `npm init -y` package.json was superseded. The `npm install -D @playwright/test vitest` command was run a second time against the real Next.js `package.json` to properly register the packages.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Test harness is ready: any plan executor can run `npx playwright test --grep @smoke` after each commit for real pass/fail signal
- `npx playwright test --list` exits 0: no "config missing" or "command not found" errors for downstream executors
- `tests/dictionaries.test.ts` is wired and waiting — it will turn green automatically once Plan 03 creates `dictionaries/en.json` and `dictionaries/tr.json`

---
*Phase: 01-foundation*
*Completed: 2026-03-19*
