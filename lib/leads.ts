/**
 * Local JSON file lead storage — server-side only.
 * Writes waitlist submissions to data/leads.json.
 * Replace this module with Supabase client when ready.
 */

import fs from 'fs'
import path from 'path'

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json')

export interface WaitlistRecord {
  firstName: string
  lastName: string
  email: string
  q1: string
  q1OtherText?: string
  q2: string
  q3: string
  q4: string
  q4OtherText?: string
  locale?: string
  // Metadata for analytics
  ip?: string
  userAgent?: string
  country?: string
  city?: string
  timezone?: string
}

interface LeadEntry extends WaitlistRecord {
  submittedAt: string
}

function readLeads(): LeadEntry[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) return []
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8')
    return JSON.parse(raw) as LeadEntry[]
  } catch {
    return []
  }
}

function writeLeads(leads: LeadEntry[]): void {
  const dir = path.dirname(LEADS_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8')
}

/**
 * Check whether an email already exists in the leads file.
 */
export function checkDuplicate(email: string): boolean {
  const leads = readLeads()
  return leads.some((l) => l.email.toLowerCase() === email.toLowerCase())
}

/**
 * Append a new lead to the JSON file.
 * Throws on write errors so the caller can handle gracefully.
 */
export function createWaitlistRecord(record: WaitlistRecord): void {
  const leads = readLeads()
  leads.push({ ...record, submittedAt: new Date().toISOString() })
  writeLeads(leads)
}
