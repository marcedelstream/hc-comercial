'use server'

import { fullSync } from '@/lib/ascont-sync'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function runSyncAction() {
  const result = await fullSync()

  try {
    await supabaseAdmin.from('sync_logs').insert({
      sync_type:       'manual',
      status:          result.ok ? 'success' : 'error',
      records_updated: result.ok ? (result.products ?? 0) : null,
      error_message:   result.ok ? null : (result.error ?? null),
      created_at:      new Date().toISOString(),
    })
  } catch { /* ignore log errors */ }

  revalidatePath('/admin/sincronizar')
  return result
}
