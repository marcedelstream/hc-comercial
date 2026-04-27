import { staticProducts } from '@/data/staticData'
import {
  getAllProductsFromDB,
  getProductBySlugFromDB,
  getProductByIdFromDB,
  getFeaturedProductsFromDB,
  getRelatedProductsFromDB,
  getProductsPaginatedFromDB,
  getProductsOnSaleFromDB,
} from '@/lib/storefront-data'

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

export const getProductsIdAndTitle = async () => {
  if (!useDB) return staticProducts.map((p) => ({ id: p.id, title: p.title }))
  const products = await getAllProductsFromDB()
  return products.map((p) => ({ id: p.id, title: p.title }))
}

export const getNewArrivalsProduct = async () => {
  if (!useDB) return staticProducts.slice(0, 8)
  const products = await getAllProductsFromDB()
  return products.slice(0, 8)
}

export const getBestSellingProducts = async () => {
  if (!useDB) return [...staticProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 6)
  return getFeaturedProductsFromDB(6)
}

export const getProductsPaginated = async (opts: {
  page: number
  limit?: number
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}): Promise<{ products: typeof staticProducts; total: number }> => {
  const { page, limit = 12, category, minPrice, maxPrice, search } = opts
  if (!useDB) {
    let filtered = [...staticProducts].filter((p) => p.quantity > 0)
    if (category) filtered = filtered.filter((p) => p.category.slug === category)
    if (minPrice !== undefined) filtered = filtered.filter((p) => (p.discountedPrice ?? p.price) >= minPrice)
    if (maxPrice !== undefined) filtered = filtered.filter((p) => (p.discountedPrice ?? p.price) <= maxPrice)
    if (search) filtered = filtered.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    const offset = (page - 1) * limit
    return { products: filtered.slice(offset, offset + limit), total: filtered.length }
  }
  return getProductsPaginatedFromDB({ page, limit, categorySlug: category, minPrice, maxPrice, search })
}

export const getLatestProducts = async () => {
  if (!useDB) return staticProducts.slice(0, 3)
  const products = await getAllProductsFromDB()
  return products.slice(0, 3)
}

export const getAllProducts = async () => {
  if (!useDB) return staticProducts
  return getAllProductsFromDB()
}

export const getProductBySlug = async (slug: string) => {
  if (!useDB) return staticProducts.find((p) => p.slug === slug) ?? null
  return getProductBySlugFromDB(slug)
}

export const getProductById = async (productId: string) => {
  if (!useDB) return staticProducts.find((p) => p.id === productId) ?? null
  return getProductByIdFromDB(productId)
}

export const getProductsOnSale = async () => {
  if (!useDB) return staticProducts.filter((p) => p.discountedPrice !== null)
  return getProductsOnSaleFromDB()
}

export const getRelatedProducts = async (
  category: string,
  tags: string[] | undefined,
  currentProductId: string,
  _productTitle: string
) => {
  if (!useDB) {
    return staticProducts
      .filter((p) => p.id !== currentProductId)
      .filter(
        (p) =>
          p.category.title.toLowerCase().includes(category.toLowerCase()) ||
          (tags && p.tags.some((t) => tags.includes(t)))
      )
      .slice(0, 8)
  }
  return getRelatedProductsFromDB(category, tags ?? [], currentProductId)
}
