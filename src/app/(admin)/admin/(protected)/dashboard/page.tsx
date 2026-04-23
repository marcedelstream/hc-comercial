export const dynamic = "force-dynamic";
import { Package, Tag, Image, MessageSquare, ShoppingCart } from "lucide-react";

const CARDS = [
  { label: "Productos", icon: Package, href: "/admin/productos", color: "text-blue-400" },
  { label: "Categorías", icon: Tag, href: "/admin/categorias", color: "text-purple-400" },
  { label: "Banners", icon: Image, href: "/admin/banners", color: "text-green-400" },
  { label: "Testimonios", icon: MessageSquare, href: "/admin/testimonios", color: "text-yellow-400" },
  { label: "Pedidos", icon: ShoppingCart, href: "/admin/pedidos", color: "text-orange-400" },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-2">DASHBOARD</h1>
      <p className="text-gray-500 mb-8">Bienvenido al panel de administración de HC Comercial.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {CARDS.map(({ label, icon: Icon, href, color }) => (
          <a
            key={href}
            href={href}
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 flex flex-col items-center gap-3 hover:border-[#F0D000]/30 transition-colors group"
          >
            <Icon className={`h-8 w-8 ${color} group-hover:scale-110 transition-transform`} />
            <span className="text-gray-300 text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>

      <div className="mt-10 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h2 className="text-[#F0D000] font-semibold mb-3 tracking-wider">ACCESOS RÁPIDOS</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/productos/nuevo" className="bg-[#F0D000] text-[#0A0A0A] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#F0D000]/90 transition-colors">
            + Nuevo producto
          </a>
          <a href="/admin/configuracion" className="border border-[#2A2A2A] text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-[#F0D000]/30 hover:text-white transition-colors">
            Configuración del sitio
          </a>
          <a href="/" target="_blank" className="border border-[#2A2A2A] text-gray-300 px-4 py-2 rounded-lg text-sm hover:border-[#F0D000]/30 hover:text-white transition-colors">
            Ver sitio ↗
          </a>
        </div>
      </div>
    </div>
  );
}
