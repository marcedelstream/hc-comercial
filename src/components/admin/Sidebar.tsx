'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/(protected)/actions'

const links = [
  { href: '/admin/dashboard',     label: 'Dashboard' },
  { href: '/admin/productos',     label: 'Productos' },
  { href: '/admin/categorias',    label: 'Categorías' },
  { href: '/admin/ordenes',       label: 'Órdenes' },
  { href: '/admin/testimonios',   label: 'Testimonios' },
  { href: '/admin/banners',       label: 'Banners' },
  { href: '/admin/sincronizar',   label: 'Sincronizar' },
  { href: '/admin/configuracion', label: 'Configuración' },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-gray-8 text-white flex flex-col min-h-screen shrink-0">
      <div className="p-5 border-b border-white/10 flex flex-col items-start">
        <Image
          src="/hc-comercial-logo.png"
          alt="HC Comercial"
          width={120}
          height={50}
          className="object-contain"
        />
        <p className="text-xs text-white/40 mt-1.5 font-medium tracking-wide uppercase">Admin Panel</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {links.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue text-dark'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/40 mb-3 truncate">{userEmail}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full text-sm text-white/60 hover:text-white py-2 text-left transition-colors"
          >
            Cerrar sesión →
          </button>
        </form>
      </div>
    </aside>
  )
}
