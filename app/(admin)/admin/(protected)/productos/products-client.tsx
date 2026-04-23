"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  active: boolean;
  featured: boolean;
  category_id?: string;
}

interface Props {
  initialProducts: Record<string, unknown>[];
  categories: { id: string; name: string }[];
}

export default function ProductsClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts as unknown as Product[]);
  const [search, setSearch] = useState("");

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku ?? "").toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto eliminado");
    } else {
      toast.error("Error al eliminar");
    }
  }

  async function toggleActive(p: Product) {
    const res = await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    if (res.ok) {
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x))
      );
    }
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o SKU..."
          className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#F0D000]/50"
        />
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">SKU</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Categoría</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium">Precio</th>
              <th className="text-right px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Stock</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#1F1F1F] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{p.sku ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                  {p.category_id ? catMap[p.category_id] ?? "—" : "—"}
                </td>
                <td className="px-4 py-3 text-right text-white">
                  Gs. {(p.price ?? 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-gray-300 hidden sm:table-cell">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleActive(p)} className="focus:outline-none">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {p.active ? "Activo" : "Inactivo"}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  {search ? "Sin resultados" : "No hay productos. Creá el primero."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
