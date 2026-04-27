'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatusAction(id: number, formData: FormData) {
  const status = formData.get('status') as string
  await supabaseAdmin.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath(`/admin/ordenes/${id}`)
  revalidatePath('/admin/ordenes')
  revalidatePath('/admin/dashboard')
}
