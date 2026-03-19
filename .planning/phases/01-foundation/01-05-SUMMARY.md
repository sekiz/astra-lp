---
phase: 01-foundation
plan: "05"
subsystem: infra
tags: [vercel, env-vars, deployment, seo, next-js]

# Dependency graph
requires:
  - phase: 01-foundation-04
    provides: robots.ts and sitemap.ts that consume NEXT_PUBLIC_BASE_URL
provides:
  - Vercel project linked to repository with production deployment live
  - NEXT_PUBLIC_BASE_URL configured for production, preview, and development environments
  - .env.local for local development (localhost:3000)
  - Production URL documented: https://astra-lp.vercel.app
affects:
  - 02-waitlist (Phase 3 OAuth callback URL configuration)
  - 03-analytics
  - 04-launch

# Tech tracking
tech-stack:
  added: [vercel]
  patterns: [NEXT_PUBLIC_BASE_URL env var pattern for absolute URL generation in robots.ts/sitemap.ts/metadataBase]

key-files:
  created:
    - .env.local
  modified: []

key-decisions:
  - "Production URL is https://astra-lp.vercel.app — use this for Phase 3 OAuth callback configuration"
  - "NEXT_PUBLIC_BASE_URL set in Vercel for all three environments (Production, Preview, Development) to prevent localhost leaking into live SEO metadata"

patterns-established:
  - "NEXT_PUBLIC_BASE_URL pattern: all absolute URL generation (robots.txt, sitemap.xml, metadataBase) reads from this env var with http://localhost:3000 fallback for safety"

requirements-completed: [SEO-03]

# Metrics
duration: 10min
completed: 2026-03-19
---

# Phase 1 Plan 05: Vercel Deployment Configuration Summary

**Vercel project deployed at https://astra-lp.vercel.app with NEXT_PUBLIC_BASE_URL configured across all three environments so robots.txt and sitemap.xml serve production URLs instead of localhost**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-03-18T (Task 1 and 2 in prior session)
- **Completed:** 2026-03-19T00:13:31Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 1 (.env.local)

## Accomplishments

- Created `.env.local` with `NEXT_PUBLIC_BASE_URL=http://localhost:3000` for local development
- Confirmed `.gitignore` already includes `.env.local` — secrets not exposed
- Vercel project created and linked to repository, deployed to https://astra-lp.vercel.app
- `NEXT_PUBLIC_BASE_URL` set in Vercel dashboard for Production, Preview, and Development environments
- Live deployment confirmed at https://astra-lp.vercel.app/en — robots.txt and sitemap.xml serve production domain URLs

## Task Commits

Each task was committed atomically:

1. **Task 1: Create .env.local for local development** - `490bec0` (chore)
2. **Task 2: Create Vercel project and configure environment variables** - human-action (no code commit)
3. **Task 3: Verify Vercel deployment** - human-verify (user confirmed live URL)

## Files Created/Modified

- `.env.local` — Local dev environment variable: `NEXT_PUBLIC_BASE_URL=http://localhost:3000`

## Decisions Made

- Production URL is `https://astra-lp.vercel.app` — document this for Phase 3 OAuth callback URL registration
- Preview URL pattern follows Vercel's standard `https://astra-lp-git-[branch]-[team].vercel.app` format

## Deviations from Plan

None — plan executed exactly as written. Tasks 2 and 3 were human-action and human-verify checkpoints completed by the user.

## Issues Encountered

None.

## User Setup Required

Completed by user:
- Vercel project created and linked to GitHub repository
- `NEXT_PUBLIC_BASE_URL` set for Production, Preview, and Development environments in Vercel dashboard
- Live deployment verified at https://astra-lp.vercel.app/en

## Next Phase Readiness

- Phase 2 (Waitlist) can proceed — all foundation infrastructure is in place
- **Phase 3 note:** When configuring LinkedIn OAuth (or any OAuth provider), register callback URLs against the production URL: `https://astra-lp.vercel.app`
- robots.txt and sitemap.xml on live deployment serve production domain URLs (SEO-03 satisfied)

---
*Phase: 01-foundation*
*Completed: 2026-03-19*
