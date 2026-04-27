import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'

const LIMIT = 20
const VALID_SORTS = ['name', 'price', 'stock'] as const
type SortCol = typeof VALID_SORTS[number]

function sortUrl(col: string, currentSort: string, currentOrder: string, search: string, page: number) {
  const newOrder = currentSort === col && currentOrder === 'asc' ? 'desc' : 'asc'
  const p = new URLSearchParams({ sort: col, order: newOrder })
  if (search) p.set('search', search)
  if (page > 1) p.set('page', String(page))
  return `/admin/productos?${p.toString()}`
}

function SortArrow({ col, currentSort, currentOrder }: { col: string; currentSort: string; currentOrder: string }) {
  if (currentSort !== col) return <span className="text-dark-4 ml-1">↕</span>
  return <span className="ml-1">{currentOrder === 'asc' ? '↑' : '↓'}</span>
}

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; sort?: string; order?: string }>
}) {
  const params    = await searchParams
  const page      = Math.max(1, parseInt(params.page ?? '1') || 1)
  const search    = params.search?.trim() ?? ''
  const sort      = (VALID_SORTS.includes(params.sort as SortCol) ? params.sort : 'name') as SortCol
  const order     = params.order === 'desc' ? 'desc' : 'asc'
  const offset    = (page - 1) * LIMIT

  let query = supabaseAdmin
    .from('products')
    .select('id, name, slug, price, stock, active, featured, categories(name)', { count: 'exact' })
    .order(sort, { ascending: order === 'asc' })
    .range(offset, offset + LIMIT - 1)

  if (search) query = query.ilike('name', `%${search}%`)

  const { data: products, count } = await query
  const totalPages = Math.ceil((count ?? 0) / LIMIT)

  function pageUrl(p: number) {
    const qs = new URLSearchParams({ sort, order })
    if (p > 1) qs.set('page', String(p))
    if (search) qs.set('search', search)
    return `/admin/productos?${qs.toString()}`
  }

  const thClass = 'px-5 py-3 text-left cursor-pointer select-none hover:text-dark transition-colors'
  const thRightClass = 'px-5 py-3 text-right cursor-pointer select-none hover:text-dark transition-colors'

  return (
    <div className="p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-dark">Productos</h1>
          <p className="text-sm text-dark-3 mt-1">Sincronizados desde AsCont. Editá destacados, precios de oferta y visibilidad.</p>
        </div>
        <form method="GET" action="/admin/productos" className="flex gap-2">
          <input type="hidden" name="sort" value={sort} />
          <input type="hidden" name="order" value={order} />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Buscar producto..."
            className="border border-gray-3 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-blue w-52"
          />
          <button type="submit" className="px-4 py-2 bg-blue text-dark text-sm font-semibold rounded-lg hover:bg-blue-dark ease-out duration-200">
            Buscar
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        {!products || products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-medium text-dark mb-2">Sin productos cargados</p>
            <p className="text-sm text-dark-4 mb-5">Sincronizá con AsCont para importar el catálogo.</p>
            <Link href="/admin/sincronizar" className="inline-flex items-center bg-blue text-dark text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-dark ease-out duration-200">
              Ir a Sincronizar
            </Link>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead className="bg-gray-1 text-dark-3 text-xs font-semibold uppercase">
                <tr>
                  <th className={thClass}>
                    <Link href={sortUrl('name', sort, order, search, page)} className="flex items-center">
                      Nombre <SortArrow col="name" currentSort={sort} currentOrder={order} />
                    </Link>
                  </th>
                  <th className="px-5 py-3 text-left">Categoría</th>
                  <th className={thRightClass}>
                    <Link href={sortUrl('price', sort, order, search, page)} className="flex items-center justify-end">
                      Precio <SortArrow col="price" currentSort={sort} currentOrder={order} />
                    </Link>
                  </th>
                  <th className={thRightClass}>
                    <Link href={sortUrl('stock', sort, order, search, page)} className="flex items-center justify-end">
                      Stock <SortArrow col="stock" currentSort={sort} currentOrder={order} />
                    </Link>
                  </th>
                  <th className="px-5 py-3 text-center">Dest.</th>
                  <th className="px-5 py-3 text-left">Estado</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-3 hover:bg-gray-1 transition-colors">
                    <td className="px-5 py-3 font-medium text-dark max-w-xs truncate">{p.name}</td>
                    <td className="px-5 py-3 text-dark-3">
                      {(p.categories as unknown as { name: string } | null)?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 text-right text-dark">
                      {p.price ? `₲ ${Number(p.price).toLocaleString('es-PY')}` : '—'}
                    </td>
                    <td className={`px-5 py-3 text-right font-semibold ${(p.stock ?? 0) < 5 ? 'text-red' : 'text-dark'}`}>
                      {p.stock ?? 0}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {p.featured ? '⭐' : <span className="text-dark-4">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.active ? 'bg-green/10 text-green' : 'bg-gray-3 text-dark-3'
                      }`}>
                        {p.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/productos/${p.id}`} className="text-sm font-medium text-dark hover:text-blue ease-out duration-200">
                        Editar →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-3 bg-gray-1">
                <Link
                  href={page > 1 ? pageUrl(page - 1) : '#'}
                  aria-disabled={page <= 1}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    page <= 1 ? 'border-gray-3 text-gray-4 pointer-events-none' : 'border-gray-3 text-dark hover:border-blue hover:text-blue'
                  }`}
                >
                  ← Anterior
                </Link>
                <span className="text-sm text-dark-3">
                  Página <strong className="text-dark">{page}</strong> de <strong className="text-dark">{totalPages}</strong>
                  {count !== null && <span> · {count} productos</span>}
                </span>
                <Link
                  href={page < totalPages ? pageUrl(page + 1) : '#'}
                  aria-disabled={page >= totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    page >= totalPages ? 'border-gray-3 text-gray-4 pointer-events-none' : 'border-gray-3 text-dark hover:border-blue hover:text-blue'
                  }`}
                >
                  Siguiente →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
