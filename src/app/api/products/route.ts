import { NextRequest, NextResponse } from 'next/server'
import { getProductsPaginated } from '@/get-api-data/product'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1') || 1)
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12') || 12))
  const category = searchParams.get('category') ?? undefined
  const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined
  const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined

  const { products, total } = await getProductsPaginated({ page, limit, category, minPrice, maxPrice })

  return NextResponse.json({
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
