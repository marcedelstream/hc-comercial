"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, Image, MessageSquare,
  Settings, ShoppingCart, LogOut
} from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/testimonios", label: "Testimonios", icon: MessageSquare },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-[#111111] border-r border-[#1F1F1F] min-h-screen flex flex-col">
      <div className="px-6 py-6 border-b border-[#1F1F1F]">
        <span className="text-[#F0D000] font-bold text-lg tracking-widest">HC ADMIN</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#F0D000]/10 text-[#F0D000] font-semibold"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#1F1F1F]">
        <a
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </a>
      </div>
    </aside>
  );
}
