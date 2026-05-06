import { supabaseAdmin } from '@/lib/supabase-admin'
import SyncButton from './SyncButton'

async function getLastSync() {
  const { data } = await supabaseAdmin
    .from('sync_logs')
    .select('status, records_updated, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data
}

export default async function SincronizarPage() {
  const last = await getLastSync()

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-dark mb-1">Sincronizar con AsCont</h1>
      <p className="text-sm text-dark-3 mb-7">
        Actualiza precios, stock y productos desde el sistema de gestión del cliente.
        Requiere que el Cloudflare Tunnel esté activo.
      </p>

      <SyncButton />

      <div className="mt-6">
        {last ? (
          <p className="text-sm text-dark-4">
            Última actualización:{' '}
            <span className="text-dark font-medium">
              {new Date(last.created_at).toLocaleString('es-PY')}
            </span>
            {last.status === 'error' && (
              <span className="ml-2 text-xs text-red">(con errores)</span>
            )}
          </p>
        ) : (
          <p className="text-sm text-dark-4">Aún no se han realizado sincronizaciones.</p>
        )}
      </div>
    </div>
  )
}
