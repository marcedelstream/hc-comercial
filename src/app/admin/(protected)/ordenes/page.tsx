import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

const STATUS: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'Pendiente',  cls: 'bg-blue/20 text-dark' },
  confirmed: { label: 'Confirmado', cls: 'bg-green/10 text-green' },
  shipped:   { label: 'Enviado',    cls: 'bg-dark/10 text-dark-2' },
  delivered: { label: 'Entregado',  cls: 'bg-green/20 text-green' },
  cancelled: { label: 'Cancelado',  cls: 'bg-red/10 text-red' },
}

export default async function OrdenesPage() {
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('id, order_number, customer_name, customer_phone, shipping_dept, total, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-dark mb-1">Órdenes</h1>
      <p className="text-sm text-dark-3 mb-7">Pedidos recibidos a través del checkout.</p>

      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        {!orders || orders.length === 0 ? (
          <p className="px-6 py-8 text-sm text-dark-4">No hay órdenes registradas aún.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-1 text-dark-3 text-xs font-semibold uppercase">
              <tr>
                {['N° Orden', 'Cliente', 'Teléfono', 'Dpto.', 'Total', 'Estado', 'Fecha', ''].map(h => (
                  <th key={h} className={`px-5 py-3 ${h === 'Total' ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const st = STATUS[o.status] ?? { label: o.status, cls: 'bg-gray-1 text-dark-3' }
                return (
                  <tr key={o.id} className="border-t border-gray-3 hover:bg-gray-1 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-dark-2">{o.order_number}</td>
                    <td className="px-5 py-3 font-medium text-dark">{o.customer_name}</td>
                    <td className="px-5 py-3 text-dark-3">{o.customer_phone ?? '—'}</td>
                    <td className="px-5 py-3 text-dark-3">{o.shipping_dept ?? '—'}</td>
                    <td className="px-5 py-3 text-right font-semibold text-dark">
                      ₲ {Number(o.total).toLocaleString('es-PY')}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-dark-4">{new Date(o.created_at).toLocaleDateString('es-PY')}</td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/ordenes/${o.id}`} className="text-sm font-medium text-dark hover:text-blue ease-out duration-200">
                        Ver →
                      </Link>
                    </td>
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
