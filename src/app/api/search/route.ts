import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-admin'
import { staticProducts, staticCategories } from '@/data/staticData'

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ products: [], categories: [] })

  if (!useDB) {
    const products = staticProducts
      .filter((p) => p.quantity > 0 &&
        (p.title.toLowerCase().includes(q.toLowerCase()) ||
         p.sku.toLowerCase().includes(q.toLowerCase()) ||
         p.category.title.toLowerCase().includes(q.toLowerCase())))
      .slice(0, 6)
      .map((p) => ({
        id: p.id, title: p.title, slug: p.slug,
        categorySlug: p.category.slug,
        price: p.discountedPrice ?? p.price,
        category: p.category.title,
        sku: p.sku,
      }))
    const categories = staticCategories
      .filter((c) => c.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 3)
      .map((c) => ({ id: c.id, title: c.title, slug: c.slug }))
    return NextResponse.json({ products, categories })
  }

  const [{ data: prods }, { data: cats }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, slug, price, sale_price, ascont_barcode, categories(name, slug)')
      .eq('active', true)
      .gt('stock', 0)
      .or(`name.ilike.%${q}%,ascont_barcode.ilike.%${q}%`)
      .limit(6),
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('active', true)
      .ilike('name', `%${q}%`)
      .limit(3),
  ])

  const products = (prods ?? []).map((p) => {
    const cat = p.categories as unknown as { name: string; slug: string } | null
    return {
      id: String(p.id),
      title: p.name,
      slug: p.slug,
      categorySlug: cat?.slug ?? '',
      price: p.sale_price ?? p.price ?? 0,
      category: cat?.name ?? '',
      sku: p.ascont_barcode ?? '',
    }
  })

  const categories = (cats ?? []).map((c) => ({
    id: c.id, title: c.name, slug: c.slug,
  }))

  return NextResponse.json({ products, categories })
}
