'use client'

import { useState, useTransition } from 'react'
import { loginAction } from './actions'
import Image from 'next/image'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen bg-gray-1 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-1 w-full max-w-md p-8 border border-gray-3">
        <div className="flex justify-center mb-8">
          <Image
            src="/hc-comercial-logo.png"
            alt="HC Comercial"
            width={140}
            height={60}
            className="object-contain"
          />
        </div>

        <h1 className="text-xl font-bold text-center text-dark mb-1">Panel de Administración</h1>
        <p className="text-sm text-center text-dark-3 mb-7">Ingresá con tu cuenta de administrador</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1.5">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-gray-3 rounded-lg px-4 py-2.5 text-sm text-dark focus:outline-none focus:border-blue transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red bg-red/5 border border-red/20 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue text-dark font-semibold py-3 rounded-lg hover:bg-blue-dark disabled:opacity-50 ease-out duration-200"
          >
            {isPending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
