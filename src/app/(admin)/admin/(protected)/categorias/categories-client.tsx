"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  active: boolean;
}

interface Props {
  initialCategories: Record<string, unknown>[];
}

const EMPTY = { name: "", slug: "", icon: "", active: true };

export default function CategoriesClient({ initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories as unknown as Category[]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  function slugify(v: string) {
    return v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(c: Category) {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, icon: c.icon ?? "", active: c.active });
    setShowForm(true);
  }

  async function save() {
    if (!form.name) { toast.error("El nombre es obligatorio"); return; }
    setLoading(true);
    const payload = { name: form.name, slug: form.slug || slugify(form.name), icon: form.icon || null, active: form.active };
    try {
      if (editing) {
        const res = await fetch(`/api/admin/categories/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
        toast.success("Categoría actualizada");
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
        toast.success("Categoría creada");
      }
      setShowForm(false);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoría eliminada");
    } else {
      toast.error("Error al eliminar");
    }
  }

  const field = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F0D000]/50";

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#F0D000] text-[#0A0A0A] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#F0D000]/90 transition-colors">
          <Plus className="h-4 w-4" /> NUEVA CATEGORÍA
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#F0D000] text-sm font-semibold tracking-wider">
              {editing ? "EDITAR CATEGORÍA" : "NUEVA CATEGORÍA"}
            </span>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Nombre *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                className={field}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Ícono (nombre lucide)</label>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Flame, Refrigerator..." className={field} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#F0D000]" />
                <span className="text-gray-300 text-sm">Activa</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#2A2A2A] text-gray-400 rounded-lg text-sm hover:border-white/20">Cancelar</button>
            <button onClick={save} disabled={loading} className="px-4 py-2 bg-[#F0D000] text-[#0A0A0A] font-bold rounded-lg text-sm disabled:opacity-50">
              {loading ? "GUARDANDO..." : "GUARDAR"}
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2A2A2A]">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">Nombre</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden sm:table-cell">Slug</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium hidden md:table-cell">Ícono</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-[#1F1F1F] hover:bg-white/[0.02]">
                <td className="px-4 py-3 text-white font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-400 hidden sm:table-cell">{c.slug}</td>
                <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{c.icon ?? "—"}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${c.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                    {c.active ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-500">No hay categorías.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
