import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { checkDuplicate, createWaitlistRecord } from '../../../../lib/leads'

const WaitlistSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  q1: z.string().min(1),
  q1OtherText: z.string().optional(),
  q2: z.string().min(1),
  q3: z.string().min(1),
  q4: z.string().min(1),
  q4OtherText: z.string().optional(),
  consent: z.literal(true),
  locale: z.enum(['en', 'tr']).optional(),
})

export async function POST(req: NextRequest) {
  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validate with Zod (LEAD-01)
  const result = WaitlistSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid submission', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const data = result.data

  try {
    // LEAD-03: Duplicate email — return success silently
    if (checkDuplicate(data.email)) {
      return NextResponse.json({ success: true })
    }

    // LEAD-02: Read request metadata
    const ip = req.headers.get('x-forwarded-for') || undefined
    const userAgent = req.headers.get('user-agent') || undefined
    const country = req.headers.get('x-vercel-ip-country') || undefined
    const city = req.headers.get('x-vercel-ip-city') || undefined
    const timezone = req.headers.get('x-vercel-ip-timezone') || undefined

    // LEAD-03: Write to leads.json (swap to Supabase here later)
    createWaitlistRecord({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      q1: data.q1,
      q1OtherText: data.q1OtherText,
      q2: data.q2,
      q3: data.q3,
      q4: data.q4,
      q4OtherText: data.q4OtherText,
      locale: data.locale,
      ip,
      userAgent,
      country,
      city,
      timezone,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    // LEAD-04: Log internally, never expose details to client
    console.error('[waitlist] Storage error:', err)
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503 }
    )
  }
}
