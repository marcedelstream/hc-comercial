'use client'

import { useState } from 'react'
import { runSyncAction } from './actions'
import { useRouter } from 'next/navigation'

interface SyncResult {
  ok: boolean
  categories?: number
  products?: number
  error?: string
}

export default function SyncButton() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const router = useRouter()

  async function handleSync() {
    setLoading(true)
    setResult(null)
    try {
      const data = await runSyncAction()
      setResult(data)
      if (data.ok) router.refresh()
    } catch {
      setResult({ ok: false, error: 'Error inesperado al ejecutar la sincronización.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-1 border border-gray-3 p-6">
        <h2 className="font-semibold text-dark mb-1">Sincronización manual</h2>
        <p className="text-sm text-dark-3 mb-5">
          Conecta con <span className="font-mono text-xs bg-gray-1 px-1.5 py-0.5 rounded border border-gray-3">AsCont</span> en
          tiempo real y actualiza nombres, stock y categorías de todos los productos.
          Los precios deben cargarse manualmente desde cada producto.
        </p>
        <button
          onClick={handleSync}
          disabled={loading}
          className="flex items-center gap-2 bg-blue text-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-dark disabled:opacity-50 ease-out duration-200"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Sincronizando con AsCont...' : 'Sincronizar ahora'}
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-xl border text-sm ${
          result.ok ? 'bg-green/5 border-green/20 text-dark' : 'bg-red/5 border-red/20'
        }`}>
          {result.ok ? (
            <div>
              <p className="font-semibold text-green mb-2">✓ Sincronización completada</p>
              <ul className="space-y-1 text-dark-3">
                <li>Categorías actualizadas: <strong className="text-dark">{result.categories}</strong></li>
                <li>Productos actualizados: <strong className="text-dark">{result.products}</strong></li>
              </ul>
            </div>
          ) : (
            <p className="text-red font-medium">Error: {result.error}</p>
          )}
        </div>
      )}
    </div>
  )
}
