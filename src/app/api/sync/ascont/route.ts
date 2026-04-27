import { NextRequest, NextResponse } from 'next/server'
import { fullSync } from '@/lib/ascont-sync'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization')
  const expected   = `Bearer ${process.env.SYNC_SECRET_KEY}`

  if (!process.env.SYNC_SECRET_KEY || authHeader !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await fullSync()

  if (!result.ok) {
    try {
      await supabaseAdmin.from('sync_logs').insert({
        sync_type:     'full',
        status:        'error',
        error_message: result.error,
        created_at:    new Date().toISOString(),
      })
    } catch { /* ignore log errors */ }
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    ok:         true,
    categories: result.categories,
    products:   result.products,
  })
}
