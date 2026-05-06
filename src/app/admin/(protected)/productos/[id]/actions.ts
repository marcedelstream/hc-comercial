'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function updateProductAction(id: number, formData: FormData) {
  const salePriceRaw  = formData.get('sale_price') as string
  const categoryIdRaw = formData.get('category_id') as string
  await supabaseAdmin.from('products').update({
    featured:          formData.get('featured') === 'true',
    active:            formData.get('active') === 'true',
    sale_price:        salePriceRaw ? parseFloat(salePriceRaw) : null,
    category_id:       categoryIdRaw ? parseInt(categoryIdRaw) : null,
    short_description: formData.get('short_description') as string,
    description:       formData.get('description') as string,
    updated_at:        new Date().toISOString(),
  }).eq('id', id)
  revalidatePath('/admin/productos')
  revalidatePath(`/admin/productos/${id}`)
}

export async function addProductImageAction(id: number, imageUrl: string) {
  const { data: p } = await supabaseAdmin.from('products').select('images').eq('id', id).single()
  const current = (p?.images as string[]) ?? []
  await supabaseAdmin.from('products').update({
    images:     [...current, imageUrl],
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath(`/admin/productos/${id}`)
  revalidatePath('/')
}

export async function removeProductImageAction(id: number, imageUrl: string) {
  const { data: p } = await supabaseAdmin.from('products').select('images').eq('id', id).single()
  const current = (p?.images as string[]) ?? []
  await supabaseAdmin.from('products').update({
    images:     current.filter(img => img !== imageUrl),
    updated_at: new Date().toISOString(),
  }).eq('id', id)
  revalidatePath(`/admin/productos/${id}`)
  revalidatePath('/')
}
