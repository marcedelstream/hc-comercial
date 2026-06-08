import { MetadataRoute } from 'next'
import { getAllProducts } from '@/get-api-data/product'
import { getCategories } from '@/get-api-data/category'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hc-comercial.vercel.app'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // regenerar cada 1 hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ])

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/ofertas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Páginas de categoría
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/shop?category=${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Páginas de producto individuales
  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => p.quantity > 0) // solo productos con stock
    .map((p) => ({
      url: `${SITE_URL}/${p.category.slug}/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...categoryPages, ...productPages]
}
