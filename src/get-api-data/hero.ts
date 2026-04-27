import { staticHeroBanners, staticHeroSliders } from '@/data/staticData'
import { getHeroBannersFromDB, getHeroSlidersFromDB } from '@/lib/storefront-data'

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

export const getHeroBanners = async () => {
  if (!useDB) return staticHeroBanners
  const banners = await getHeroBannersFromDB()
  return banners.length > 0 ? banners : staticHeroBanners
}

export const getHeroSliders = async () => {
  if (!useDB) return staticHeroSliders
  const sliders = await getHeroSlidersFromDB()
  return sliders.length > 0 ? sliders : staticHeroSliders
}

export const getSingleHeroBanner = async (id: number) => {
  const banners = await getHeroBanners()
  return banners.find((b) => b.id === id) ?? null
}
