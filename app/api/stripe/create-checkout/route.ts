import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({ error: 'Use /api/stripe/create-checkout-session instead' }, { status: 410 })
}

