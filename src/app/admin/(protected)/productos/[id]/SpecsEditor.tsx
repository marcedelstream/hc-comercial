'use client'

import { useState } from 'react'

interface Spec {
  name: string
  description: string
}

interface Props {
  initial: Spec[]
}

export default function SpecsEditor({ initial }: Props) {
  const [specs, setSpecs] = useState<Spec[]>(
    initial.length > 0 ? initial : []
  )

  function addRow() {
    setSpecs((prev) => [...prev, { name: '', description: '' }])
  }

  function removeRow(i: number) {
    setSpecs((prev) => prev.filter((_, idx) => idx !== i))
  }

  function updateRow(i: number, field: 'name' | 'description', value: string) {
    setSpecs((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, [field]: value } : row))
    )
  }

  return (
    <div>
      {/* Input oculto que el Server Action lee */}
      <input
        type="hidden"
        name="additional_information"
        value={JSON.stringify(specs)}
      />

      {specs.length > 0 && (
        <div className="mb-3 border border-gray-3 rounded-lg overflow-hidden">
          {/* Cabecera */}
          <div className="grid grid-cols-[1fr_1fr_32px] bg-gray-1 border-b border-gray-3 px-3 py-2 text-xs font-semibold text-dark-4 uppercase tracking-wide">
            <span>Título</span>
            <span>Descripción / Valor</span>
            <span />
          </div>

          {/* Filas */}
          {specs.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1fr_32px] items-center border-b border-gray-3 last:border-b-0"
            >
              <input
                type="text"
                value={row.name}
                onChange={(e) => updateRow(i, 'name', e.target.value)}
                placeholder="Ej: Potencia"
                className="px-3 py-2.5 text-sm text-dark border-r border-gray-3 focus:outline-none focus:bg-blue/5 w-full"
              />
              <input
                type="text"
                value={row.description}
                onChange={(e) => updateRow(i, 'description', e.target.value)}
                placeholder="Ej: 2000W"
                className="px-3 py-2.5 text-sm text-dark border-r border-gray-3 focus:outline-none focus:bg-blue/5 w-full"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="flex items-center justify-center h-full text-dark-4 hover:text-red hover:bg-red/10 transition-colors"
                title="Eliminar fila"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {specs.length === 0 && (
        <p className="text-sm text-dark-4 italic mb-3">
          Sin especificaciones. Hacé clic en &quot;+ Agregar fila&quot; para comenzar.
        </p>
      )}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-dark border border-gray-3 bg-gray-1 hover:bg-gray-2 px-3 py-1.5 rounded-lg transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 5v14M5 12h14" />
        </svg>
        Agregar fila
      </button>
    </div>
  )
}
