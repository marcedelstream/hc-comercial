'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import { addProductImageAction, removeProductImageAction } from './actions'

const MAX_IMAGES = 6

interface Props {
  productId: number
  images: string[]
}

export default function ProductImageUpload({ productId, images: initial }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState(initial.filter(Boolean))
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > 5 * 1024 * 1024) { setError('Máximo 5 MB por imagen'); return }
    if (images.length >= MAX_IMAGES) { setError(`Máximo ${MAX_IMAGES} imágenes`); return }

    setError('')
    setUploading(true)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'product-images')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Error subiendo')
      const newUrl = data.url as string
      setImages(prev => [...prev, newUrl])
      startTransition(() => addProductImageAction(productId, newUrl))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (url: string) => {
    setImages(prev => prev.filter(img => img !== url))
    startTransition(() => removeProductImageAction(productId, url))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={img} className="relative group w-24 h-24 rounded-xl border border-gray-3 overflow-hidden bg-gray-1">
            <Image src={img} alt={`Imagen ${i + 1}`} fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => handleRemove(img)}
              disabled={isPending}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-dark/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red"
              aria-label="Eliminar imagen"
            >
              ×
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-[9px] bg-blue text-dark px-1 rounded font-bold leading-tight">
                Principal
              </span>
            )}
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            disabled={uploading || isPending}
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-3 bg-gray-1 flex flex-col items-center justify-center gap-1 text-dark-4 hover:border-blue hover:text-blue transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <span className="w-5 h-5 border-2 border-dark-4 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] font-medium">Agregar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {error && <p className="text-xs text-red">{error}</p>}
      <p className="text-xs text-dark-4">
        PNG, JPG o WEBP · Máx. 5 MB · Hasta {MAX_IMAGES} fotos · La primera es la principal
      </p>
    </div>
  )
}
