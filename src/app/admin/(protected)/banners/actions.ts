'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function addBannerAction(formData: FormData) {
  const productSlug = (formData.get('product_slug') as string) || null
  const rawLink = (formData.get('link_url') as string) || null

  let link_url = rawLink
  if (!link_url && productSlug) {
    const { data: prod } = await supabaseAdmin
      .from('products')
      .select('slug, categories(slug)')
      .eq('slug', productSlug)
      .single()
    const catSlug = (prod?.categories as unknown as { slug: string } | null)?.slug
    link_url = catSlug ? `/${catSlug}/${productSlug}` : `/products/${productSlug}`
  }

  await supabaseAdmin.from('banners').insert({
    title:       formData.get('title') as string,
    subtitle:    (formData.get('subtitle') as string) || null,
    image_url:   formData.get('image_url') as string,
    link_url,
    type:        (formData.get('type') as string) || 'slider',
    order_index: parseInt(formData.get('order_index') as string) || 0,
    active:      true,
  })
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function toggleBannerAction(id: number, active: boolean) {
  await supabaseAdmin.from('banners').update({ active }).eq('id', id)
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function deleteBannerAction(id: number) {
  await supabaseAdmin.from('banners').delete().eq('id', id)
  revalidatePath('/admin/banners')
  revalidatePath('/')
}

export async function saveCountdownAction(formData: FormData) {
  const settings = [
    { key: 'countdown_title',        value: formData.get('countdown_title')        as string },
    { key: 'countdown_subtitle',     value: formData.get('countdown_subtitle')     as string },
    { key: 'countdown_end_date',     value: formData.get('countdown_end_date')     as string },
    { key: 'countdown_product_slug', value: formData.get('countdown_product_slug') as string },
  ]
  for (const s of settings) {
    await supabaseAdmin
      .from('site_settings')
      .upsert({ key: s.key, value: s.value }, { onConflict: 'key' })
  }
  revalidatePath('/admin/banners')
  revalidatePath('/')
}
