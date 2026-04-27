import { supabaseAdmin } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import { updateProductAction } from './actions'
import ProductImageUpload from './ProductImageUpload'
import Link from 'next/link'

export default async function ProductoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: p }, { data: allCats }] = await Promise.all([
    supabaseAdmin.from('products').select('*, categories(id, name)').eq('id', parseInt(id)).single(),
    supabaseAdmin.from('categories').select('id, name').eq('active', true).order('name'),
  ])

  if (!p) notFound()

  const cat = p.categories as unknown as { id: number; name: string } | null
  const images = (p.images as string[]) ?? []
  const currentImage = images[0] ?? ''

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/productos" className="text-sm text-dark-3 hover:text-dark ease-out duration-200">
          ← Productos
        </Link>
        <span className="text-dark-4">/</span>
        <h1 className="text-lg font-bold text-dark truncate">{p.name}</h1>
      </div>

      {/* Foto del producto */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 mb-6">
        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wide mb-4">Foto del producto</p>
        <ProductImageUpload productId={p.id} currentImage={currentImage} />
      </div>

      {/* Datos de AsCont (solo lectura) */}
      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5 mb-6">
        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wide mb-3">Datos de AsCont (solo lectura)</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {[
            ['Categoría', cat?.name ?? '—'],
            ['SKU', p.ascont_barcode ?? '—'],
            ['Precio AsCont', p.price ? `₲ ${Number(p.price).toLocaleString('es-PY')}` : '—'],
            ['Stock', String(p.stock ?? 0)],
            ['ID AsCont', String(p.ascont_prs_ide ?? '—')],
            ['Slug', p.slug],
          ].map(([label, value]) => (
            <div key={label}>
              <span className="text-dark-4">{label}: </span>
              <span className="font-medium text-dark">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Campos editables */}
      <form action={updateProductAction.bind(null, p.id)} className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 space-y-5">
        <p className="text-xs font-semibold text-dark-4 uppercase tracking-wide">Campos editables por admin</p>

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Categoría</label>
          <select name="category_id" defaultValue={String(cat?.id ?? '')}
            className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors">
            <option value="">— Sin categoría —</option>
            {(allCats ?? []).map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Estado</label>
            <select name="active" defaultValue={String(p.active ?? true)}
              className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors">
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Destacado</label>
            <select name="featured" defaultValue={String(p.featured ?? false)}
              className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors">
              <option value="false">No</option>
              <option value="true">Sí ⭐</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Precio de oferta <span className="text-dark-4">(dejar vacío si no hay)</span>
          </label>
          <input name="sale_price" type="number" step="1" min="0"
            defaultValue={p.sale_price ? String(p.sale_price) : ''}
            placeholder="Ej: 1450000"
            className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Descripción corta</label>
          <textarea name="short_description" rows={2}
            defaultValue={p.short_description ?? ''}
            className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Descripción completa <span className="text-dark-4">(HTML permitido)</span>
          </label>
          <textarea name="description" rows={5}
            defaultValue={p.description ?? ''}
            className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors font-mono text-xs" />
        </div>

        <button type="submit"
          className="bg-blue text-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-dark ease-out duration-200">
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
