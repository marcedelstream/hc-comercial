import { staticCountdown } from "@/data/staticData";
import { supabaseAdmin } from "@/lib/supabase-admin";

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

export const getCountdowns = async () => {
  if (!useDB) return [staticCountdown];

  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['countdown_title', 'countdown_subtitle', 'countdown_end_date', 'countdown_product_slug'])

  if (!data || data.length === 0) return [staticCountdown];

  const map: Record<string, string> = {}
  for (const row of data) {
    map[row.key] = typeof row.value === 'string'
      ? row.value.replace(/^"|"$/g, '')
      : String(row.value ?? '')
  }

  let productTitle: string | undefined
  let productHref: string | undefined

  const productSlug = map['countdown_product_slug']
  if (productSlug) {
    const { data: prod } = await supabaseAdmin
      .from('products')
      .select('name, slug, categories(slug)')
      .eq('slug', productSlug)
      .eq('active', true)
      .single()

    if (prod) {
      productTitle = prod.name
      const catSlug = (prod.categories as unknown as { slug: string } | null)?.slug
      productHref = catSlug ? `/${catSlug}/${prod.slug}` : `/products/${prod.slug}`
    }
  }

  return [{
    ...staticCountdown,
    title:    map['countdown_title']    || staticCountdown.title,
    subtitle: map['countdown_subtitle'] || staticCountdown.subtitle,
    endDate:  map['countdown_end_date'] || undefined,
    product:  productTitle
      ? { ...staticCountdown.product, title: productTitle, href: productHref }
      : staticCountdown.product,
  }];
};
