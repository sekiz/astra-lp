# Phase 1: Foundation - Research

**Researched:** 2026-03-19
**Domain:** Next.js 15 App Router scaffold, next-intl v3 i18n routing, Next.js Metadata API (SEO), privacy page
**Confidence:** HIGH (all critical patterns verified against official Next.js docs v16.2.0 dated 2026-03-03 and next-intl official docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- URL prefix: both locales get a prefix — `astros.com/en/` and `astros.com/tr/`
- Default detection: middleware checks `Accept-Language` header — Turkish browser → `/tr/`, everything else → `/en/`
- Bare `/` redirects to detected locale (not a hard-coded default)
- Language switcher appears in **both** header navbar and footer
- Language switcher component is a client island (`'use client'`) — minimal JS, isolated from static content

### Claude's Discretion
- Exact middleware implementation (next-intl vs custom)
- Dictionary file schema shape (flat vs nested keys)
- Cookie-based locale persistence (remember user's last switch)
- Privacy page copy content — minimal GDPR/KVKK bullets sufficient for launch

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
- LinkedIn OAuth is deferred to v2 — no OAuth concerns in this phase
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-01 | Page renders a full-screen Hero section as the first visible element | `app/[lang]/page.tsx` Server Component renders `<HeroSection>` — established by scaffold in this phase; section content filled in Phase 2 |
| PAGE-08 | Page uses a dark-theme visual system throughout | Tailwind v4 CSS variable theming — `@theme` block in `globals.css`; `dark` class on `<html>` or CSS custom properties; set up in this phase's global styles |
| I18N-01 | All user-facing copy externalized into `dictionaries/en.json` and `dictionaries/tr.json` | Dictionary file structure established in Phase 1; components receive `dict` props from server — all subsequent phases follow this pattern |
| I18N-02 | Language switcher in header/nav allows toggling between EN and TR | `LanguageSwitcher` client component created in this phase; placed in both header and footer via layout |
| I18N-03 | URL structure uses `[lang]` routing (`/en/`, `/tr/`) with middleware locale detection | `app/[lang]/` route segment + next-intl middleware with `localePrefix: 'always'` + Accept-Language detection |
| I18N-04 | `hreflang` alternate link tags present in `<head>` for both locales | `generateMetadata` `alternates.languages` in `app/[lang]/layout.tsx`; verified against Next.js Metadata API docs |
| I18N-05 | Turkish copy is native-quality — full parity with English content | Structural concern: `tr.json` must mirror `en.json` key schema exactly; actual copy quality is a content concern, not a technical one |
| SEO-01 | Page has `<title>`, `<meta description>`, and Open Graph tags for both locales | `generateMetadata` in `app/[lang]/layout.tsx` with locale-aware title/description/OG fields |
| SEO-02 | `robots.txt` and `sitemap.xml` are present and correct | `app/robots.ts` and `app/sitemap.ts` file conventions — both verified in Next.js docs |
| SEO-03 | Vercel project configured with local, preview, and production environments before Phase 3 | Vercel project init, environment variable setup, and domain configuration — no Phase 3 OAuth dependencies exist in Phase 1 |
| COMP-01 | A `/privacy` page exists at launch with minimal privacy policy covering data collected | `app/[lang]/privacy/page.tsx` Server Component; localised via dictionary; minimal GDPR/KVKK bullet list |
</phase_requirements>

---

## Summary

Phase 1 establishes the technical skeleton that every subsequent phase plugs into. The work splits into four distinct areas: (1) project scaffold with Next.js 15 and Tailwind CSS v4, (2) next-intl v3 i18n infrastructure with `localePrefix: 'always'` and Accept-Language detection, (3) Next.js Metadata API configuration for SEO with hreflang alternates, and (4) the privacy page required for launch compliance.

All four areas are well-documented in official sources with HIGH confidence. This is not a research-heavy phase — the patterns are standard and the official docs are current. The main planning discipline is sequencing: the `[lang]` route segment and dictionary schema must be locked before any component in Phases 2+ is built, because retrofitting i18n into hardcoded-copy components is a rewrite, not an edit.

The one discretionary area with real options is the dictionary schema shape (flat vs nested keys). Research recommends nested keys organised by section — this matches next-intl's official examples and makes key ownership obvious as the project grows.

**Primary recommendation:** Use next-intl v3 with `localePrefix: 'always'`, `defineRouting` in `i18n/routing.ts`, and `createMiddleware` in `middleware.ts`. This gives Accept-Language detection, cookie persistence, and hreflang alternate headers out of the box with no custom code.

---

## Standard Stack

### Core (Phase 1 installs)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | App Router framework | Official docs current (v16.2.0); Turbopack stable; `[lang]` dynamic segment is the canonical App Router i18n pattern |
| TypeScript | 5.x | Type safety | `next.config.ts` natively supported; TypeScript-safe dictionary keys via next-intl's type generation |
| Tailwind CSS | 4.x | Utility-first styling | No `tailwind.config.js` needed; CSS-variable theming via `@theme`; `@import "tailwindcss"` in globals.css is the only config |
| next-intl | 3.x | i18n routing + translations | Purpose-built for App Router; Server Component translations = zero client JS for static text; handles hreflang alternates automatically in middleware |

### Supporting (Phase 1 installs)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/postcss | 4.x | PostCSS plugin for Tailwind v4 | Required with Next.js — replaces the old `tailwindcss` PostCSS plugin |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| next-intl middleware | Custom middleware | Custom requires manual Accept-Language parsing, cookie management, hreflang injection — ~150 lines of boilerplate for what next-intl does in 10 |
| Nested dictionary keys | Flat keys (`hero.title` vs `heroTitle`) | Nested is easier to organise at scale; flat avoids one level of destructuring but makes section ownership unclear |
| `app/sitemap.ts` | `next-sitemap` package | Built-in is simpler and has zero dependencies; `next-sitemap` only needed for very large or dynamic sitemaps |

**Installation:**
```bash
# Project scaffold (run once)
npx create-next-app@latest . --typescript --eslint --app --tailwind --src-dir=false

# i18n
npm install next-intl

# Tailwind v4 (if not included by create-next-app)
npm install tailwindcss @tailwindcss/postcss postcss
```

> Note: As of Next.js 15.2, `create-next-app --tailwind` installs Tailwind v4 automatically. Verify with `npm show tailwindcss version` after scaffold.

---

## Architecture Patterns

### Recommended Project Structure

```
/
├── app/
│   ├── [lang]/
│   │   ├── layout.tsx          # Root layout: html lang attr, metadata, dictionary load
│   │   ├── page.tsx            # Home page: assembles Server Component sections
│   │   └── privacy/
│   │       └── page.tsx        # Compliance page: GDPR/KVKK bullets
│   ├── robots.ts               # Next.js file convention → /robots.txt
│   └── sitemap.ts              # Next.js file convention → /sitemap.xml
├── components/
│   ├── LanguageSwitcher.tsx    # 'use client' — EN|TR toggle
│   └── (section components come in Phase 2)
├── dictionaries/
│   ├── en.json                 # All English copy, keyed by section
│   └── tr.json                 # All Turkish copy, identical key structure
├── i18n/
│   ├── routing.ts              # defineRouting config (locales, prefix, detection)
│   └── request.ts              # getRequestConfig (loads dictionary per locale)
├── middleware.ts               # createMiddleware(routing) — locale detection + redirect
└── next.config.ts              # withNextIntl plugin wrapper
```

### Pattern 1: next-intl Routing Configuration

**What:** Centralise routing config in `i18n/routing.ts`, consumed by both middleware and navigation helpers.
**When to use:** Always — this is the next-intl v3 canonical pattern for App Router.

```typescript
// i18n/routing.ts
// Source: https://next-intl.dev/docs/routing/middleware
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'always',    // Both /en/ and /tr/ get prefix — locked decision
  localeDetection: true      // Accept-Language header detection — locked decision
})
```

### Pattern 2: Middleware — Accept-Language Detection + Redirect

**What:** `middleware.ts` at project root exports `createMiddleware(routing)`. Handles: bare `/` → detected locale, Accept-Language header parsing, cookie persistence, hreflang alternate link headers.
**When to use:** Required — without this, `/` returns 404 and locale detection does not work.

```typescript
// middleware.ts
// Source: https://next-intl.dev/docs/routing/middleware
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except API routes, Next.js internals, and static files
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
}
```

**Locale detection order** (built into next-intl):
1. Locale prefix already in URL path (e.g. `/en/...`)
2. Previously saved locale cookie
3. Best-fit match against `Accept-Language` header
4. Fallback to `defaultLocale` (`'en'`)

### Pattern 3: Root Layout — Dictionary Load, lang Attribute, Metadata

**What:** `app/[lang]/layout.tsx` loads the correct dictionary, sets `<html lang>`, and exports locale-aware metadata.
**When to use:** This is the entry point for all locale-aware rendering.

```typescript
// app/[lang]/layout.tsx
// Source: Next.js generateMetadata docs (v16.2.0, 2026-03-03)
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' })

  return {
    metadataBase: new URL('https://astraos.com'),
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'tr': '/tr',
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'tr' ? 'tr_TR' : 'en_US',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  )
}
```

### Pattern 4: Dictionary Schema (Nested Keys by Section)

**What:** JSON dictionaries keyed by section, then by token. Both `en.json` and `tr.json` share identical key structure.
**When to use:** Always — hardcoded strings in JSX prevent bilingual support.

```json
// dictionaries/en.json — Phase 1 skeleton (sections populated in Phase 2)
{
  "Metadata": {
    "title": "Astra OS — AI Operating System | Join the Closed Beta",
    "description": "Linux-based AI OS with kernel-level agent orchestration. First 100 developers shape the platform."
  },
  "Nav": {
    "switchLanguage": "TR",
    "switchLanguageLabel": "Switch to Turkish"
  },
  "Privacy": {
    "title": "Privacy Policy",
    "intro": "Astra OS collects only the data you provide during waitlist signup.",
    "dataCollected": "Data we collect",
    "contact": "Contact"
  },
  "Hero": {},
  "Features": {},
  "WhyAstra": {},
  "FinalCTA": {},
  "Footer": {}
}
```

### Pattern 5: Locale-Aware Sitemap with hreflang

**What:** `app/sitemap.ts` using Next.js file convention. `alternates.languages` generates `<xhtml:link rel="alternate" hreflang="...">` entries.
**When to use:** Required for SEO-02. Built-in, zero dependencies.

```typescript
// app/sitemap.ts
// Source: Next.js sitemap docs (v16.2.0, 2026-03-03)
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://astraos.com'
  return [
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          tr: `${baseUrl}/tr`,
        },
      },
    },
    {
      url: `${baseUrl}/tr`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          tr: `${baseUrl}/tr`,
        },
      },
    },
    {
      url: `${baseUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy`,
          tr: `${baseUrl}/tr/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/tr/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/en/privacy`,
          tr: `${baseUrl}/tr/privacy`,
        },
      },
    },
  ]
}
```

### Pattern 6: robots.ts

**What:** `app/robots.ts` using Next.js file convention.
**When to use:** Required for SEO-02.

```typescript
// app/robots.ts
// Source: Next.js docs file conventions
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://astraos.com/sitemap.xml',
  }
}
```

### Pattern 7: LanguageSwitcher Client Island

**What:** Minimal `'use client'` component using next-intl's `useRouter` and `usePathname` to toggle locale.
**When to use:** Required for I18N-02. Keep this component tiny — it is the only JS needed for the switcher.

```typescript
// components/LanguageSwitcher.tsx
'use client'
// Source: next-intl routing docs
import { useRouter, usePathname } from 'next-intl/client'
import { useLocale } from 'next-intl'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    router.replace(pathname, { locale: locale === 'en' ? 'tr' : 'en' })
  }

  return (
    <button onClick={toggleLocale} aria-label={locale === 'en' ? 'Switch to Turkish' : 'Switch to English'}>
      {locale === 'en' ? 'TR' : 'EN'}
    </button>
  )
}
```

### Pattern 8: Tailwind v4 Global CSS

**What:** No `tailwind.config.js`. Configuration lives in `globals.css` via `@theme`.
**When to use:** Always — Tailwind v4 is CSS-native. Dark theme tokens defined here serve all phases.

```css
/* app/globals.css */
/* Source: https://tailwindcss.com/docs/guides/nextjs */
@import "tailwindcss";

@theme {
  /* Dark theme design tokens — add project-specific values here */
  --color-bg-primary: #0a0a0a;
  --color-bg-surface: #111111;
  --color-text-primary: #f5f5f5;
  --color-text-muted: #a3a3a3;
  --color-accent: #6366f1;
}
```

### Anti-Patterns to Avoid

- **Hardcoding copy in JSX:** `<h1>Join the Waitlist</h1>` directly in a component makes bilingual support require parallel component variants. Every string must come from the dictionary.
- **Single-locale layout:** Placing `app/layout.tsx` at root instead of `app/[lang]/layout.tsx` breaks locale routing entirely. The `[lang]` segment is the architectural keystone.
- **Client-side dictionary loading:** Loading translations in a `useEffect` or client-side hook ships the dictionary as JS payload and breaks SSR. Use `getTranslations()` (server) or `useTranslations()` (RSC/client via provider).
- **Skipping `metadataBase`:** Omitting `metadataBase` in the root layout causes build errors when `alternates.languages` values are relative paths.
- **Custom Accept-Language parser:** next-intl's middleware handles edge cases (quality weights, language subtags, fallback chains) that a naive custom parser misses. Do not reinvent this.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accept-Language header parsing | Custom regex parser | next-intl middleware | Quality weights (`q=0.9`), language subtag normalisation, cookie persistence — all handled; edge cases take hours to get right |
| hreflang link injection | Manual `<link>` tags in `<head>` | next-intl middleware (auto) + `generateMetadata` alternates | Middleware adds hreflang headers; metadata generates `<link rel="alternate">` tags; missing either breaks SEO |
| Locale redirect logic | `if (path === '/') redirect(...)` | next-intl `createMiddleware` | Handles redirect, rewrite, cookie, and alternate links in one call |
| sitemap.xml generation | Static XML file | `app/sitemap.ts` file convention | Auto-updates `lastModified`; TypeScript-safe; hreflang alternates built-in since Next.js v14.2 |
| robots.txt | Static file in `/public` | `app/robots.ts` file convention | Programmatic, environment-aware (can disallow in preview), same pattern as sitemap |

**Key insight:** next-intl's middleware is not just a convenience — it correctly handles the full negotiation loop (prefix → cookie → Accept-Language → default) and injects the HTTP `Link` header for hreflang. Replicating this correctly in custom code is a multi-day effort.

---

## Common Pitfalls

### Pitfall 1: hreflang Missing or Mismatched

**What goes wrong:** Pages are indexed but not associated across locales; Google treats `/en` and `/tr` as separate unrelated pages, splitting ranking signals.
**Why it happens:** hreflang must appear in BOTH the `<head>` (via `generateMetadata` alternates) AND the sitemap. Doing one but not both is a common partial implementation.
**How to avoid:** Configure `generateMetadata` alternates in `app/[lang]/layout.tsx` AND include `alternates.languages` in `app/sitemap.ts`. Both are required per Google's guidelines.
**Warning signs:** Google Search Console reports "Alternate page with proper canonical tag" rather than indexing both locales.

### Pitfall 2: `[lang]` Segment Not Matching Middleware Locales

**What goes wrong:** Middleware redirects to `/en` but the `[lang]` segment doesn't exist or doesn't match `'en'`, causing a 404 redirect loop.
**Why it happens:** `locales` array in `defineRouting` and the actual `app/[lang]/` folder name must be consistent. A typo (`'en-US'` in routing but folder named `en`) breaks routing.
**How to avoid:** Use simple two-letter codes (`'en'`, `'tr'`) consistently in routing config, folder names, and dictionary file names.
**Warning signs:** All requests redirect in a loop; browser shows "too many redirects".

### Pitfall 3: Dictionary Key Divergence (EN vs TR)

**What goes wrong:** `en.json` has `hero.ctaButton` but `tr.json` is missing that key. Turkish version silently renders nothing or throws.
**Why it happens:** Dictionaries edited independently after initial creation.
**How to avoid:** Always edit both files simultaneously. In Phase 1, define the full key schema as empty strings in both files even before copy is written — this makes missing keys a linting/type error, not a runtime surprise.
**Warning signs:** TR version renders blank sections or throws `undefined` errors.

### Pitfall 4: `metadataBase` Missing Causes Build Error

**What goes wrong:** Build fails with "metadataBase must be set when using relative URLs in alternates" or similar.
**Why it happens:** `alternates.languages` values like `'/en'` require an absolute base URL to resolve.
**How to avoid:** Set `metadataBase: new URL('https://astraos.com')` in the root layout's `generateMetadata`. For local dev, Next.js falls back to `localhost:3000` if not set, but production build requires it.
**Warning signs:** `npm run build` fails; error references `metadataBase`.

### Pitfall 5: Tailwind v4 PostCSS Configuration

**What goes wrong:** Tailwind classes not applied; build warning about unknown plugin.
**Why it happens:** Tailwind v4 requires `@tailwindcss/postcss` as the PostCSS plugin, not the old `tailwindcss` PostCSS plugin. `create-next-app --tailwind` may install v3 in older project templates.
**How to avoid:** Verify `postcss.config.mjs` uses `"@tailwindcss/postcss": {}` (not `"tailwindcss": {}`). `globals.css` must use `@import "tailwindcss"` (not the old `@tailwind base/components/utilities` directives).
**Warning signs:** Classes render but no Tailwind styles applied; PostCSS build warning in dev console.

### Pitfall 6: Dark Theme Not Applied to `<html>`

**What goes wrong:** Tailwind dark utilities (`dark:`) don't activate; page renders in light mode.
**Why it happens:** Tailwind's `dark:` variant requires either a `class="dark"` on `<html>` (class strategy) or CSS media query strategy. For a site that is always dark (no toggle), CSS variables in `@theme` are cleaner — but `dark:` utilities still need configuration.
**How to avoid:** For a permanently-dark site, avoid using `dark:` prefixes entirely — define dark-theme values directly as the base values in `@theme`. No `class="dark"` management required.
**Warning signs:** Explicitly set dark background color doesn't appear; inspector shows default (light) backgrounds.

---

## Code Examples

### next-intl request configuration

```typescript
// i18n/request.ts
// Source: https://next-intl.dev/docs/getting-started/app-router
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'en' | 'tr')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../dictionaries/${locale}.json`)).default,
  }
})
```

### next.config.ts with next-intl plugin

```typescript
// next.config.ts
// Source: https://next-intl.dev/docs/getting-started/app-router
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()
export default withNextIntl({})
```

### Privacy page (Server Component, locale-aware)

```typescript
// app/[lang]/privacy/page.tsx
// Source: Next.js App Router Server Components pattern
import { getTranslations } from 'next-intl/server'

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Privacy' })

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('intro')}</p>
      {/* Minimal GDPR/KVKK bullets — copy from dictionary */}
    </main>
  )
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` | `@theme` block in CSS | Tailwind v4 (early 2025) | No PostCSS config file needed; `@tailwindcss/postcss` replaces old plugin |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4 (early 2025) | Single import line in globals.css |
| `next-intl` middleware at root | `createMiddleware(routing)` with `defineRouting` in `i18n/routing.ts` | next-intl v3 | Routing config is now a typed object consumed by both middleware and navigation helpers |
| Custom `<Link locale>` for language switching | `useRouter` from `next-intl/client` with `router.replace(pathname, { locale })` | next-intl v3 App Router | Replaces the old `next/link` locale prop pattern which was removed in Next.js 13+ |
| `middleware.ts` (always) | `proxy.ts` starting from Next.js 16 | Next.js 16 | Note: The search found a reference suggesting `proxy.ts` is the new name in Next.js 16. For Next.js 15, `middleware.ts` is correct — use `middleware.ts` for this project |

**Deprecated/outdated:**
- `tailwind.config.js`: Replaced by CSS-native `@theme` configuration in v4. Still works for v3 compatibility but not the v4 pattern.
- `next/link` `locale` prop: Removed in Next.js 13+ App Router. Use next-intl's navigation helpers instead.
- `i18n` config in `next.config.js`: Only for Pages Router. App Router uses `[lang]` segment + middleware.

---

## Open Questions

1. **Domain/base URL for `metadataBase`**
   - What we know: Code examples use `https://astraos.com` as a placeholder.
   - What's unclear: The actual production domain has not been confirmed in the project docs. `REQUIREMENTS.md` references `astros.com`; CONTEXT.md says `astros.com`.
   - Recommendation: Confirm the production domain before writing `metadataBase`. Use `NEXT_PUBLIC_BASE_URL` env variable rather than hardcoding — makes it environment-aware.

2. **Turkish copy availability for Phase 1**
   - What we know: I18N-05 requires native-quality Turkish — not machine-translated. Phase 1 establishes the dictionary schema but does not require all copy to be written.
   - What's unclear: Whether native Turkish copy is available for the privacy page and nav elements needed in Phase 1.
   - Recommendation: Phase 1 must define the complete key schema in both `en.json` and `tr.json`. For Phase 1 keys (Metadata, Nav, Privacy), placeholder Turkish strings are acceptable — but the structure must be in place. Full copy parity (I18N-05) is validated across all phases, not just Phase 1.

3. **Cookie-based locale persistence**
   - What we know: next-intl's `createMiddleware` sets a locale cookie automatically when a user navigates to a locale-prefixed URL.
   - What's unclear: Whether the project wants to honour the cookie as a persistence mechanism or always respect the URL prefix as authoritative.
   - Recommendation: next-intl's default behaviour (cookie as fallback, URL prefix as authoritative) is correct for this project. No custom configuration needed. Document this in the codebase so future contributors understand why `/` redirects may vary between sessions.

---

## Validation Architecture

`workflow.nyquist_validation` is set to `true` in `.planning/config.json` — this section is required.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield project |
| Config file | None — Wave 0 must create test infrastructure |
| Quick run command | `npx playwright test --grep @smoke` (once configured) |
| Full suite command | `npx playwright test` |

**Note:** This is a Next.js frontend project. Unit tests (Jest/Vitest) are appropriate for dictionary validation and utility functions. Integration/smoke tests (Playwright) are appropriate for route rendering, hreflang presence, and redirect behaviour. No backend logic exists in Phase 1, so no unit tests for business logic are needed.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01 | `GET /en` renders non-empty `<main>` | Playwright smoke | `npx playwright test --grep "hero renders"` | Wave 0 |
| PAGE-08 | Root `<html>` or `<body>` has dark background CSS variable applied | Playwright DOM check | `npx playwright test --grep "dark theme"` | Wave 0 |
| I18N-01 | No hardcoded English strings exist in `.tsx` files outside dictionaries | ESLint custom rule or grep | `grep -r '"[A-Z]' app/` (manual) | Manual check |
| I18N-02 | `GET /en` page contains an EN/TR toggle button; click → redirects to `/tr/` | Playwright interaction | `npx playwright test --grep "language switcher"` | Wave 0 |
| I18N-03 | `GET /` → 3xx redirect to `/en/` or `/tr/` based on Accept-Language header | Playwright request intercept | `npx playwright test --grep "locale redirect"` | Wave 0 |
| I18N-03 | `GET /` with `Accept-Language: tr` header → redirects to `/tr/` | Playwright | `npx playwright test --grep "turkish redirect"` | Wave 0 |
| I18N-04 | `<head>` on `/en` contains `<link rel="alternate" hreflang="tr" href=".../tr">` | Playwright DOM query | `npx playwright test --grep "hreflang"` | Wave 0 |
| I18N-05 | `tr.json` has identical top-level keys as `en.json` | Jest/Vitest unit test | `npx vitest run tests/dictionaries.test.ts` | Wave 0 |
| SEO-01 | `/en` `<head>` contains `<title>`, `<meta name="description">`, `<meta property="og:type">` | Playwright DOM query | `npx playwright test --grep "SEO meta tags"` | Wave 0 |
| SEO-02 | `GET /robots.txt` returns 200 with `Sitemap:` directive | Playwright request | `npx playwright test --grep "robots.txt"` | Wave 0 |
| SEO-02 | `GET /sitemap.xml` returns 200 with `<urlset>` containing `/en` and `/tr` URLs | Playwright request | `npx playwright test --grep "sitemap"` | Wave 0 |
| SEO-03 | Vercel project has environment variables set (local/preview/production) | Manual verification | N/A — manual check of Vercel dashboard | Manual only |
| COMP-01 | `GET /en/privacy` returns 200 and contains privacy policy content | Playwright smoke | `npx playwright test --grep "privacy page"` | Wave 0 |
| COMP-01 | `GET /tr/privacy` returns 200 and contains Turkish privacy content | Playwright smoke | `npx playwright test --grep "turkish privacy"` | Wave 0 |

### Sampling Rate

- **Per task commit:** `npx playwright test --grep @smoke` — covers redirect, hreflang, and meta tags (< 30 seconds)
- **Per wave merge:** `npx playwright test` — full suite
- **Phase gate:** Full suite green before moving to Phase 2

### Wave 0 Gaps

- [ ] `playwright.config.ts` — Playwright configuration with baseURL and test directory
- [ ] `tests/foundation.spec.ts` — smoke tests for I18N-03 redirects, I18N-04 hreflang, SEO-01 meta tags, SEO-02 robots/sitemap, COMP-01 privacy page
- [ ] `tests/dictionaries.test.ts` — Vitest unit test: `en.json` and `tr.json` key parity check
- [ ] Framework install: `npm install -D @playwright/test vitest` and `npx playwright install`
- [ ] `vitest.config.ts` — Vitest configuration for dictionary unit tests

---

## Sources

### Primary (HIGH confidence)

- Next.js generateMetadata API docs — https://nextjs.org/docs/app/api-reference/functions/generate-metadata (v16.2.0, last updated 2026-03-03) — alternates.languages, metadataBase, openGraph patterns
- Next.js sitemap.xml file convention docs — https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (v16.2.0, last updated 2026-03-03) — hreflang alternates in sitemap, MetadataRoute.Sitemap type
- next-intl App Router setup docs — https://next-intl.dev/docs/getting-started/app-router — getRequestConfig, withNextIntl plugin, useTranslations
- next-intl middleware docs — https://next-intl.dev/docs/routing/middleware — createMiddleware, defineRouting, localePrefix, localeDetection
- Tailwind CSS v4 Next.js installation guide — https://tailwindcss.com/docs/guides/nextjs — @tailwindcss/postcss, postcss.config.mjs, @import "tailwindcss"

### Secondary (MEDIUM confidence)

- ARCHITECTURE.md project research — full component map and data flow verified with official sources
- STACK.md project research — library versions cross-referenced with npm and official docs
- SUMMARY.md project research — phase rationale and pitfall catalogue

### Tertiary (LOW confidence)

- next-intl `proxy.ts` naming (vs `middleware.ts`) — search result mentioned Next.js 16 renamed the file; not yet verified in official Next.js 15 docs. Use `middleware.ts` for Next.js 15 (confirmed pattern).

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js and Tailwind verified from official docs at v16.2.0 / 2026-03-03; next-intl verified from official docs
- Architecture: HIGH — All patterns verified against official Next.js Metadata API and next-intl routing docs
- Pitfalls: HIGH — All pitfalls derive from documented behaviours (metadataBase requirement, middleware matcher, Tailwind v4 PostCSS change)

**Research date:** 2026-03-19
**Valid until:** 2026-06-19 (90 days — stable framework APIs; next-intl v3 is actively maintained but API is stable)
