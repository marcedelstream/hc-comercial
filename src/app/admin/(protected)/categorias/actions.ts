'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function addCategoryAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  if (!name) return
  await supabaseAdmin.from('categories').upsert(
    { name, slug: toSlug(name), active: true, updated_at: new Date().toISOString() },
    { onConflict: 'slug', ignoreDuplicates: false }
  )
  revalidatePath('/admin/categorias')
}

export async function deleteCategoryAction(id: number) {
  const { count } = await supabaseAdmin
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)
  if ((count ?? 0) > 0) return
  await supabaseAdmin.from('categories').delete().eq('id', id)
  revalidatePath('/admin/categorias')
  revalidatePath('/admin/productos')
}
