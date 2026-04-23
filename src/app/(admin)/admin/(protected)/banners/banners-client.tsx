"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Banner {
  id: string;
  image_url: string;
  title?: string;
  subtitle?: string;
  cta_text?: string;
  cta_url?: string;
  active: boolean;
  order_index: number;
}

interface Props {
  initialBanners: Record<string, unknown>[];
}

const EMPTY = { image_url: "", title: "", subtitle: "", cta_text: "", cta_url: "", active: true, order_index: 0 };

export default function BannersClient({ initialBanners }: Props) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners as unknown as Banner[]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY, order_index: banners.length });
    setShowForm(true);
  }

  function openEdit(b: Banner) {
    setEditing(b);
    setForm({ image_url: b.image_url, title: b.title ?? "", subtitle: b.subtitle ?? "", cta_text: b.cta_text ?? "", cta_url: b.cta_url ?? "", active: b.active, order_index: b.order_index });
    setShowForm(true);
  }

  async function save() {
    if (!form.image_url) { toast.error("La URL de imagen es obligatoria"); return; }
    setLoading(true);
    const payload = {
      image_url: form.image_url,
      title: form.title || null,
      subtitle: form.subtitle || null,
      cta_text: form.cta_text || null,
      cta_url: form.cta_url || null,
      active: form.active,
      order_index: form.order_index,
    };
    try {
      if (editing) {
        const res = await fetch(`/api/admin/banners/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setBanners((prev) => prev.map((b) => (b.id === editing.id ? updated : b)));
        toast.success("Banner actualizado");
      } else {
        const res = await fetch("/api/admin/banners", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setBanners((prev) => [...prev, created].sort((a, b) => a.order_index - b.order_index));
        toast.success("Banner creado");
      }
      setShowForm(false);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este banner?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (res.ok) {
      setBanners((prev) => prev.filter((b) => b.id !== id));
      toast.success("Banner eliminado");
    } else {
      toast.error("Error al eliminar");
    }
  }

  const field = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F0D000]/50";

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#F0D000] text-[#0A0A0A] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#F0D000]/90 transition-colors">
          <Plus className="h-4 w-4" /> NUEVO BANNER
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#F0D000] text-sm font-semibold tracking-wider">{editing ? "EDITAR BANNER" : "NUEVO BANNER"}</span>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">URL de imagen *</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={field} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Subtítulo</label>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Texto del botón</label>
              <input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">URL del botón</label>
              <input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Orden</label>
              <input type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })} className={field} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#F0D000]" />
                <span className="text-gray-300 text-sm">Activo</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#2A2A2A] text-gray-400 rounded-lg text-sm">Cancelar</button>
            <button onClick={save} disabled={loading} className="px-4 py-2 bg-[#F0D000] text-[#0A0A0A] font-bold rounded-lg text-sm disabled:opacity-50">
              {loading ? "GUARDANDO..." : "GUARDAR"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 flex items-center gap-4">
            <div className="w-20 h-12 bg-[#0A0A0A] rounded-lg overflow-hidden shrink-0">
              {b.image_url && <img src={b.image_url} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{b.title || "Sin título"}</p>
              <p className="text-gray-500 text-xs truncate">{b.image_url}</p>
            </div>
            <span className="text-gray-500 text-xs">#{b.order_index}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${b.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
              {b.active ? "Activo" : "Inactivo"}
            </span>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEdit(b)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(b.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">No hay banners.</div>
        )}
      </div>
    </div>
  );
}
