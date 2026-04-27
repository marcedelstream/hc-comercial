'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SeedButton({ secretKey }: { secretKey: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; categories?: number; products?: number; error?: string } | null>(null)
  const router = useRouter()

  async function handleSeed() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${secretKey}` },
      })
      const data = await res.json()
      setResult(data)
      if (data.ok) router.refresh()
    } catch {
      setResult({ ok: false, error: 'Error de red.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-blue text-dark font-semibold px-6 py-3 rounded-lg hover:bg-blue-dark disabled:opacity-50 ease-out duration-200"
      >
        {loading ? 'Cargando datos...' : 'Cargar datos de prueba'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-xl border text-sm ${result.ok ? 'bg-green/5 border-green/20 text-green' : 'bg-red/5 border-red/20 text-red'}`}>
          {result.ok
            ? `✓ ${result.categories} categorías y ${result.products} productos cargados correctamente.`
            : `Error: ${result.error}`}
        </div>
      )}
    </div>
  )
}
