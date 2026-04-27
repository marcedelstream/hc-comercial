'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function cleanAllDataAction() {
  await supabaseAdmin.from('products').delete().not('id', 'is', null)
  await supabaseAdmin.from('categories').delete().not('id', 'is', null)
  revalidatePath('/admin/seed')
  revalidatePath('/admin/productos')
  revalidatePath('/admin/categorias')
}
