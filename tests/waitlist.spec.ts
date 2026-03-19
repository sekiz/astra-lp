import { test, expect } from '@playwright/test'

// Helper: fill step 1 and advance to step 2
async function fillStep1(modal: import('@playwright/test').Locator) {
  await modal.locator('input[name="firstName"]').fill('Ada')
  await modal.locator('input[name="lastName"]').fill('Lovelace')
  await modal.locator('input[name="email"]').fill('ada@astraos.com')
  await modal.locator('button[data-action="continue"]').click()
}

// Helper: fill step 2 and advance to step 3
async function fillStep2(modal: import('@playwright/test').Locator) {
  await modal.locator('[data-question]').nth(0).locator('input[type="radio"]').first().check()
  await modal.locator('[data-question]').nth(1).locator('input[type="radio"]').first().check()
  await modal.locator('button[data-action="continue"]').click()
}

// ─── MODAL OPEN / CLOSE ───────────────────────────────────────────────────────

test('waitlist: hero CTA opens waitlist modal @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('section[data-section="hero"] button[data-cta]').first().click()
  await expect(page.locator('[data-modal="waitlist"]')).toBeVisible()
})

test('waitlist: final-cta button opens waitlist modal @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('section[data-section="final-cta"] button[data-cta]').first().click()
  await expect(page.locator('[data-modal="waitlist"]')).toBeVisible()
})

test('waitlist: modal closes with Escape key @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  await expect(page.locator('[data-modal="waitlist"]')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-modal="waitlist"]')).not.toBeVisible()
})

// ─── STEP 1: IDENTITY ────────────────────────────────────────────────────────

test('waitlist step 1: shows firstName, lastName, email fields @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await expect(modal.locator('input[name="firstName"]')).toBeVisible()
  await expect(modal.locator('input[name="lastName"]')).toBeVisible()
  await expect(modal.locator('input[name="email"]')).toBeVisible()
})

test('waitlist step 1: shows step progress "1 / 3" @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await expect(modal).toContainText('1')
  await expect(modal).toContainText('3')
})

test('waitlist step 1: empty submit shows validation errors @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await modal.locator('button[data-action="continue"]').click()
  await expect(modal.locator('[data-error]').first()).toBeVisible()
})

test('waitlist step 1: invalid email shows error @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await modal.locator('input[name="firstName"]').fill('Test')
  await modal.locator('input[name="lastName"]').fill('User')
  await modal.locator('input[name="email"]').fill('not-an-email')
  await modal.locator('button[data-action="continue"]').click()
  await expect(modal.locator('[data-error]').first()).toBeVisible()
})

test('waitlist step 1: valid data advances to step 2 @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await expect(modal.locator('[data-step="2"]')).toBeVisible()
})

// ─── STEP 2: QUESTIONS 1 & 2 ─────────────────────────────────────────────────

test('waitlist step 2: shows 2 qualifying questions @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await expect(modal.locator('[data-question]')).toHaveCount(2)
})

test('waitlist step 2: back button returns to step 1 @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await modal.locator('button[data-action="back"]').click()
  await expect(modal.locator('input[name="firstName"]')).toBeVisible()
})

test('waitlist step 2: valid answers advance to step 3 @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await fillStep2(modal)
  await expect(modal.locator('[data-step="3"]')).toBeVisible()
})

// ─── STEP 3: QUESTIONS 3 & 4 + GDPR ─────────────────────────────────────────

test('waitlist step 3: shows 2 qualifying questions + consent @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await fillStep2(modal)
  await expect(modal.locator('[data-question]')).toHaveCount(2)
  await expect(modal.locator('input[name="consent"]')).toBeVisible()
})

test('waitlist step 3: submit without consent shows error @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await fillStep2(modal)
  await modal.locator('[data-question]').nth(0).locator('input[type="radio"]').first().check()
  await modal.locator('[data-question]').nth(1).locator('input[type="radio"]').first().check()
  await modal.locator('button[data-action="submit"]').click()
  await expect(modal.locator('[data-error]').first()).toBeVisible()
})

test('waitlist step 3: back button returns to step 2 @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await fillStep2(modal)
  await modal.locator('button[data-action="back"]').click()
  await expect(modal.locator('[data-step="2"]')).toBeVisible()
})

test('waitlist: full flow shows success screen @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await fillStep1(modal)
  await fillStep2(modal)
  await modal.locator('[data-question]').nth(0).locator('input[type="radio"]').first().check()
  await modal.locator('[data-question]').nth(1).locator('input[type="radio"]').first().check()
  await modal.locator('input[name="consent"]').check()
  await modal.locator('button[data-action="submit"]').click()
  await expect(modal.locator('[data-screen="success"]')).toBeVisible({ timeout: 5000 })
})

// ─── COOKIE NOTICE ────────────────────────────────────────────────────────────

test('cookie notice: visible on first visit @smoke', async ({ page }) => {
  await page.goto('/en')
  await expect(page.locator('[data-section="cookie-notice"]')).toBeVisible()
})

test('cookie notice: dismisses after clicking accept @smoke', async ({ page }) => {
  await page.goto('/en')
  await page.locator('[data-section="cookie-notice"] button[data-action="accept"]').click()
  await expect(page.locator('[data-section="cookie-notice"]')).not.toBeVisible()
})

// ─── BILINGUAL ───────────────────────────────────────────────────────────────

test('i18n: waitlist modal renders in Turkish on /tr @smoke', async ({ page }) => {
  await page.goto('/tr')
  await page.locator('button[data-cta]').first().click()
  const modal = page.locator('[data-modal="waitlist"]')
  await expect(modal).toBeVisible()
  await expect(modal.locator('input[name="firstName"]')).toBeVisible()
})
