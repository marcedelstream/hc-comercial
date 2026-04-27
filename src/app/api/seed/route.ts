import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { staticCategories, staticProducts } from '@/data/staticData'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  if (auth !== `Bearer ${process.env.SYNC_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Upsert categorías
  const catRows = staticCategories.map((c) => ({
    name:       c.title,
    slug:       c.slug,
    active:     true,
    updated_at: new Date().toISOString(),
  }))
  const { error: catErr } = await supabaseAdmin
    .from('categories')
    .upsert(catRows, { onConflict: 'slug' })
  if (catErr) return NextResponse.json({ error: catErr.message }, { status: 500 })

  // Traer categorías para mapear slug → id
  const { data: cats } = await supabaseAdmin.from('categories').select('id, slug')
  const catMap = new Map(cats?.map((c) => [c.slug, c.id]) ?? [])

  // Upsert productos
  const prodRows = staticProducts.map((p) => ({
    name:              p.title,
    slug:              p.slug,
    description:       p.description,
    short_description: p.shortDescription,
    price:             p.price,
    sale_price:        p.discountedPrice ?? null,
    stock:             p.quantity,
    images:            JSON.stringify([]),
    tags:              p.tags,
    iva_percentage:    10,
    has_iva:           true,
    active:            true,
    featured:          false,
    ascont_barcode:    p.sku,
    category_id:       catMap.get(p.category.slug) ?? null,
    updated_at:        new Date().toISOString(),
  }))
  const { error: prodErr } = await supabaseAdmin
    .from('products')
    .upsert(prodRows, { onConflict: 'slug' })
  if (prodErr) return NextResponse.json({ error: prodErr.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    categories: catRows.length,
    products:   prodRows.length,
  })
}
