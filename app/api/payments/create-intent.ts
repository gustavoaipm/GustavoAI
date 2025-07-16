// STRIPE INTEGRATION PAUSED: Manual payment records in use. Uncomment and configure when ready to enable Stripe.
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  return NextResponse.json({ error: 'Stripe integration is paused. Please record payments manually.' }, { status: 501 })
} 