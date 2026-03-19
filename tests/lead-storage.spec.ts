import { test, expect } from '@playwright/test'

// ─── LEAD STORAGE (Route Handler) ────────────────────────────────────────────

// LEAD-01: Route Handler validates with Zod — missing field returns 400
test('api/waitlist: missing required field returns 400 @smoke', async ({ request }) => {
  const res = await request.post('/en/api/waitlist', {
    data: {
      firstName: 'Ada',
      // lastName missing
      email: 'ada@astraos.com',
      q1: 'Developer',
      q2: 'Yes',
      q3: 'No',
      q4: 'Kernel-level AI integration',
      consent: true,
    },
  })
  expect(res.status()).toBe(400)
})

// LEAD-01: Route Handler validates Zod — invalid email returns 400
test('api/waitlist: invalid email returns 400 @smoke', async ({ request }) => {
  const res = await request.post('/en/api/waitlist', {
    data: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'not-an-email',
      q1: 'Developer',
      q2: 'Yes',
      q3: 'No',
      q4: 'Kernel-level AI integration',
      consent: true,
    },
  })
  expect(res.status()).toBe(400)
})

// LEAD-01: Route Handler validates Zod — consent false returns 400
test('api/waitlist: consent false returns 400 @smoke', async ({ request }) => {
  const res = await request.post('/en/api/waitlist', {
    data: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@astraos.com',
      q1: 'Developer',
      q2: 'Yes',
      q3: 'No',
      q4: 'Kernel-level AI integration',
      consent: false,
    },
  })
  expect(res.status()).toBe(400)
})

// LEAD-01+02: Valid submission returns 200 with { success: true }
test('api/waitlist: valid submission returns 200 @smoke', async ({ request }) => {
  const res = await request.post('/en/api/waitlist', {
    data: {
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: `ada+${Date.now()}@astraos.com`,
      q1: 'Developer',
      q2: 'Yes',
      q3: 'No',
      q4: 'Kernel-level AI integration',
      consent: true,
      locale: 'en',
    },
  })
  expect(res.status()).toBe(200)
  const body = await res.json()
  expect(body.success).toBe(true)
})

// LEAD-03: Duplicate email returns 200 (silently handled)
test('api/waitlist: duplicate email returns 200 silently @smoke', async ({ request }) => {
  const email = `dup+${Date.now()}@astraos.com`
  const payload = {
    firstName: 'Test',
    lastName: 'Dup',
    email,
    q1: 'Founder',
    q2: 'No',
    q3: 'Maybe',
    q4: 'Open Source freedom',
    consent: true,
    locale: 'en',
  }
  // First submission
  const res1 = await request.post('/en/api/waitlist', { data: payload })
  expect(res1.status()).toBe(200)
  // Second submission (duplicate)
  const res2 = await request.post('/en/api/waitlist', { data: payload })
  expect(res2.status()).toBe(200)
  const body = await res2.json()
  expect(body.success).toBe(true)
})

// LEAD-04: Response never exposes internal error details
test('api/waitlist: error response does not expose internals @smoke', async ({ request }) => {
  const res = await request.post('/en/api/waitlist', {
    data: {},
  })
  const body = await res.json()
  // Should not contain stack traces or internal messages
  const raw = JSON.stringify(body)
  expect(raw).not.toContain('stack')
  expect(raw).not.toContain('AIRTABLE')
  expect(raw).not.toContain('airtable.com')
})
