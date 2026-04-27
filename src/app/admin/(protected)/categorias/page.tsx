import { supabaseAdmin } from '@/lib/supabase-admin'
import { addCategoryAction, deleteCategoryAction } from './actions'

export default async function CategoriasPage() {
  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabaseAdmin.from('categories').select('id, name, slug, active').order('name'),
    supabaseAdmin.from('products').select('category_id').not('category_id', 'is', null),
  ])

  const countMap = new Map<number, number>()
  for (const p of prods ?? []) {
    if (p.category_id) countMap.set(p.category_id, (countMap.get(p.category_id) ?? 0) + 1)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark">Categorías</h1>
        <p className="text-sm text-dark-3 mt-1">
          Se crean automáticamente al sincronizar con AsCont. Podés agregar o eliminar las que no tienen productos asignados.
        </p>
      </div>

      {/* Agregar */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 mb-6">
        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wide mb-4">Agregar categoría</p>
        <form action={addCategoryAction} className="flex gap-3">
          <input
            name="name"
            required
            placeholder="Nombre de la categoría"
            className="flex-1 border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors"
          />
          <button
            type="submit"
            className="bg-blue text-dark text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-dark ease-out duration-200"
          >
            Agregar
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        {!cats || cats.length === 0 ? (
          <div className="px-6 py-12 text-center text-dark-3 text-sm">
            Sin categorías. Sincronizá con AsCont o agregá una manualmente.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-1 text-dark-3 text-xs font-semibold uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Nombre</th>
                <th className="px-5 py-3 text-left">Slug</th>
                <th className="px-5 py-3 text-center">Productos</th>
                <th className="px-5 py-3 text-center">Estado</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => {
                const count = countMap.get(cat.id) ?? 0
                return (
                  <tr key={cat.id} className="border-t border-gray-3 hover:bg-gray-1 transition-colors">
                    <td className="px-5 py-3 font-medium text-dark">{cat.name}</td>
                    <td className="px-5 py-3 text-dark-4 font-mono text-xs">{cat.slug}</td>
                    <td className="px-5 py-3 text-center text-dark">{count}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cat.active ? 'bg-green/10 text-green' : 'bg-gray-3 text-dark-3'
                      }`}>
                        {cat.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {count === 0 ? (
                        <form action={deleteCategoryAction.bind(null, cat.id)}>
                          <button type="submit" className="text-xs text-red hover:underline font-medium">
                            Eliminar
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-dark-4">En uso</span>
                      )}
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
