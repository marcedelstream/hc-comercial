import { supabaseAdmin } from '@/lib/supabase-admin'

async function getStats() {
  const [products, categories, orders, lowStock] = await Promise.all([
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true }).eq('active', true),
    supabaseAdmin.from('categories').select('id', { count: 'exact', head: true }).eq('active', true),
    supabaseAdmin.from('orders').select('id', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().split('T')[0]),
    supabaseAdmin.from('products').select('id', { count: 'exact', head: true })
      .eq('active', true).lt('stock', 5),
  ])
  return {
    totalProducts:   products.count ?? 0,
    totalCategories: categories.count ?? 0,
    ordersToday:     orders.count ?? 0,
    lowStockCount:   lowStock.count ?? 0,
  }
}

async function getRecentOrders() {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, customer_name, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

async function getLastSync() {
  const { data } = await supabaseAdmin
    .from('sync_logs')
    .select('sync_type, status, records_updated, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  return data
}

const STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pendiente',  cls: 'bg-blue/20 text-dark' },
  confirmed: { label: 'Confirmado', cls: 'bg-green/10 text-green' },
  shipped:   { label: 'Enviado',    cls: 'bg-dark/10 text-dark-2' },
  delivered: { label: 'Entregado',  cls: 'bg-green/20 text-green' },
  cancelled: { label: 'Cancelado',  cls: 'bg-red/10 text-red' },
}

export default async function DashboardPage() {
  const [stats, recentOrders, lastSync] = await Promise.all([
    getStats(), getRecentOrders(), getLastSync(),
  ])

  const cards = [
    { label: 'Productos activos',   value: stats.totalProducts,   border: 'border-l-blue' },
    { label: 'Categorías',          value: stats.totalCategories, border: 'border-l-dark' },
    { label: 'Órdenes hoy',         value: stats.ordersToday,     border: 'border-l-green' },
    { label: 'Stock bajo (< 5 u.)', value: stats.lowStockCount,   border: 'border-l-red' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-dark mb-1">Dashboard</h1>
      <p className="text-sm text-dark-3 mb-7">Resumen general de HC Comercial</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, border }) => (
          <div key={label} className={`bg-white rounded-xl shadow-1 border border-gray-3 border-l-4 ${border} p-5`}>
            <p className="text-3xl font-bold text-dark">{value}</p>
            <p className="text-sm text-dark-3 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {lastSync && (
        <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-4 mb-6 flex items-center gap-3 text-sm">
          <span className={`w-2 h-2 rounded-full shrink-0 ${lastSync.status === 'success' ? 'bg-green' : 'bg-red'}`} />
          <span className="text-dark-3">Última sync AsCont:</span>
          <span className={`font-medium ${lastSync.status === 'success' ? 'text-green' : 'text-red'}`}>
            {lastSync.status === 'success' ? `${lastSync.records_updated} registros actualizados` : 'Error'}
          </span>
          <span className="text-dark-4 ml-auto">
            {new Date(lastSync.created_at).toLocaleString('es-PY')}
          </span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Órdenes recientes</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-dark-4">No hay órdenes aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-1 text-dark-3 text-xs font-semibold uppercase">
              <tr>
                {['N° Orden', 'Cliente', 'Total', 'Estado', 'Fecha'].map(h => (
                  <th key={h} className={`px-5 py-3 ${h === 'Total' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => {
                const st = STATUS[o.status] ?? { label: o.status, cls: 'bg-gray-1 text-dark-3' }
                return (
                  <tr key={o.id} className="border-t border-gray-3 hover:bg-gray-1 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-dark-2">{o.order_number}</td>
                    <td className="px-5 py-3 font-medium text-dark">{o.customer_name}</td>
                    <td className="px-5 py-3 text-right font-medium text-dark">₲ {Number(o.total).toLocaleString('es-PY')}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-5 py-3 text-dark-4">{new Date(o.created_at).toLocaleDateString('es-PY')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
