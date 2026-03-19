# Plan 01-04 Summary: SEO, Compliance & Language Switcher

**Status:** Complete
**Duration:** ~5 min
**Tasks:** 2/2

## What Was Built

### Task 1 — SEO infrastructure + privacy page
- `app/robots.ts` — Next.js robots.txt convention; allows all crawlers, references sitemap URL
- `app/sitemap.ts` — sitemap.xml with hreflang alternates for `/en` and `/tr` routes via `NEXT_PUBLIC_BASE_URL`
- `app/[lang]/privacy/page.tsx` — bilingual privacy page; renders EN or TR content based on `lang` param; covers GDPR/KVKK data collection disclosure
- `i18n/navigation.ts` — next-intl v4 navigation helpers (`Link`, `redirect`, `useRouter`, `usePathname`) for use by client components in Phase 2+

### Task 2 — LanguageSwitcher + layout wiring
- `components/LanguageSwitcher.tsx` — `'use client'` component; reads current pathname, toggles between `/en/...` and `/tr/...`; renders `EN | TR` toggle
- `app/[lang]/layout.tsx` — updated to include `<header>` with `LanguageSwitcher` and `<footer>` with second `LanguageSwitcher` instance; both placements as required by CONTEXT.md

## Verification

- `npm run build` — ✅ clean (robots.txt, sitemap.xml, /[lang]/privacy all appear in route list)
- `npx playwright test --grep @smoke` — ✅ **11/11 passed**
  - locale redirect ✓, hreflang ✓, SEO meta ✓, robots/sitemap ✓, privacy EN+TR ✓, page shell ✓, dark theme ✓

## Key Files

**created:**
- `app/robots.ts`
- `app/sitemap.ts`
- `app/[lang]/privacy/page.tsx`
- `i18n/navigation.ts`
- `components/LanguageSwitcher.tsx`

**modified:**
- `app/[lang]/layout.tsx` (header + footer with LanguageSwitcher)

## Commits
- `edc88e7` feat(01-foundation-04): add robots.ts, sitemap.ts, i18n navigation helpers, and privacy page
- `d21e8d7` feat(01-foundation-04): add LanguageSwitcher component, wire into header and footer
