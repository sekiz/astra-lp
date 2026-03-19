/**
 * Airtable REST API helper — server-side only.
 * Uses fetch directly to avoid CJS/ESM conflicts with the `airtable` npm package.
 * Never import this on the client.
 */

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY ?? ''
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID ?? ''
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME ?? 'Waitlist'

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`

function headers() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  }
}

export interface WaitlistRecord {
  firstName: string
  lastName: string
  email: string
  q1: string
  q2: string
  q3: string
  q4: string
  locale?: string
}

/**
 * Check whether an email already exists in the Airtable table.
 * Returns true if a record with that email was found.
 */
export async function checkDuplicate(email: string): Promise<boolean> {
  const formula = encodeURIComponent(`{Email}="${email.replace(/"/g, '\\"')}"`)
  const url = `${BASE_URL}?filterByFormula=${formula}&fields%5B%5D=Email&maxRecords=1`

  const res = await fetch(url, { headers: headers() })
  if (!res.ok) {
    // If we can't check, treat as non-duplicate (fail open — better UX than blocking)
    return false
  }
  const data = (await res.json()) as { records: unknown[] }
  return data.records.length > 0
}

/**
 * Create a new waitlist record in Airtable.
 * Throws on network/API errors so the caller can handle gracefully.
 */
export async function createWaitlistRecord(record: WaitlistRecord): Promise<void> {
  const body = {
    fields: {
      FirstName: record.firstName,
      LastName: record.lastName,
      Email: record.email,
      Role: record.q1,
      OrchestrationExperience: record.q2,
      FinanceInterest: record.q3,
      ExcitedAbout: record.q4,
      Locale: record.locale ?? 'en',
      SubmittedAt: new Date().toISOString(),
    },
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => 'unknown error')
    // Log server-side only — never pass these details to the client
    console.error('[airtable] createRecord failed:', res.status, text)
    throw new Error(`Airtable write failed: ${res.status}`)
  }
}

/**
 * Returns true if the Airtable environment is configured with real credentials.
 * Used to skip real writes in local dev when env vars aren't set or are placeholders.
 */
export function isAirtableConfigured(): boolean {
  return (
    Boolean(AIRTABLE_API_KEY) &&
    Boolean(AIRTABLE_BASE_ID) &&
    !AIRTABLE_API_KEY.startsWith('your_') &&
    !AIRTABLE_BASE_ID.startsWith('your_')
  )
}
