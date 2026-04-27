import { supabaseAdmin } from '@/lib/supabase-admin'
import { addTestimonioAction, toggleTestimonioAction, deleteTestimonioAction } from './actions'

export default async function TestimoniosPage() {
  const { data: testimonios } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-dark mb-1">Testimonios</h1>
      <p className="text-sm text-dark-3 mb-7">Administrá los testimonios que aparecen en la página principal.</p>

      {/* Formulario agregar */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 mb-8">
        <h2 className="font-semibold text-dark mb-5">Agregar testimonio</h2>
        <form action={addTestimonioAction} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Nombre del cliente</label>
              <input name="customer_name" required placeholder="Ej: Carlos Benítez"
                className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">Calificación (1-5)</label>
              <select name="rating" defaultValue="5"
                className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors">
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Comentario</label>
            <textarea name="comment" required rows={3} placeholder="Texto del testimonio..."
              className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">URL de avatar <span className="text-dark-4">(opcional)</span></label>
            <input name="avatar_url" placeholder="https://..."
              className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors" />
          </div>
          <button type="submit"
            className="bg-blue text-dark font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-dark ease-out duration-200">
            Agregar testimonio
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-3">
          <h2 className="font-semibold text-dark">Testimonios ({testimonios?.length ?? 0})</h2>
        </div>
        {!testimonios?.length ? (
          <p className="px-6 py-8 text-sm text-dark-4">No hay testimonios aún.</p>
        ) : (
          <ul className="divide-y divide-gray-3">
            {testimonios.map((t) => (
              <li key={t.id} className="px-6 py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-dark text-sm">{t.customer_name}</span>
                    <span className="text-xs text-dark-4">{'⭐'.repeat(t.rating ?? 5)}</span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.active ? 'bg-green/10 text-green' : 'bg-gray-3 text-dark-3'
                    }`}>
                      {t.active ? 'Visible' : 'Oculto'}
                    </span>
                  </div>
                  <p className="text-sm text-dark-3 line-clamp-2">{t.comment}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <form action={toggleTestimonioAction.bind(null, t.id, !t.active)}>
                    <button type="submit" className="text-xs text-dark-3 hover:text-dark border border-gray-3 rounded-lg px-3 py-1.5 ease-out duration-200">
                      {t.active ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </form>
                  <form action={deleteTestimonioAction.bind(null, t.id)}>
                    <button type="submit" className="text-xs text-red hover:text-red/70 border border-red/20 rounded-lg px-3 py-1.5 ease-out duration-200">
                      Eliminar
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
