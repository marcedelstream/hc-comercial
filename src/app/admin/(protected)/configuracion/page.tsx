import { supabaseAdmin } from '@/lib/supabase-admin'
import ConfigForm from './ConfigForm'

async function getSettings() {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    map[row.key] = typeof row.value === 'string'
      ? row.value.replace(/^"|"$/g, '')
      : String(row.value)
  }
  return map
}

export default async function ConfiguracionPage() {
  const settings = await getSettings()

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Configuración del sitio</h1>
      <ConfigForm settings={settings} />
    </div>
  )
}
