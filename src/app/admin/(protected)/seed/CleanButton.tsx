'use client'

import { useState } from 'react'
import { cleanAllDataAction } from './actions'

export default function CleanButton() {
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!confirm('¿Eliminar TODOS los productos y categorías? Esta acción no se puede deshacer.')) return
    setLoading(true)
    try {
      await cleanAllDataAction()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-2 bg-red text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 ease-out duration-200 text-sm"
    >
      {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
      {loading ? 'Eliminando...' : 'Limpiar catálogo'}
    </button>
  )
}
