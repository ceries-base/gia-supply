import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const OMS_BASE      = process.env.OMS_BASE_URL!
const CF_CLIENT_ID  = process.env.GIA_CF_CLIENT_ID!
const CF_CLIENT_SECRET = process.env.GIA_CF_CLIENT_SECRET!

function omsHeaders() {
  return {
    'Content-Type': 'application/json',
    'CF-Access-Client-Id':     CF_CLIENT_ID,
    'CF-Access-Client-Secret': CF_CLIENT_SECRET,
  }
}

// GET — list orders (optionally filtered by submittedBy)
export async function GET(req: NextRequest) {
  const submittedBy = req.nextUrl.searchParams.get('submittedBy') ?? ''
  const url = `${OMS_BASE}/api/gia-supply/orders${submittedBy ? `?submittedBy=${encodeURIComponent(submittedBy)}` : ''}`
  const r = await fetch(url, { headers: omsHeaders() })
  const data = await r.json()
  return NextResponse.json(data, { status: r.status })
}

// POST — create order from cart
export async function POST(req: NextRequest) {
  const body = await req.json()
  const r = await fetch(`${OMS_BASE}/api/gia-supply/orders`, {
    method: 'POST',
    headers: omsHeaders(),
    body: JSON.stringify(body),
  })
  const data = await r.json()
  return NextResponse.json(data, { status: r.status })
}
