import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { customer, items, shippingDept, shippingCost, subtotal, total, paymentMethod } = body

  if (!customer?.nombre || !items?.length) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }

  // Generar order_number: HC-2026-XXXX
  const year = new Date().getFullYear()
  const { count } = await supabaseAdmin
    .from('orders')
    .select('id', { count: 'exact', head: true })
  const seq = String((count ?? 0) + 1).padStart(4, '0')
  const orderNumber = `HC-${year}-${seq}`

  // Insertar orden
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number:     orderNumber,
      customer_name:    `${customer.nombre} ${customer.apellido}`.trim(),
      customer_email:   customer.email,
      customer_phone:   customer.telefono,
      shipping_dept:    shippingDept,
      shipping_address: { ciudad: customer.ciudad, direccion: customer.direccion },
      subtotal:         subtotal,
      shipping_cost:    shippingCost,
      total:            total,
      status:           'pending',
      payment_method:   paymentMethod ?? 'efectivo',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'Error al crear la orden' }, { status: 500 })
  }

  // Insertar items
  const orderItems = items.map((item: { id: string | number; name?: string; title?: string; price: number; quantity: number }) => ({
    order_id:     order.id,
    product_id:   typeof item.id === 'string' && item.id.startsWith('prod-') ? null : Number(item.id) || null,
    product_name: item.name ?? item.title ?? 'Producto',
    quantity:     item.quantity,
    unit_price:   item.price,
    total:        item.price * item.quantity,
  }))

  await supabaseAdmin.from('order_items').insert(orderItems)

  return NextResponse.json({ ok: true, orderId: order.id, orderNumber })
}
