import { supabaseAdmin } from '@/lib/supabase-admin'
import { addBannerAction, toggleBannerAction, deleteBannerAction, saveCountdownAction } from './actions'
import BannerImageUpload from './BannerImageUpload'
import Link from 'next/link'

async function getCountdownSettings() {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['countdown_title', 'countdown_subtitle', 'countdown_end_date', 'countdown_product_slug'])
  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    map[row.key] = typeof row.value === 'string' ? row.value.replace(/^"|"$/g, '') : String(row.value ?? '')
  }
  return map
}

export default async function BannersPage() {
  const [{ data: banners }, { data: products }, countdown] = await Promise.all([
    supabaseAdmin.from('banners').select('*').order('type').order('order_index'),
    supabaseAdmin.from('products').select('id, name, slug').eq('active', true).order('name'),
    getCountdownSettings(),
  ])

  const sliders      = (banners ?? []).filter((b) => b.type === 'slider')
  const heroBanners  = (banners ?? []).filter((b) => b.type === 'hero_banner')
  const promos       = (banners ?? []).filter((b) => b.type === 'banner')

  const BannerList = ({ items }: { items: typeof banners }) => (
    <ul className="divide-y divide-gray-3">
      {(items ?? []).map((b) => (
        <li key={b.id} className="px-5 py-3 flex items-start gap-4">
          {b.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.image_url} alt={b.title} className="w-14 h-14 rounded-lg object-cover border border-gray-3 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-dark text-sm">{b.title}</p>
            {b.subtitle && <p className="text-xs text-dark-4">{b.subtitle}</p>}
            {b.link_url && <p className="text-xs text-dark-4 font-mono mt-0.5">→ {b.link_url}</p>}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.active ? 'bg-green/10 text-green' : 'bg-gray-3 text-dark-3'}`}>
              {b.active ? 'Activo' : 'Inactivo'}
            </span>
            <form action={toggleBannerAction.bind(null, b.id, !b.active)}>
              <button type="submit" className="text-xs text-dark-3 hover:text-dark border border-gray-3 rounded-lg px-2.5 py-1 ease-out duration-200">
                {b.active ? 'Ocultar' : 'Mostrar'}
              </button>
            </form>
            <form action={deleteBannerAction.bind(null, b.id)}>
              <button type="submit" className="text-xs text-red border border-red/20 rounded-lg px-2.5 py-1 ease-out duration-200">
                Eliminar
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  )

  const AddBannerForm = ({ type }: { type: 'slider' | 'banner' | 'hero_banner' }) => (
    <form action={addBannerAction} className="space-y-4 pt-4 border-t border-gray-3 mt-4">
      <input type="hidden" name="type" value={type} />
      <div>
        <label className="block text-xs font-medium text-dark-3 mb-1">Vincular producto <span className="text-dark-4">(auto-completa título y link)</span></label>
        <select name="product_slug" className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-blue">
          <option value="">— Sin vincular —</option>
          {(products ?? []).map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-dark-3 mb-1">Título</label>
          <input name="title" required placeholder="Nombre del producto o banner" className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue" />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-3 mb-1">Subtítulo</label>
          <input name="subtitle" placeholder="Ej: Desde ₲ 1.650.000" className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue" />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-3 mb-1">URL de imagen</label>
          <input name="image_url" id={`${type}-image-url`} placeholder="https://..." className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue" />
        </div>
        <div>
          <label className="block text-xs font-medium text-dark-3 mb-1">Orden <span className="text-dark-4">(0 = primero)</span></label>
          <input name="order_index" type="number" defaultValue="0" min="0" className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-dark-3 mb-1">O subir imagen</label>
          <BannerImageUpload inputId={`${type}-image-url`} />
        </div>
      </div>
      <input type="hidden" name="link_url" value="" />
      <button type="submit" className="bg-blue text-dark text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-dark ease-out duration-200">
        Agregar
      </button>
    </form>
  )

  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-dark">Banners y Secciones</h1>
        <p className="text-sm text-dark-3 mt-1">Configurá el contenido visual de la página principal.</p>
      </div>

      {/* ── Hero Sliders ───────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Hero Slider</h2>
          <p className="text-xs text-dark-4 mt-0.5">Banner rotativo grande al inicio de la página. Recomendado: imágenes 1200×500px.</p>
        </div>
        {sliders.length > 0 ? <BannerList items={sliders} /> : (
          <p className="px-5 py-4 text-sm text-dark-4">Sin sliders. Agregá uno abajo.</p>
        )}
        <div className="px-5 pb-5">
          <AddBannerForm type="slider" />
        </div>
      </div>

      {/* ── Banners Laterales del Hero ───────────────────── */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Banners Laterales del Hero</h2>
          <p className="text-xs text-dark-4 mt-0.5">
            Los <strong>dos paneles pequeños de producto</strong> a la derecha del slider principal. Máx. 2 activos (orden 0 y 1).
          </p>
        </div>
        {heroBanners.length > 0 ? <BannerList items={heroBanners} /> : (
          <p className="px-5 py-4 text-sm text-dark-4">Sin banners laterales. Agregá uno abajo.</p>
        )}
        <div className="px-5 pb-5">
          <AddBannerForm type="hero_banner" />
        </div>
      </div>

      {/* ── Banners Promocionales ─────────────────────────── */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Banners Promocionales</h2>
          <p className="text-xs text-dark-4 mt-0.5">
            Sección separada debajo del hero. El primero (orden 0) es el <strong>banner grande oscuro</strong>. Los siguientes (orden 1 y 2) son los <strong>dos banners pequeños</strong>. Máx. 3 activos.
          </p>
        </div>
        {promos.length > 0 ? <BannerList items={promos} /> : (
          <p className="px-5 py-4 text-sm text-dark-4">Sin banners promo. Agregá uno abajo.</p>
        )}
        <div className="px-5 pb-5">
          <AddBannerForm type="banner" />
        </div>
      </div>

      {/* ── Más Vendidos ──────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-5">
        <h2 className="font-semibold text-dark mb-1">Más Vendidos ⭐</h2>
        <p className="text-sm text-dark-3 mb-4">
          La sección "Más Vendidos" muestra los productos marcados como <strong>Destacado: Sí ⭐</strong>. Para editarlos, entrá al producto y cambiá el campo "Destacado".
        </p>
        <Link
          href="/admin/productos?sort=featured&order=desc"
          className="inline-flex items-center gap-2 bg-blue text-dark text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-dark ease-out duration-200"
        >
          Ver productos destacados →
        </Link>
      </div>

      {/* ── Cuenta Regresiva ──────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-5">
        <h2 className="font-semibold text-dark mb-1">Oferta de Tiempo Ilimitado ⏳</h2>
        <p className="text-sm text-dark-3 mb-4">
          Configurá el texto y la fecha de vencimiento del contador de la home.
        </p>
        <form action={saveCountdownAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-3 mb-1">Título</label>
              <input
                name="countdown_title"
                defaultValue={countdown['countdown_title'] ?? ''}
                placeholder="Ej: OFERTA ESPECIAL"
                className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-3 mb-1">Subtítulo</label>
              <input
                name="countdown_subtitle"
                defaultValue={countdown['countdown_subtitle'] ?? ''}
                placeholder="Ej: ¡Aprovechá antes que termine!"
                className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-3 mb-1">Fecha de vencimiento</label>
              <input
                name="countdown_end_date"
                type="date"
                defaultValue={countdown['countdown_end_date'] ?? ''}
                className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-dark-3 mb-1">Producto asignado <span className="text-dark-4">(muestra nombre y enlaza al producto)</span></label>
              <select
                name="countdown_product_slug"
                defaultValue={countdown['countdown_product_slug'] ?? ''}
                className="w-full border border-gray-3 rounded-lg px-3 py-2 text-sm text-dark focus:outline-none focus:border-blue"
              >
                <option value="">— Sin producto —</option>
                {(products ?? []).map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="bg-blue text-dark text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-dark ease-out duration-200">
            Guardar configuración
          </button>
        </form>
      </div>
    </div>
  )
}
