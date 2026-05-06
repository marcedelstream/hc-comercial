import { NextRequest, NextResponse } from 'next/server'
import { fullSync } from '@/lib/ascont-sync'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function logSync(type: string, result: Awaited<ReturnType<typeof fullSync>>) {
  try {
    await supabaseAdmin.from('sync_logs').insert({
      sync_type:       type,
      status:          result.ok ? 'success' : 'error',
      records_updated: result.ok ? (result.products ?? 0) : null,
      error_message:   result.ok ? null : (result.error ?? null),
      created_at:      new Date().toISOString(),
    })
  } catch { /* ignore log errors */ }
}

// Llamada manual con SYNC_SECRET_KEY
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const expected   = `Bearer ${process.env.SYNC_SECRET_KEY}`

  if (!process.env.SYNC_SECRET_KEY || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await fullSync()
  await logSync('full', result)

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true, categories: result.categories, products: result.products })
}

// Cron de Vercel (cada 10 min) con CRON_SECRET
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await fullSync()
  await logSync('cron', result)

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }
  return NextResponse.json({ ok: true, categories: result.categories, products: result.products })
}
