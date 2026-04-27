import { supabaseAdmin } from '@/lib/supabase-admin'
import SyncButton from './SyncButton'

async function getSyncLogs() {
  const { data } = await supabaseAdmin
    .from('sync_logs')
    .select('id, sync_type, status, records_updated, error_message, created_at')
    .order('created_at', { ascending: false })
    .limit(20)
  return data ?? []
}

export default async function SincronizarPage() {
  const logs = await getSyncLogs()

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-dark mb-1">Sincronizar con AsCont</h1>
      <p className="text-sm text-dark-3 mb-7">
        Actualiza precios, stock y productos desde el sistema de gestión del cliente.
        Requiere que el Cloudflare Tunnel esté activo.
      </p>

      <SyncButton />

      <div className="mt-8 bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Historial de sincronizaciones</h2>
        </div>
        {logs.length === 0 ? (
          <p className="px-6 py-8 text-sm text-dark-4">Aún no se han realizado sincronizaciones.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-1 text-dark-3 text-xs font-semibold uppercase">
              <tr>
                {['Fecha', 'Tipo', 'Estado', 'Registros', 'Error'].map(h => (
                  <th key={h} className={`px-5 py-3 ${h === 'Registros' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-gray-3">
                  <td className="px-5 py-3 text-dark-4 text-xs">{new Date(l.created_at).toLocaleString('es-PY')}</td>
                  <td className="px-5 py-3 text-dark">{l.sync_type}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      l.status === 'success' ? 'bg-green/10 text-green' : 'bg-red/10 text-red'
                    }`}>
                      {l.status === 'success' ? 'OK' : 'Error'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-dark">{l.records_updated ?? '—'}</td>
                  <td className="px-5 py-3 text-red text-xs max-w-xs truncate">{l.error_message ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
