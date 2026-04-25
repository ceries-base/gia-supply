import { NextResponse } from 'next/server'

export const runtime = 'edge'

const OMS_BASE         = process.env.OMS_BASE_URL!
const CF_CLIENT_ID     = process.env.GIA_CF_CLIENT_ID!
const CF_CLIENT_SECRET = process.env.GIA_CF_CLIENT_SECRET!

function omsHeaders() {
  return {
    'Content-Type': 'application/json',
    'CF-Access-Client-Id':     CF_CLIENT_ID,
    'CF-Access-Client-Secret': CF_CLIENT_SECRET,
  }
}

export async function GET() {
  const r = await fetch(`${OMS_BASE}/api/gia-supply/products`, { headers: omsHeaders() })
  const data = await r.json()
  return NextResponse.json(data, { status: r.status })
}
