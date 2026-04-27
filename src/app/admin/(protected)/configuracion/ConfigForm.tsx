'use client'

import { useState, useTransition } from 'react'
import { saveSettingsAction } from './actions'

const FIELDS = [
  { key: 'site_name',   label: 'Nombre del sitio',         placeholder: 'HC Comercial' },
  { key: 'header_text', label: 'Texto del ticker (header)', placeholder: 'Envíos a todo el Paraguay...' },
  { key: 'whatsapp',    label: 'Número de WhatsApp',        placeholder: '+595982800258' },
]

export default function ConfigForm({ settings }: { settings: Record<string, string> }) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await saveSettingsAction(formData)
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-1 border border-gray-3 p-6 space-y-5">
      {FIELDS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-dark mb-1.5">{label}</label>
          <input
            name={key}
            defaultValue={settings[key] ?? ''}
            placeholder={placeholder}
            className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors"
          />
        </div>
      ))}

      {saved && (
        <p className="text-sm text-green bg-green/5 border border-green/20 rounded-lg px-4 py-2.5">
          Configuración guardada correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue text-dark font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-dark disabled:opacity-50 ease-out duration-200"
      >
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
