import { NextRequest, NextResponse } from 'next/server'

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params
  const r = await fetch(`${OMS_BASE}/api/gia-supply/orders/${orderId}`, {
    method: 'DELETE',
    headers: omsHeaders(),
  })
  const data = await r.json()
  return NextResponse.json(data, { status: r.status })
}
