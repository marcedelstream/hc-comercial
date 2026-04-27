import { staticHeaderSettings } from '@/data/staticData'
import { getHeaderSettingsFromDB } from '@/lib/storefront-data'

const useDB = !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY'

export const getHeaderSettings = async () => {
  if (!useDB) return staticHeaderSettings
  return getHeaderSettingsFromDB()
}
