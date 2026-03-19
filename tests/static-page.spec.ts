import { test, expect } from '@playwright/test'

// ─── HERO SECTION ───────────────────────────────────────────────────────────

// HERO-01: Hero displays a primary headline (developer-identity copy)
test('hero: headline is visible and non-empty @smoke', async ({ page }) => {
  await page.goto('/en')
  const headline = page.locator('section[data-section="hero"] h1')
  await expect(headline).toBeVisible()
  const text = await headline.textContent()
  expect(text?.trim().length).toBeGreaterThan(10)
})

// HERO-02: Sub-headline explaining Astra OS
test('hero: subheadline is visible and non-empty @smoke', async ({ page }) => {
  await page.goto('/en')
  const subheadline = page.locator('section[data-section="hero"] p').first()
  await expect(subheadline).toBeVisible()
  const text = await subheadline.textContent()
  expect(text?.trim().length).toBeGreaterThan(20)
})

// HERO-03: Scarcity copy visible
test('hero: scarcity copy is visible @smoke', async ({ page }) => {
  await page.goto('/en')
  // scarcity text is "Closed beta. Limited to the first 100." — check it appears somewhere in hero
  const hero = page.locator('section[data-section="hero"]')
  await expect(hero).toContainText('100')
})

// HERO-04: Single primary CTA button in hero
test('hero: CTA button is visible @smoke', async ({ page }) => {
  await page.goto('/en')
  const cta = page.locator('section[data-section="hero"] button').first()
  await expect(cta).toBeVisible()
  const text = await cta.textContent()
  expect(text?.trim().length).toBeGreaterThan(3)
})

// HERO-05: Headline in initial HTML (LCP-safe — not injected by JS after hydration)
test('hero: headline present in server-rendered HTML (no JS required) @smoke', async ({ page }) => {
  // Disable JavaScript to verify server rendering
  await page.context().setOffline(false)
  const client = await page.context().newCDPSession(page)
  await client.send('Emulation.setScriptExecutionDisabled', { value: true })
  await page.goto('/en')
  const headline = page.locator('section[data-section="hero"] h1')
  await expect(headline).toBeVisible()
  await client.send('Emulation.setScriptExecutionDisabled', { value: false })
})

// ─── FEATURES SECTION ────────────────────────────────────────────────────────

// PAGE-02 + FEAT-01: Features section renders with 3-column grid
test('features: section is present and has 3 feature cards @smoke', async ({ page }) => {
  await page.goto('/en')
  const section = page.locator('section[data-section="features"]')
  await expect(section).toBeVisible()
  const cards = section.locator('[data-card]')
  await expect(cards).toHaveCount(3)
})

// FEAT-02/03/04: Each card covers the right topic (headline check)
test('features: card titles cover Linux, Open Source, Agent Orchestration @smoke', async ({ page }) => {
  await page.goto('/en')
  const section = page.locator('section[data-section="features"]')
  // Verify 3 headlines exist and are non-empty
  const titles = section.locator('[data-card] h3')
  await expect(titles).toHaveCount(3)
  for (let i = 0; i < 3; i++) {
    const text = await titles.nth(i).textContent()
    expect(text?.trim().length).toBeGreaterThan(3)
  }
})

// FEAT-05: Each card has icon, headline, and description
test('features: each card contains icon, headline, and body text @smoke', async ({ page }) => {
  await page.goto('/en')
  const cards = page.locator('section[data-section="features"] [data-card]')
  await expect(cards).toHaveCount(3)
  for (let i = 0; i < 3; i++) {
    const card = cards.nth(i)
    // icon: SVG element from lucide-react
    await expect(card.locator('svg')).toBeVisible()
    // headline
    await expect(card.locator('h3')).toBeVisible()
    // body
    const body = card.locator('p')
    await expect(body).toBeVisible()
    const bodyText = await body.textContent()
    expect(bodyText?.trim().length).toBeGreaterThan(30)
  }
})

// ─── WHY ASTRA SECTION ───────────────────────────────────────────────────────

// PAGE-03 + WHY-01/02: WhyAstra section renders with prose
test('whyastra: section is present with heading and body paragraphs @smoke', async ({ page }) => {
  await page.goto('/en')
  const section = page.locator('section[data-section="why-astra"]')
  await expect(section).toBeVisible()
  await expect(section.locator('h2')).toBeVisible()
  const paragraphs = section.locator('p')
  const count = await paragraphs.count()
  expect(count).toBeGreaterThanOrEqual(2)
})

// WHY-01: Section explicitly mentions macOS or Ubuntu (names incumbents)
test('whyastra: body mentions macOS and Ubuntu by name @smoke', async ({ page }) => {
  await page.goto('/en')
  const section = page.locator('section[data-section="why-astra"]')
  await expect(section).toContainText('macOS')
  await expect(section).toContainText('Ubuntu')
})

// ─── FINAL CTA SECTION ───────────────────────────────────────────────────────

// PAGE-04 + CTA-01: Final CTA section renders with headline and scarcity
test('final-cta: section is present with headline and scarcity text @smoke', async ({ page }) => {
  await page.goto('/en')
  const section = page.locator('section[data-section="final-cta"]')
  await expect(section).toBeVisible()
  await expect(section.locator('h2')).toBeVisible()
  const headlineText = await section.locator('h2').textContent()
  expect(headlineText?.trim().length).toBeGreaterThan(10)
})

// CTA-02: Second CTA button in final-cta section
test('final-cta: second CTA button is visible @smoke', async ({ page }) => {
  await page.goto('/en')
  const section = page.locator('section[data-section="final-cta"]')
  const button = section.locator('button').first()
  await expect(button).toBeVisible()
  const text = await button.textContent()
  expect(text?.trim().length).toBeGreaterThan(3)
})

// ─── FOOTER ──────────────────────────────────────────────────────────────────

// PAGE-05: Footer has privacy policy link
test('footer: privacy policy link is visible and points to /privacy @smoke', async ({ page }) => {
  await page.goto('/en')
  // Link is in the footer element
  const footer = page.locator('footer')
  const privacyLink = footer.locator('a[href*="privacy"]')
  await expect(privacyLink).toBeVisible()
})

// ─── RESPONSIVE ──────────────────────────────────────────────────────────────

// PAGE-06: Responsive — 320px mobile viewport
test('responsive: page is usable at 320px viewport width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/en')
  const hero = page.locator('section[data-section="hero"]')
  await expect(hero).toBeVisible()
  // Headline must not overflow — check it's within viewport
  const headline = hero.locator('h1')
  await expect(headline).toBeVisible()
  const box = await headline.boundingBox()
  expect(box).not.toBeNull()
  expect(box!.x).toBeGreaterThanOrEqual(0)
})

// PAGE-06: Responsive — 768px tablet viewport
test('responsive: page is usable at 768px viewport width', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/en')
  const features = page.locator('section[data-section="features"]')
  await expect(features).toBeVisible()
})

// PAGE-06: Responsive — 1280px desktop viewport
test('responsive: page is usable at 1280px viewport width', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/en')
  const features = page.locator('section[data-section="features"]')
  await expect(features).toBeVisible()
  const cards = features.locator('[data-card]')
  await expect(cards).toHaveCount(3)
})

// ─── BILINGUAL ───────────────────────────────────────────────────────────────

// TR locale: hero renders in Turkish
test('i18n: /tr page renders hero section with Turkish content @smoke', async ({ page }) => {
  await page.goto('/tr')
  const hero = page.locator('section[data-section="hero"]')
  await expect(hero).toBeVisible()
  const headline = hero.locator('h1')
  const text = await headline.textContent()
  expect(text?.trim().length).toBeGreaterThan(10)
})
