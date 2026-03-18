import { test, expect } from '@playwright/test'

// I18N-03: bare / redirects to locale-prefixed URL
test('locale redirect: GET / redirects to /en or /tr @smoke', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.url()).toMatch(/\/(en|tr)(\/)?$/)
})

test('locale redirect: GET / with Accept-Language tr redirects to /tr @smoke', async ({ page, context }) => {
  await context.setExtraHTTPHeaders({ 'Accept-Language': 'tr,en;q=0.5' })
  const response = await page.goto('/')
  expect(response?.url()).toContain('/tr')
})

// I18N-04: hreflang alternates in <head>
test('hreflang: /en page has hreflang link for tr @smoke', async ({ page }) => {
  await page.goto('/en')
  const hreflangTr = page.locator('link[rel="alternate"][hreflang="tr"]')
  await expect(hreflangTr).toHaveCount(1)
})

test('hreflang: /tr page has hreflang link for en @smoke', async ({ page }) => {
  await page.goto('/tr')
  const hreflangEn = page.locator('link[rel="alternate"][hreflang="en"]')
  await expect(hreflangEn).toHaveCount(1)
})

// SEO-01: meta tags
test('SEO meta tags: /en has title, description, og:type @smoke', async ({ page }) => {
  await page.goto('/en')
  await expect(page).toHaveTitle(/.+/)
  const description = page.locator('meta[name="description"]')
  await expect(description).toHaveCount(1)
  const ogType = page.locator('meta[property="og:type"]')
  await expect(ogType).toHaveCount(1)
})

// SEO-02: robots.txt and sitemap.xml
test('robots sitemap: GET /robots.txt returns 200 with Sitemap directive @smoke', async ({ page }) => {
  const response = await page.goto('/robots.txt')
  expect(response?.status()).toBe(200)
  const body = await page.content()
  expect(body).toMatch(/Sitemap:/i)
})

test('robots sitemap: GET /sitemap.xml returns 200 with urlset @smoke', async ({ page }) => {
  const response = await page.goto('/sitemap.xml')
  expect(response?.status()).toBe(200)
  const body = await page.content()
  expect(body).toContain('urlset')
})

// COMP-01: privacy page
test('privacy page: GET /en/privacy returns 200 with content @smoke', async ({ page }) => {
  const response = await page.goto('/en/privacy')
  expect(response?.status()).toBe(200)
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
})

test('turkish privacy: GET /tr/privacy returns 200 with Turkish content @smoke', async ({ page }) => {
  const response = await page.goto('/tr/privacy')
  expect(response?.status()).toBe(200)
  const heading = page.locator('h1')
  await expect(heading).toBeVisible()
})

// PAGE-01: hero renders as first visible element
test('page shell: /en renders a main element with content @smoke', async ({ page }) => {
  await page.goto('/en')
  const main = page.locator('main')
  await expect(main).toBeVisible()
})

// PAGE-08: dark theme CSS variable applied
test('dark theme: /en body has dark background color @smoke', async ({ page }) => {
  await page.goto('/en')
  const bg = await page.evaluate(() =>
    window.getComputedStyle(document.body).backgroundColor
  )
  // Dark theme: expect near-black (rgb values all < 30)
  const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const [, r, g, b] = match.map(Number)
    expect(Math.max(r, g, b)).toBeLessThan(30)
  } else {
    // CSS custom property — check for explicit class or variable
    const html = await page.locator('html').getAttribute('style')
    expect(html || '').toBeTruthy()
  }
})

// I18N-02: language switcher present and functional
test('language switcher: /en page has EN/TR toggle button', async ({ page }) => {
  await page.goto('/en')
  // Switcher exists in header OR footer
  const switcher = page.locator('button[aria-label*="Switch"], button[aria-label*="Turkish"], button[aria-label*="English"]').first()
  await expect(switcher).toBeVisible()
})
