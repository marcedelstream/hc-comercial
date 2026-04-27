import { supabaseAdmin } from '@/lib/supabase-admin'
import SeedButton from './SeedButton'
import CleanButton from './CleanButton'

async function getCounts() {
  const [p, c] = await Promise.all([
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }),
  ])
  return { products: p.count ?? 0, categories: c.count ?? 0 }
}

export default async function SeedPage() {
  const counts = await getCounts()

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-bold text-dark mb-1">Datos de prueba</h1>
      <p className="text-sm text-dark-3 mb-7">
        Carga los 12 productos y 6 categorías demo en Supabase. Idempotente: podés ejecutarlo varias veces sin duplicar.
      </p>

      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 mb-6">
        <p className="text-sm text-dark-3 mb-1">Estado actual de la base de datos:</p>
        <div className="flex gap-6 mt-2">
          <div>
            <p className="text-3xl font-bold text-dark">{counts.categories}</p>
            <p className="text-sm text-dark-4">Categorías</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-dark">{counts.products}</p>
            <p className="text-sm text-dark-4">Productos</p>
          </div>
        </div>
      </div>

      <SeedButton secretKey={process.env.SYNC_SECRET_KEY ?? ''} />

      <p className="text-xs text-dark-4 mt-4">
        Una vez que tengas los datos reales de AsCont, estos datos de prueba se sobreescribirán en la próxima sincronización.
      </p>

      <div className="mt-8 bg-red/5 border border-red/20 rounded-xl p-6">
        <p className="text-sm font-semibold text-dark mb-1">Zona peligrosa</p>
        <p className="text-sm text-dark-3 mb-4">
          Elimina <strong>todos</strong> los productos y categorías de la base de datos. Usá esto para limpiar datos de prueba antes de sincronizar con AsCont.
        </p>
        <CleanButton />
      </div>
    </div>
  )
}
