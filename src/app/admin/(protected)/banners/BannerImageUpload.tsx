'use client'

import { useRef, useState } from 'react'

interface Props {
  inputId: string
}

export default function BannerImageUpload({ inputId }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Máximo 5 MB'); return }

    setError('')
    setUploading(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'banner-images')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Error subiendo')
      setPreview(data.url)
      const target = document.getElementById(inputId) as HTMLInputElement | null
      if (target) target.value = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-2 text-sm font-medium text-dark border border-gray-3 rounded-lg px-4 py-2 hover:bg-gray-1 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <><span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" /> Subiendo...</>
        ) : (
          <><svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Subir imagen</>
        )}
      </button>
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-gray-3" />
      )}
      {error && <p className="text-xs text-red">{error}</p>}
    </div>
  )
}
