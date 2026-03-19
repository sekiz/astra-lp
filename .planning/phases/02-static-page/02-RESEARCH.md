# Phase 2: Static Page - Research

**Researched:** 2026-03-19
**Domain:** Next.js App Router, Tailwind v4, next-intl, Lucide React, bilingual copywriting
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Section**
- Height: Full viewport (100vh) — hero fills the entire screen on load
- Background: Pure black (#0a0a0a) with a subtle radial gradient glow in accent color (#6366f1) centered behind the headline
- Content alignment: Center-aligned — headline, subheadline, scarcity line, and CTA all horizontally centered
- CTA button: Solid accent fill — #6366f1 background, white text, with arrow icon

**Hero Copy Direction**
- Headline style: Identity claim, developer-direct (e.g. "The OS Built for the Agent Era.")
- Scarcity framing: Urgency / limited access — "Closed beta. Limited to the first 100." Hard scarcity signal
- Scarcity presentation: Text only — no counter, no badge, no progress indicator
- Sub-headline: 1-2 concrete sentences explaining Astra OS (Linux-based, kernel-level agent orchestration)

**Feature Cards**
- Icons: Lucide icons rendered in accent color (#6366f1)
- Card treatment: Bordered cards — bg: --color-bg-surface (#111111), border: 1px solid --color-border (#262626)
- Layout: 3-column grid on desktop, stacks to 1 column on mobile
- Card content: icon + short headline + 2-3 sentence description
- Copy tone: Peer-to-peer technical language

**"Why Astra OS?" Section**
- Layout: Prose paragraphs with bold callouts — essay-style, 2-3 focused paragraphs
- Tone: Honest critique of incumbents — names macOS and Ubuntu explicitly

**Final CTA Section**
- Style: Contained dark panel (--color-bg-elevated, #1a1a1a)
- Copy: Fresh scarcity wording distinct from hero
- Button: Same CTA button style as hero ("Get Early Access →")

**Footer**
- Minimal footer: Privacy policy link, language switcher, copyright
- Fill in Footer section copy from dictionaries (privacyLink, copyright)

### Claude's Discretion
- Exact copy wording for EN and TR dictionaries — use "Apple polish, Linux freedom" tone guideline
- Specific Lucide icon choices per feature card
- Exact radial glow implementation (CSS gradient vs Tailwind arbitrary values)
- Spacing between sections — reasonable breathing room, not over-padded
- Turkish copy — native-quality translations, not machine-translated

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PAGE-02 | Page renders a 3-column Features section below the hero | Grid layout pattern, Tailwind responsive grid, card component structure |
| PAGE-03 | Page renders a "Why Astra OS?" positioning section | Prose section pattern, Next.js server component with translation |
| PAGE-04 | Page renders a Final CTA section with second waitlist signup opportunity | Contained panel pattern using --color-bg-elevated token |
| PAGE-05 | Page renders a minimal Footer with privacy policy link | i18n/navigation Link, existing footer shell in layout.tsx to enhance |
| PAGE-06 | Page is fully responsive on mobile (320px+), tablet (768px+), desktop (1280px+) | Tailwind v4 responsive breakpoints, grid responsive stacking |
| HERO-01 | Hero displays a primary headline that speaks to developer identity | Copy direction locked; server-side `getTranslations` pattern |
| HERO-02 | Hero displays a sub-headline explaining Astra OS in 1-2 concrete sentences | Dictionary key `Hero.subheadline` already exists |
| HERO-03 | Hero displays scarcity copy communicating "First 100 users" closed-beta framing | Dictionary key `Hero.scarcity` already exists |
| HERO-04 | Hero displays a single primary CTA button | Styled button component, arrow icon from Lucide |
| HERO-05 | Hero headline and CTA render in initial HTML (not JS-animated in) for LCP | Server component = no hydration delay; avoid CSS animations on first paint |
| FEAT-01 | Features section renders a 3-column grid layout | Tailwind: `grid grid-cols-1 md:grid-cols-3` |
| FEAT-02 | Column 1 covers Linux Kernel foundation | Copy content for card1 in dictionaries |
| FEAT-03 | Column 2 covers Open Source philosophy | Copy content for card2 in dictionaries |
| FEAT-04 | Column 3 covers Agent Orchestration | Copy content for card3 in dictionaries |
| FEAT-05 | Each feature card contains an icon, headline, and 2-3 sentence description | Card component pattern + Lucide icon integration |
| FEAT-06 | Feature copy uses peer-to-peer technical language | Copywriting constraint; enforced by content, not code |
| WHY-01 | Section explains why macOS/Ubuntu fall short for AI agents | WhyAstra.body key in dictionaries |
| WHY-02 | Section explains Astra's kernel-level AI integration | Covered in WhyAstra.body prose |
| WHY-03 | Copy is intellectually honest and specific | Copywriting constraint |
| CTA-01 | Final section repeats scarcity framing with fresh copy | FinalCTA.headline + FinalCTA.scarcity dictionary keys |
| CTA-02 | Second CTA button that opens the same waitlist modal | Button component reused; modal wiring is Phase 3 — button is visible but non-functional in this phase |
</phase_requirements>

---

## Summary

Phase 2 is a content-and-styling phase. The infrastructure (routing, i18n, CSS tokens, layout shell) is fully in place from Phase 1. The work is: install `lucide-react`, populate the two dictionary JSON files with bilingual copy, and build five React server components inside `app/[lang]/page.tsx`. No new infrastructure is introduced.

The page is built entirely with server components except for the CTA button, which will become interactive in Phase 3. For this phase the CTA button can be a server-rendered `<button>` element — it needs to be visible and styled but not wired to anything. There is no `'use client'` boundary required for Phase 2.

The only new dependency is `lucide-react`. All other libraries (Next.js 16.2.0, Tailwind 4.2.2, next-intl 4.8.3) are already installed. The CSS custom property token system in `globals.css` covers every color needed — no new tokens required.

**Primary recommendation:** Build all sections as async server components using `getTranslations` (the established pattern from `privacy/page.tsx`). Install `lucide-react` before writing component code. Populate dictionaries first so TypeScript doesn't error on empty strings during development.

---

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.0 | App Router, server components | Project foundation |
| React | 19.2.4 | UI rendering | Project foundation |
| Tailwind CSS | 4.2.2 | Utility-first styling | Project foundation |
| next-intl | 4.8.3 | i18n, `getTranslations` server API | Project foundation |

### New Dependency

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lucide-react | latest (~0.475+) | Icon library — accent-colored SVG icons for feature cards | Locked decision in CONTEXT.md; tree-shakeable, zero custom SVG work |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lucide-react | heroicons, phosphor-icons, react-icons | Lucide is locked decision; also has best Next.js/React 19 compatibility and clean MIT license |
| CSS gradient for glow | canvas/WebGL blur | CSS is correct here — simpler, no JS, works with server components |

**Installation (only new package):**
```bash
npm install lucide-react
```

---

## Architecture Patterns

### Component Decomposition

The recommended structure keeps all Phase 2 content in `app/[lang]/page.tsx` as inline section components, or extracted to `components/` if any section exceeds ~60 lines. Given Phase 3 will extract the CTA button into a modal-wiring client component, keep the CTA button as a plain `<button>` for now with a clear `TODO(Phase 3)` comment.

```
app/[lang]/
  page.tsx              ← main file: imports all sections, calls getTranslations once

components/             ← extract here only if sections get large
  HeroSection.tsx       ← optional extraction
  FeaturesSection.tsx   ← optional extraction
  WhyAstraSection.tsx   ← optional extraction
  FinalCTASection.tsx   ← optional extraction

dictionaries/
  en.json               ← Phase 2: fill all empty strings
  tr.json               ← Phase 2: fill all empty strings
```

### Pattern 1: Server Component with getTranslations

Established pattern from `app/[lang]/privacy/page.tsx` — this is the exact pattern for Phase 2.

```typescript
// app/[lang]/page.tsx
import { getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  const t = await getTranslations({ locale: lang, namespace: 'Hero' })
  const tFeat = await getTranslations({ locale: lang, namespace: 'Features' })
  const tWhy = await getTranslations({ locale: lang, namespace: 'WhyAstra' })
  const tCTA = await getTranslations({ locale: lang, namespace: 'FinalCTA' })
  const tFooter = await getTranslations({ locale: lang, namespace: 'Footer' })

  return (
    <main>
      {/* sections below */}
    </main>
  )
}
```

### Pattern 2: Hero with Radial Gradient Glow

Tailwind v4 supports arbitrary values. The radial gradient glow is implemented as a CSS background on the hero's `<section>` or a positioned pseudo-element via `style` prop — whichever avoids custom CSS in globals.css.

```tsx
// Inline style approach for the radial glow (no new CSS file needed)
<section
  className="relative flex flex-col items-center justify-center min-h-screen text-center px-6"
  style={{
    background: 'radial-gradient(ellipse 60% 40% at 50% 40%, rgba(99,102,241,0.18) 0%, transparent 70%), #0a0a0a',
  }}
>
  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6">
    {t('headline')}
  </h1>
  <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-4">
    {t('subheadline')}
  </p>
  <p className="text-sm text-[var(--color-text-muted)] mb-10">
    {t('scarcity')}
  </p>
  {/* CTA button — styled but not wired (Phase 3 adds onClick) */}
  <button
    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold transition-colors"
    type="button"
    disabled
    aria-disabled="true"
  >
    {t('ctaButton')}
    <ArrowRight size={18} />
  </button>
</section>
```

### Pattern 3: Feature Cards Grid

```tsx
import { Terminal, Code2, Bot } from 'lucide-react'

// 3-col grid, stacks to 1 on mobile
<section className="px-6 py-24 max-w-6xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Card */}
    <div className="p-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <Terminal size={28} className="text-[var(--color-accent)] mb-4" />
      <h3 className="text-lg font-semibold mb-2">{tFeat('card1Title')}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{tFeat('card1Body')}</p>
    </div>
    {/* repeat for card2, card3 */}
  </div>
</section>
```

### Pattern 4: WhyAstra Prose Section

Dictionary key `WhyAstra.body` holds multi-paragraph prose. The cleanest approach is to store it as a single string with `\n\n` paragraph separators and split in the component — or use multiple sub-keys (`para1`, `para2`, `para3`). The existing dictionary schema only has a single `body` key.

**Decision:** Keep single `body` key. Render as `whitespace-pre-line` to respect line breaks (same pattern used in `Privacy` for `dataCollectedItems`). OR split on `\n\n` and map to `<p>` tags — this gives more styling control.

```tsx
// Preferred: split + map approach
const paragraphs = tWhy('body').split('\n\n')
<section className="px-6 py-24 max-w-3xl mx-auto">
  <h2 className="text-3xl font-bold mb-10">{tWhy('sectionTitle')}</h2>
  {paragraphs.map((para, i) => (
    <p key={i} className="mb-6 leading-relaxed text-[var(--color-text-secondary)]"
       dangerouslySetInnerHTML={{ __html: para }} />
  ))}
</section>
```

**Note:** `dangerouslySetInnerHTML` is safe here since content comes from project-controlled JSON files, not user input. This is needed to render `<strong>` bold callouts inside the prose. Alternatively store bold phrases as separate keys and compose in JSX.

**Better alternative — avoid dangerouslySetInnerHTML:** Store bold callouts as separate dictionary keys or use a simple markdown parser. The safest approach: use separate paragraph keys (`para1`, `para2`, `para3`) with inlined `<strong>` tags composed in JSX. This requires extending the dictionary schema but keeps all HTML in component code.

### Pattern 5: Final CTA Panel

```tsx
<section className="px-6 py-24">
  <div className="max-w-3xl mx-auto rounded-2xl bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-12 text-center">
    <h2 className="text-3xl font-bold mb-4">{tCTA('headline')}</h2>
    <p className="text-[var(--color-text-muted)] mb-8">{tCTA('scarcity')}</p>
    <button
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-semibold transition-colors"
      type="button"
      disabled
      aria-disabled="true"
    >
      {tCTA('ctaButton')}
      <ArrowRight size={18} />
    </button>
  </div>
</section>
```

### Pattern 6: Footer Enhancement

The layout.tsx footer currently has hardcoded "© 2026 Astra OS" and no privacy link. Phase 2 fills in the dictionary keys and updates the footer markup.

```tsx
// In layout.tsx footer — replace hardcoded text with dictionary values
// Footer uses getTranslations at layout level (already imports getTranslations)
import { Link } from '../../i18n/navigation'

<footer className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] mt-auto">
  <Link href="/privacy" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
    {tFooter('privacyLink')}
  </Link>
  <span className="text-xs text-[var(--color-text-muted)]">{tFooter('copyright')}</span>
  <LanguageSwitcher />
</footer>
```

### Anti-Patterns to Avoid

- **Hardcoded text in JSX:** Every user-visible string must be in dictionaries. The existing test at `tests/dictionaries.test.ts` validates key parity.
- **`'use client'` on page sections:** Server components are the default and preserve LCP (HERO-05). Only add `'use client'` when interactivity is required — not needed in Phase 2.
- **CSS animations on hero headline:** HERO-05 requires headline in initial HTML. Fade-in CSS animations delay when text becomes visible for LCP measurement. No entry animations on hero content.
- **`aria-disabled` without `disabled` on button:** Always pair both when button is intentionally non-functional.
- **Importing entire lucide-react barrel:** Import named icons only — `import { Terminal } from 'lucide-react'` — not `import * from 'lucide-react'`. This keeps bundle size minimal.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG icons for features | Custom SVG files or embedded paths | `lucide-react` named imports | Already locked decision; consistent sizing, color, accessibility attrs |
| Language-aware internal links | `<a href="/en/privacy">` | `Link` from `i18n/navigation` | Automatically prepends locale; established pattern in project |
| Translation lookup | Direct `dictionaries/en.json` import in components | `getTranslations` from `next-intl/server` | Handles locale, caching, and type safety |
| CSS color values | Inline `#6366f1` strings | `var(--color-accent)` CSS custom properties | Token system already defined in globals.css; consistency |
| Responsive grid | Custom CSS media queries | Tailwind responsive prefixes (`md:grid-cols-3`) | Tailwind v4 is installed; don't duplicate |

---

## Common Pitfalls

### Pitfall 1: CTA Button Wiring Temptation

**What goes wrong:** Developer adds `onClick` to the CTA button in Phase 2, requiring `'use client'`, which wraps the entire page in a client boundary — breaking server rendering benefits and LCP.

**Why it happens:** Natural instinct to wire up visible UI.

**How to avoid:** Button is `type="button"` with `disabled` + `aria-disabled="true"` and a `TODO(Phase 3): wire to modal` comment. Phase 3 will extract the button to a client component.

**Warning signs:** If you see `'use client'` added to `page.tsx`, that's the wrong approach.

### Pitfall 2: Dictionary Value Empty Strings Causing Runtime Errors

**What goes wrong:** Component renders `t('headline')` which returns `""` — most dictionary keys are currently empty strings. Tailwind classes with empty content still render, but some UI elements may look broken during development.

**Why it happens:** The keys exist but values are empty — schema is correct, content is missing.

**How to avoid:** Populate dictionaries FIRST (Wave 1, Task 1) before building components. This way every component renders with real content immediately.

**Warning signs:** Empty sections in dev server, but no TypeScript errors.

### Pitfall 3: WhyAstra Body Multi-Paragraph Storage

**What goes wrong:** Storing the entire 3-paragraph prose body as one dictionary string with `\n\n` separators, then rendering with `dangerouslySetInnerHTML` to support `<strong>` tags inside paragraphs.

**Why it happens:** The existing `Privacy` page uses `whitespace-pre-line` on a multi-line value — tempting to copy that pattern.

**How to avoid:** Use separate sub-keys per paragraph OR render bold phrases as separate keys composed in JSX. If single body key is kept, avoid `dangerouslySetInnerHTML` — instead render without bold callouts (plain text paragraphs are fine for WHY-01/02/03 compliance).

**Warning signs:** `dangerouslySetInnerHTML` on content from dictionaries is not inherently unsafe here, but adds complexity.

### Pitfall 4: Footer Enhancement Scope

**What goes wrong:** Phase 2 scope says "fill in Footer section copy" but the current `layout.tsx` footer has hardcoded text AND doesn't have a privacy link at all. Forgetting to add the Link component means PAGE-05 (minimal footer with privacy policy link) is not met.

**Why it happens:** Existing footer looks "done" because it renders.

**How to avoid:** The footer must be modified in `layout.tsx` to add the privacy link. This means `layout.tsx` needs a `getTranslations` call added for `Footer` namespace. It already imports `getTranslations` — just add the footer namespace.

### Pitfall 5: Lucide Icon Color in Tailwind v4

**What goes wrong:** Using `text-accent` or `fill-accent` class — but `--color-accent` is a CSS custom property registered in `@theme`, not a named Tailwind color. Tailwind v4 may not generate `text-accent` by default.

**Why it happens:** In Tailwind v3, custom colors in config automatically get utility classes. In v4, `@theme` block vars are available as CSS vars.

**How to avoid:** Use `className="text-[var(--color-accent)]"` arbitrary value syntax, which definitely works with v4. OR verify that Tailwind v4's `@theme` block actually does expose `text-accent` (needs verification).

**Warning signs:** Icon renders in wrong color (inherits white from parent) despite class being set.

### Pitfall 6: Responsive Testing on Only Desktop

**What goes wrong:** PAGE-06 requires mobile (320px+), tablet (768px+), desktop (1280px+). Developer builds and tests on desktop only; mobile layout breaks.

**Why it happens:** Standard oversight.

**How to avoid:** The Playwright spec should include a mobile viewport test. Add responsive verification to the test file.

---

## Code Examples

### Lucide Import Pattern (verified against lucide-react docs)

```typescript
// Named imports only — never barrel import
import { Terminal, Code2, Bot, ArrowRight } from 'lucide-react'

// Usage with Tailwind arbitrary color value
<Terminal size={28} className="text-[var(--color-accent)] mb-4" />
```

### Tailwind v4 Grid Pattern

```tsx
// Responsive: 1 col mobile → 3 col desktop
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
```

Tailwind v4 breakpoints are unchanged from v3: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px).

### next-intl Server Component Pattern (established in project)

```typescript
// Multiple namespaces in one server component
const t = await getTranslations({ locale: lang, namespace: 'Hero' })
const tFeat = await getTranslations({ locale: lang, namespace: 'Features' })
```

### i18n/navigation Link for Privacy Footer

```tsx
import { Link } from '../../i18n/navigation'  // locale-aware Link

<Link href="/privacy" className="...">
  {tFooter('privacyLink')}
</Link>
```

---

## Recommended Lucide Icons (Claude's Discretion)

These are recommendations for the three feature card icons — not locked decisions:

| Feature | Recommended Icon | Rationale |
|---------|-----------------|-----------|
| Linux Kernel Foundation | `Terminal` or `Shield` | Terminal = developer trust; Shield = security framing |
| Open Source Philosophy | `Code2` or `Globe` | Code2 = open code; Globe = community/freedom |
| Agent Orchestration | `Bot` or `Network` | Bot = AI agents directly; Network = orchestration topology |

---

## Recommended Copy Drafts (Claude's Discretion)

These drafts give the planner a starting point — final wording is at Claude's discretion per tone guidelines.

### English

**Hero.headline:** `"Your OS doesn't know what an AI agent is. Astra does."`

**Hero.subheadline:** `"Astra OS is a Linux-based operating system with kernel-level AI agent orchestration — built for the developers who are serious about what comes next."`

**Hero.scarcity:** `"Closed beta. Limited to the first 100."`

**Hero.ctaButton:** `"Get Early Access →"`

**Features.sectionTitle:** `"Built differently, from the ground up."`

**Features.card1Title:** `"Linux Kernel Foundation"`
**Features.card1Body:** `"Built on a hardened Linux kernel — not a wrapper, not a compatibility layer. The same proven foundation that runs the world's most critical infrastructure, now optimized for AI workloads."`

**Features.card2Title:** `"Open Source, Always"`
**Features.card2Body:** `"Every line of Astra OS that can be open will be. No black boxes, no lock-in. You can inspect the scheduler, audit the agent runtime, and fork whatever you need."`

**Features.card3Title:** `"Kernel-Level Agent Orchestration"`
**Features.card3Body:** `"AI agent scheduling happens at the kernel, not in userspace middleware. Agents get real process isolation, direct hardware access, and first-class resource guarantees — not best-effort async glue."`

**WhyAstra.sectionTitle:** `"Why not macOS or Ubuntu?"`

**WhyAstra.body (3 paragraphs, use \n\n separator):**
`"macOS is built for humans using applications. The kernel scheduler does not know what a language model is, and Apple's security model treats AI agents as just another process — one it can silently throttle, sandbox, or kill. The result: agents lose context, pipelines break, and you spend your afternoon diagnosing permission errors instead of shipping.\n\nUbuntu plus whatever AI framework is popular this month gets you further — but you are still duct-taping a general-purpose OS to a problem it was never designed for. Agent orchestration lives in Python libraries. Process isolation is an afterthought. Every agent run competes with your desktop environment for the same unmanaged thread pool.\n\nAstra OS starts from a different question: what if the OS knew agents were the primary workload? Kernel-level scheduling priorities for agent processes. First-class inter-agent communication via IPC primitives, not HTTP. Resource quotas enforced at the scheduler, not the application layer. This is not a framework — it is the operating system itself."`

**FinalCTA.headline:** `"Ready to shape the future of AI infrastructure?"`
**FinalCTA.scarcity:** `"Seats fill fast. We're reviewing applications now."`
**FinalCTA.ctaButton:** `"Join the Waitlist →"`

**Footer.privacyLink:** `"Privacy Policy"`
**Footer.copyright:** `"© 2026 Astra OS. All rights reserved."`
**Footer.switchLanguage:** `"TR"` (same as Nav — may be redundant if LanguageSwitcher handles this)
**Footer.switchLanguageLabel:** `"Switch to Turkish"`
**Footer.switchLanguageLabelAlt:** `"Switch to English"`

### Turkish (native-quality)

**Hero.headline:** `"İşletim sisteminiz yapay zeka ajanının ne olduğunu bilmiyor. Astra biliyor."`

**Hero.subheadline:** `"Astra OS, çekirdek seviyesinde yapay zeka ajan orkestrasyonuna sahip Linux tabanlı bir işletim sistemi — yapay zekanın geleceğini ciddiye alan geliştiriciler için."`

**Hero.scarcity:** `"Kapalı beta. İlk 100 kullanıcıyla sınırlı."`

**Hero.ctaButton:** `"Erken Erişim Al →"`

**Features.sectionTitle:** `"Temelden farklı inşa edildi."`

**Features.card1Title:** `"Linux Çekirdek Temeli"`
**Features.card1Body:** `"Güçlendirilmiş bir Linux çekirdeği üzerine kurulu — katman değil, uyumluluk köprüsü değil. Dünyanın en kritik altyapısını çalıştıran kanıtlanmış temel, artık yapay zeka iş yükleri için optimize edildi."`

**Features.card2Title:** `"Her Zaman Açık Kaynak"`
**Features.card2Body:** `"Astra OS'un açılabilecek her satırı açık olacak. Kara kutu yok, bağımlılık yok. Zamanlayıcıyı inceleyebilir, ajan çalışma ortamını denetleyebilir ve ihtiyaç duyduğunuz her şeyi fork edebilirsiniz."`

**Features.card3Title:** `"Çekirdek Seviyesinde Ajan Orkestrasyonu"`
**Features.card3Body:** `"Yapay zeka ajan zamanlaması, userspace ara katmanında değil çekirdekte gerçekleşir. Ajanlar gerçek süreç izolasyonu, doğrudan donanım erişimi ve birinci sınıf kaynak garantileri alır — belirsiz async bant bezi değil."`

**WhyAstra.sectionTitle:** `"Neden macOS veya Ubuntu değil?"`

**WhyAstra.body:**
`"macOS, uygulama kullanan insanlar için tasarlandı. Çekirdek zamanlayıcısı bir dil modelinin ne olduğunu bilmiyor; Apple'ın güvenlik modeli yapay zeka ajanlarına sıradan bir süreç gibi davranıyor — sessizce kısıtlanabilir, sandbox'a alınabilir ya da sonlandırılabilir. Sonuç: ajanlar bağlamını kaybediyor, pipeline'lar bozuluyor, siz de öğleden sonranızı sevkiyat yapmak yerine izin hatalarını ayıklamakla geçiriyorsunuz.\n\nUbuntu artı popüler yapay zeka framework'ü sizi daha ileriye taşıyor — ama hâlâ genel amaçlı bir işletim sistemini hiç tasarlanmadığı bir soruna bantlıyorsunuz. Ajan orkestrasyonu Python kütüphanelerinde yaşıyor. Süreç izolasyonu sonradan düşünülmüş. Her ajan çalıştırması, aynı yönetimsiz thread havuzu için masaüstü ortamınızla rekabet ediyor.\n\nAstra OS farklı bir soruyla başlıyor: ya işletim sistemi ajanların birincil iş yükü olduğunu bilseydi? Ajan süreçleri için çekirdek seviyesinde zamanlama öncelikleri. HTTP değil, IPC primitive'leri üzerinden birinci sınıf ajan iletişimi. Uygulama katmanında değil, zamanlayıcıda uygulanan kaynak kotaları. Bu bir framework değil — işletim sisteminin kendisi."`

**FinalCTA.headline:** `"Yapay zeka altyapısının geleceğini şekillendirmeye hazır mısınız?"`
**FinalCTA.scarcity:** `"Yerler hızlı dolduruluyor. Başvuruları şimdi inceliyoruz."`
**FinalCTA.ctaButton:** `"Bekleme Listesine Katıl →"`

**Footer.privacyLink:** `"Gizlilik Politikası"`
**Footer.copyright:** `"© 2026 Astra OS. Tüm hakları saklıdır."`
**Footer.switchLanguage:** `"EN"`
**Footer.switchLanguageLabel:** `"Türkçe'ye geç"`
**Footer.switchLanguageLabelAlt:** `"İngilizce'ye geç"`

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind config.js custom colors | `@theme` block CSS vars in globals.css | Tailwind v4 (2025) | Colors as CSS custom properties; arbitrary value `var()` syntax required for direct usage |
| `useTranslations` in client components | `getTranslations` in server components | next-intl v3+ | Server-side translation eliminates hydration flicker; used throughout this project |
| Pages Router data fetching | App Router async server components | Next.js 13+ | `await params` pattern; no `getServerSideProps` |

**Deprecated/outdated:**
- `getServerSideProps`: Not used in App Router — use async server components with `await params`
- `next/image` for icons: Do not use for SVG icons from lucide-react — they render inline as SVG already
- Hardcoded locale in hrefs: Always use `Link` from `i18n/navigation`, never `<a href="/en/...">`

---

## Open Questions

1. **WhyAstra.body multi-paragraph approach**
   - What we know: Current schema has a single `body` key; Privacy page uses `whitespace-pre-line` for multi-line content
   - What's unclear: Whether to keep single key + `\n\n` split OR extend to `para1`/`para2`/`para3` sub-keys for styling control
   - Recommendation: Planner should decide; single key with paragraph split is simpler and avoids dictionary schema change. If bold callouts are needed inside paragraphs, extend to sub-keys.

2. **CTA button `disabled` state in Phase 2**
   - What we know: Button must be visible and styled (HERO-04, CTA-02) but NOT wired (Phase 3)
   - What's unclear: Whether `disabled` attribute causes visual degradation (reduced opacity in browser default styles)
   - Recommendation: Override disabled opacity in Tailwind — `disabled:opacity-100` or just don't add `disabled`; instead leave as a non-functional button with no `onClick`. An `onClick` that does nothing (`onClick={() => {}}`) keeps the button in server component but would require `'use client'`. Correct approach: render as pure HTML button with no handler and no `disabled` — it's visually complete, just doesn't do anything yet.

3. **Footer: layout.tsx vs page.tsx**
   - What we know: Footer is in `layout.tsx`, which is a server component that already imports `getTranslations`
   - What's unclear: Whether the footer needs `getTranslations` added to `LocaleLayout` or can use a separate server component
   - Recommendation: Add `tFooter` to `LocaleLayout` function by calling `getTranslations` for the `Footer` namespace. This is minimal change to existing file.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.2 (e2e) + Vitest 4.1.0 (unit) |
| Playwright config | `playwright.config.ts` — `testMatch: '**/*.spec.ts'` |
| Vitest config | `vitest.config.ts` — `include: ['tests/**/*.test.ts']` |
| Quick run (unit) | `npx vitest run` |
| Quick run (e2e) | `npx playwright test tests/static-page.spec.ts` |
| Full suite | `npx playwright test && npx vitest run` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-02 | Features 3-column grid renders | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| PAGE-03 | WhyAstra section renders | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| PAGE-04 | Final CTA section renders | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| PAGE-05 | Footer has privacy policy link | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| PAGE-06 | Responsive — mobile 320px viewport | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| HERO-01 | Hero headline present and non-empty | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| HERO-03 | Scarcity copy visible | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| HERO-04 | CTA button visible in hero | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| HERO-05 | Headline in initial HTML (no JS animation) | e2e | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| FEAT-01 | 3 feature cards present | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| CTA-01 | Final CTA section has headline and scarcity text | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| CTA-02 | Second CTA button visible | e2e smoke | `npx playwright test tests/static-page.spec.ts` | ❌ Wave 0 |
| EN+TR parity | Dictionary keys match across locales | unit | `npx vitest run` | ✅ `tests/dictionaries.test.ts` |
| EN+TR content | Dictionary values non-empty after Phase 2 | unit | `npx vitest run` | ❌ Wave 0 (new test) |

### Sampling Rate
- **Per task commit:** `npx vitest run` (unit tests, <5s)
- **Per wave merge:** `npx playwright test` + `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/static-page.spec.ts` — covers PAGE-02 through PAGE-06, HERO-01/03/04/05, FEAT-01, CTA-01/02
- [ ] Add non-empty values assertion to `tests/dictionaries.test.ts` (or new test file) — verifies all Phase 2 dictionary keys are populated

---

## Sources

### Primary (HIGH confidence)

- Direct codebase inspection — `app/[lang]/layout.tsx`, `app/[lang]/page.tsx`, `app/[lang]/privacy/page.tsx`, `components/LanguageSwitcher.tsx`, `app/globals.css`, `dictionaries/en.json`, `dictionaries/tr.json`, `playwright.config.ts`, `vitest.config.ts`, `package.json`
- Established project patterns from Phase 1 — next-intl `getTranslations`, Tailwind v4 `@theme` custom properties, `i18n/navigation` Link

### Secondary (MEDIUM confidence)

- Lucide React: Named export pattern, `size` prop, React 19 compatibility — standard usage documented at lucide.dev
- Tailwind v4 arbitrary value syntax for CSS custom properties (`text-[var(--color-accent)]`) — documented in Tailwind v4 migration guide

### Tertiary (LOW confidence — flag for validation)

- Tailwind v4 `@theme` block auto-generates utility classes: UNVERIFIED whether `text-accent` works without arbitrary value syntax. Use `text-[var(--color-accent)]` to be safe.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — package.json and node_modules verified directly
- Architecture: HIGH — patterns derived from existing project code (privacy page, layout, LanguageSwitcher)
- Copy recommendations: MEDIUM — drafted to spec but not reviewed by native Turkish speaker
- Pitfalls: HIGH — derived from code inspection of actual constraints

**Research date:** 2026-03-19
**Valid until:** 2026-04-19 (stable libraries, 30-day window)
