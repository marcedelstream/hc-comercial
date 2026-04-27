import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import { updateOrderStatusAction } from './actions'
import Link from 'next/link'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', shipped: 'Enviado',
  delivered: 'Entregado', cancelled: 'Cancelado',
}

export default async function OrdenDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', parseInt(id))
    .single()

  if (!order) notFound()

  const items = (order.order_items ?? []) as Array<{
    id: number; product_name: string; quantity: number; unit_price: number; total: number
  }>

  const whatsappText = encodeURIComponent(
    `Hola ${order.customer_name}! Te contactamos por tu pedido ${order.order_number}. ¿Cómo podemos ayudarte?`
  )

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/ordenes" className="text-sm text-dark-3 hover:text-dark ease-out duration-200">
          ← Órdenes
        </Link>
        <span className="text-dark-4">/</span>
        <h1 className="text-lg font-bold text-dark font-mono">{order.order_number}</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Datos del cliente */}
        <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-5">
          <p className="text-xs font-semibold text-dark-4 uppercase tracking-wide mb-3">Cliente</p>
          <div className="space-y-1.5 text-sm">
            <p><span className="text-dark-4">Nombre: </span><strong className="text-dark">{order.customer_name}</strong></p>
            <p><span className="text-dark-4">Email: </span><span className="text-dark">{order.customer_email}</span></p>
            <p><span className="text-dark-4">Teléfono: </span><span className="text-dark">{order.customer_phone ?? '—'}</span></p>
          </div>
        </div>

        {/* Envío */}
        <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-5">
          <p className="text-xs font-semibold text-dark-4 uppercase tracking-wide mb-3">Envío</p>
          <div className="space-y-1.5 text-sm">
            <p><span className="text-dark-4">Departamento: </span><strong className="text-dark">{order.shipping_dept ?? '—'}</strong></p>
            <p><span className="text-dark-4">Ciudad: </span><span className="text-dark">{(order.shipping_address as Record<string,string>)?.ciudad ?? '—'}</span></p>
            <p><span className="text-dark-4">Dirección: </span><span className="text-dark">{(order.shipping_address as Record<string,string>)?.direccion ?? '—'}</span></p>
            <p><span className="text-dark-4">Costo envío: </span><span className="text-dark">₲ {Number(order.shipping_cost ?? 0).toLocaleString('es-PY')}</span></p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Productos ({items.length})</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-1 text-dark-3 text-xs font-semibold uppercase">
            <tr>
              <th className="text-left px-5 py-3">Producto</th>
              <th className="text-right px-5 py-3">Cant.</th>
              <th className="text-right px-5 py-3">P. Unit.</th>
              <th className="text-right px-5 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-3">
                <td className="px-5 py-3 font-medium text-dark">{item.product_name}</td>
                <td className="px-5 py-3 text-right text-dark">{item.quantity}</td>
                <td className="px-5 py-3 text-right text-dark">₲ {Number(item.unit_price).toLocaleString('es-PY')}</td>
                <td className="px-5 py-3 text-right font-semibold text-dark">₲ {Number(item.total).toLocaleString('es-PY')}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-gray-3 bg-gray-1">
              <td colSpan={3} className="px-5 py-3 text-right font-semibold text-dark">Total</td>
              <td className="px-5 py-3 text-right font-bold text-dark text-base">₲ {Number(order.total).toLocaleString('es-PY')}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Estado + acciones */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <form action={updateOrderStatusAction.bind(null, order.id)} className="flex items-center gap-3">
          <label className="text-sm font-medium text-dark">Estado:</label>
          <select name="status" defaultValue={order.status}
            className="border border-gray-3 rounded-lg px-4 py-2 text-sm text-dark focus:outline-none focus:border-blue transition-colors">
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button type="submit"
            className="bg-blue text-dark font-semibold px-4 py-2 rounded-lg hover:bg-blue-dark ease-out duration-200 text-sm">
            Actualizar
          </button>
        </form>

        {order.customer_phone && (
          <a
            href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${whatsappText}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-dark hover:bg-dark-2 px-4 py-2 rounded-lg ease-out duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp al cliente
          </a>
        )}
      </div>
    </div>
  )
}
