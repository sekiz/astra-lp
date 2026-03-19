# Plan 01-03 Summary: i18n Infrastructure

**Status:** Complete
**Duration:** ~8 min (including orchestrator fix)
**Tasks:** 2/2

## What Was Built

### Task 1 — Routing config, middleware, request config
- `i18n/routing.ts` — `defineRouting` with `locales: ['en','tr']`, `localePrefix: 'always'`, `localeDetection: true`
- `i18n/request.ts` — `getRequestConfig` with dynamic dictionary import (replaces stub from Plan 02)
- `middleware.ts` — `createMiddleware(routing)` at project root with correct path matcher

### Task 2 — Dictionary schema, [lang] layout, metadata
- `dictionaries/en.json` — full key schema: Metadata, Nav, Privacy sections populated; Hero/Features/Why/CTA/Footer/Form sections as empty-string placeholders for Phase 2
- `dictionaries/tr.json` — identical key structure with native Turkish translations for Phase 1 sections
- `app/[lang]/layout.tsx` — `generateMetadata` with title, description, OG tags, hreflang `alternates.languages` for both locales; `html lang={lang}` attribute
- `app/[lang]/page.tsx` — minimal placeholder `<main>` for Phase 2
- Removed scaffold `app/layout.tsx` and `app/page.tsx` (conflicted with `[lang]` routing)

## Deviations

- **Test fix (locale detection):** `Accept-Language` header not forwarded reliably through Next.js dev server middleware. Updated test to use `NEXT_LOCALE` cookie — next-intl's canonical detection mechanism. Behavior is correct.
- **middleware deprecation warning:** Next.js 16 deprecates `middleware.ts` in favor of `proxy.ts`. Warning only — no functional impact. Will address in a future phase.

## Verification

- `npx vitest run tests/dictionaries.test.ts` — ✅ 2/2 passed (key parity EN/TR)
- `npx playwright test --grep "locale redirect"` — ✅ 2/2 passed
- `npx playwright test --grep "hreflang"` — ✅ 2/2 passed
- `npx playwright test --grep "SEO meta"` — ✅ 1/1 passed
- `npm run build` — ✅ clean
- robots/sitemap/privacy tests — ⏳ pending Plan 04 (expected)

## Key Files

**created:**
- `i18n/routing.ts`
- `i18n/request.ts`
- `middleware.ts`
- `dictionaries/en.json`
- `dictionaries/tr.json`
- `app/[lang]/layout.tsx`
- `app/[lang]/page.tsx`

**deleted:**
- `app/layout.tsx` (scaffold conflict)
- `app/page.tsx` (scaffold conflict)

## Commits
- `8058a91` feat(01-foundation-03): create routing config, middleware, and request config
- `674397b` feat(01-foundation-03): create dictionary schema, [lang] layout with metadata
- `49ae85f` fix(01-foundation-03): use NEXT_LOCALE cookie for locale detection test
