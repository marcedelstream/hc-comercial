'use server'

import { supabaseAdmin } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function addTestimonioAction(formData: FormData) {
  await supabaseAdmin.from('testimonials').insert({
    customer_name: formData.get('customer_name') as string,
    rating:        parseInt(formData.get('rating') as string) || 5,
    comment:       formData.get('comment') as string,
    avatar_url:    (formData.get('avatar_url') as string) || null,
    active:        true,
  })
  revalidatePath('/admin/testimonios')
  revalidatePath('/')
}

export async function toggleTestimonioAction(id: number, active: boolean) {
  await supabaseAdmin.from('testimonials').update({ active }).eq('id', id)
  revalidatePath('/admin/testimonios')
  revalidatePath('/')
}

export async function deleteTestimonioAction(id: number) {
  await supabaseAdmin.from('testimonials').delete().eq('id', id)
  revalidatePath('/admin/testimonios')
  revalidatePath('/')
}
