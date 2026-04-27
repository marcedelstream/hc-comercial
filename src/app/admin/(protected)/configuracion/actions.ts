'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function saveSettingsAction(formData: FormData) {
  const keys = ['site_name', 'header_text', 'whatsapp']
  await Promise.all(
    keys.map((key) => {
      const value = JSON.stringify(formData.get(key) as string)
      return supabaseAdmin
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    })
  )
  revalidatePath('/admin/configuracion')
}
