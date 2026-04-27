import { staticCategories } from '@/data/staticData'
import { getCategoriesFromDB, getCategoryBySlugFromDB } from '@/lib/storefront-data'

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

export const getCategories = async () => {
  if (!useDB) return staticCategories
  return getCategoriesFromDB()
}

export const getCategoryBySlug = async (slug: string) => {
  if (!useDB) return staticCategories.find((c) => c.slug === slug) ?? null
  return getCategoryBySlugFromDB(slug)
}

export const getCategoryById = async (id: number) => {
  if (!useDB) return staticCategories.find((c) => c.id === id) ?? null
  const cats = await getCategoriesFromDB()
  return cats.find((c) => c.id === id) ?? null
}
