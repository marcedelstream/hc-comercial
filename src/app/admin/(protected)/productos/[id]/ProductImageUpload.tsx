'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { updateProductImagesAction } from './actions'

interface Props {
  productId: number
  currentImage: string
}

export default function ProductImageUpload({ productId, currentImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState(currentImage)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Máximo 5 MB'); return }

    setError('')
    setUploading(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'product-images')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Error subiendo')
      setPreview(data.url)
      startTransition(() => updateProductImagesAction(productId, data.url))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative w-40 h-40 rounded-xl border-2 border-dashed border-gray-3 overflow-hidden bg-gray-1 flex items-center justify-center">
        {preview ? (
          <Image src={preview} alt="Foto del producto" fill className="object-cover" unoptimized />
        ) : (
          <div className="text-center p-3">
            <svg className="mx-auto mb-1 text-dark-4" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-dark-4">Sin imagen</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <button
        type="button"
        disabled={uploading || isPending}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 text-sm font-medium text-dark border border-gray-3 rounded-lg px-4 py-2 hover:bg-gray-1 transition-colors disabled:opacity-50"
      >
        {uploading || isPending ? (
          <>
            <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {preview ? 'Cambiar foto' : 'Subir foto'}
          </>
        )}
      </button>

      {error && <p className="text-xs text-red">{error}</p>}
      {(uploading === false && isPending === false && preview && preview !== currentImage) && (
        <p className="text-xs text-green font-medium">✓ Foto guardada</p>
      )}
      <p className="text-xs text-dark-4">PNG, JPG o WEBP · Máx. 5 MB</p>
    </div>
  )
}
