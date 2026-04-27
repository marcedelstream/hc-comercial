import { supabase } from './supabase-admin'
import type { StaticProduct, StaticCategory, StaticHeroSlider, StaticHeroBanner } from '@/data/staticData'

// ── Mappers ───────────────────────────────────────────────────

function mapProduct(p: Record<string, unknown>): StaticProduct {
  const cat = p.categories as { name: string; slug: string } | null
  const images = (p.images as string[]) ?? []
  return {
    id:               String(p.id),
    title:            String(p.name ?? ''),
    shortDescription: String(p.short_description ?? ''),
    description:      String(p.description ?? ''),
    price:            Number(p.price ?? 0),
    discountedPrice:  p.sale_price ? Number(p.sale_price) : null,
    slug:             String(p.slug),
    quantity:         Number(p.stock ?? 0),
    updatedAt:        String(p.updated_at ?? ''),
    category: {
      title: cat?.name  ?? '',
      slug:  cat?.slug  ?? '',
    },
    productVariants: [{
      image:     images[0] ?? '',
      color:     '',
      size:      '',
      isDefault: true,
    }],
    reviews:              0,
    tags:                 (p.tags as string[]) ?? [],
    offers:               [],
    sku:                  String(p.ascont_barcode ?? p.id),
    additionalInformation: [],
  }
}

function mapCategory(c: Record<string, unknown>): StaticCategory {
  return {
    id:        Number(c.id),
    title:     String(c.name ?? ''),
    slug:      String(c.slug),
    img:       (c.image_url as string) ?? null,
    updatedAt: String(c.updated_at ?? ''),
  }
}

// ── Productos ─────────────────────────────────────────────────

export async function getAllProductsFromDB(): Promise<StaticProduct[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)
    .gt('stock', 0)
    .order('featured', { ascending: false })
  return (data ?? []).map(mapProduct)
}

export async function getProductBySlugFromDB(slug: string): Promise<StaticProduct | null> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  return data ? mapProduct(data) : null
}

export async function getProductByIdFromDB(id: string): Promise<StaticProduct | null> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('id', parseInt(id))
    .eq('active', true)
    .single()
  return data ? mapProduct(data) : null
}

export async function getProductsPaginatedFromDB(opts: {
  page: number
  limit: number
  categorySlug?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}): Promise<{ products: StaticProduct[]; total: number }> {
  const { page, limit, categorySlug, minPrice, maxPrice, search } = opts
  const offset = (page - 1) * limit

  let categoryId: number | null = null
  if (categorySlug) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single()
    if (!cat) return { products: [], total: 0 }
    categoryId = cat.id
  }

  let query = supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact' })
    .eq('active', true)
    .gt('stock', 0)

  if (categoryId !== null) query = query.eq('category_id', categoryId)
  if (minPrice !== undefined) query = query.gte('price', minPrice)
  if (maxPrice !== undefined) query = query.lte('price', maxPrice)
  if (search) query = query.ilike('name', `%${search}%`)

  const { data, count } = await query.order('name').range(offset, offset + limit - 1)
  return { products: (data ?? []).map(mapProduct), total: count ?? 0 }
}

export async function getFeaturedProductsFromDB(limit = 8): Promise<StaticProduct[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)
    .gt('stock', 0)
    .eq('featured', true)
    .limit(limit)
  return (data ?? []).map(mapProduct)
}

export async function getRelatedProductsFromDB(
  categorySlug: string,
  tags: string[],
  currentId: string,
  limit = 8
): Promise<StaticProduct[]> {
  const { data: catData } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single()

  if (!catData) return []

  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)
    .gt('stock', 0)
    .eq('category_id', catData.id)
    .neq('id', parseInt(currentId))
    .limit(limit)
  return (data ?? []).map(mapProduct)
}

// ── Categorías ────────────────────────────────────────────────

export async function getCategoriesFromDB(): Promise<StaticCategory[]> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('name')
  return (data ?? []).map(mapCategory)
}

export async function getCategoryBySlugFromDB(slug: string): Promise<StaticCategory | null> {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  return data ? mapCategory(data) : null
}

// ── Hero banners ──────────────────────────────────────────────

export async function getHeroSlidersFromDB(): Promise<StaticHeroSlider[]> {
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .eq('type', 'slider')
    .order('order_index')

  return (data ?? []).map((b, i) => ({
    id:           b.id ?? i + 1,
    discountRate: 0,
    sliderImage:  b.image_url ?? '',
    updatedAt:    b.updated_at ?? '',
    product: {
      price:            0,
      discountedPrice:  null,
      title:            b.title ?? '',
      slug:             b.link_url ?? '#',
      shortDescription: b.subtitle ?? '',
    },
  }))
}

export async function getHeroBannersFromDB(): Promise<StaticHeroBanner[]> {
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .eq('type', 'hero_banner')
    .order('order_index')

  return (data ?? []).map((b) => ({
    id:          b.id,
    bannerName:  b.title ?? '',
    subtitle:    b.subtitle ?? '',
    bannerImage: b.image_url ?? '',
    updatedAt:   b.updated_at ?? '',
    product: {
      price:           0,
      discountedPrice: null,
      title:           b.title ?? '',
      slug:            b.link_url ?? '#',
    },
  }))
}

export async function getPromoBannersFromDB(): Promise<StaticHeroBanner[]> {
  const { data } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .eq('type', 'banner')
    .order('order_index')

  return (data ?? []).map((b) => ({
    id:          b.id,
    bannerName:  b.title ?? '',
    subtitle:    b.subtitle ?? '',
    bannerImage: b.image_url ?? '',
    updatedAt:   b.updated_at ?? '',
    product: {
      price:           0,
      discountedPrice: null,
      title:           b.title ?? '',
      slug:            b.link_url ?? '#',
    },
  }))
}

export async function getProductsOnSaleFromDB(): Promise<StaticProduct[]> {
  const { data } = await supabase
    .from('products')
    .select('*, categories(name, slug)')
    .eq('active', true)
    .gt('stock', 0)
    .not('sale_price', 'is', null)
    .order('name')
  return (data ?? []).map(mapProduct)
}

// ── Header settings ───────────────────────────────────────────

export async function getHeaderSettingsFromDB() {
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['header_text', 'site_name'])

  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    map[row.key] = typeof row.value === 'string'
      ? row.value.replace(/^"|"$/g, '')
      : String(row.value)
  }

  return {
    id:          1,
    headerText:  map['header_text'] ?? 'Envíos a todo el Paraguay · WhatsApp: +595982800258',
    headerLogo:  null,
    emailLogo:   null,
  }
}
