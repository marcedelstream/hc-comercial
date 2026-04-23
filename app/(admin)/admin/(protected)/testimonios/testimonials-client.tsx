"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  company?: string | null;
  text: string;
  rating: number;
  avatar_url?: string | null;
  active: boolean;
  created_at: string;
}

interface Props {
  initialTestimonials: Record<string, unknown>[];
}

const EMPTY = { name: "", company: "", text: "", rating: 5, avatar_url: "", active: true };

export default function TestimonialsClient({ initialTestimonials }: Props) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials as unknown as Testimonial[]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(t: Testimonial) {
    setEditing(t);
    setForm({ name: t.name, company: t.company ?? "", text: t.text, rating: t.rating, avatar_url: t.avatar_url ?? "", active: t.active });
    setShowForm(true);
  }

  async function save() {
    if (!form.name || !form.text) { toast.error("Nombre y texto son obligatorios"); return; }
    setLoading(true);
    const payload = { name: form.name, company: form.company || null, text: form.text, rating: form.rating, avatar_url: form.avatar_url || null, active: form.active };
    try {
      if (editing) {
        const res = await fetch(`/api/admin/testimonials/${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setTestimonials((prev) => prev.map((t) => (t.id === editing.id ? updated : t)));
        toast.success("Testimonio actualizado");
      } else {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setTestimonials((prev) => [created, ...prev]);
        toast.success("Testimonio creado");
      }
      setShowForm(false);
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este testimonio?")) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success("Testimonio eliminado");
    } else {
      toast.error("Error al eliminar");
    }
  }

  async function toggleActive(t: Testimonial) {
    const res = await fetch(`/api/admin/testimonials/${t.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: t.name, text: t.text, rating: t.rating, active: !t.active }),
    });
    if (res.ok) setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, active: !x.active } : x)));
  }

  const field = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F0D000]/50";

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#F0D000] text-[#0A0A0A] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#F0D000]/90 transition-colors">
          <Plus className="h-4 w-4" /> NUEVO TESTIMONIO
        </button>
      </div>

      {showForm && (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-5 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#F0D000] text-sm font-semibold tracking-wider">{editing ? "EDITAR TESTIMONIO" : "NUEVO TESTIMONIO"}</span>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Nombre *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1.5">Empresa</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={field} />
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-1.5">Testimonio *</label>
            <textarea value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={3} className={`${field} resize-none`} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs mb-2">Calificación</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })} className="focus:outline-none">
                  <Star className={`h-6 w-6 transition-colors ${n <= form.rating ? "text-[#F0D000] fill-[#F0D000]" : "text-gray-600 hover:text-gray-400"}`} />
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#F0D000]" />
            <span className="text-gray-300 text-sm">Visible en el sitio</span>
          </label>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#2A2A2A] text-gray-400 rounded-lg text-sm">Cancelar</button>
            <button onClick={save} disabled={loading} className="px-4 py-2 bg-[#F0D000] text-[#0A0A0A] font-bold rounded-lg text-sm disabled:opacity-50">
              {loading ? "GUARDANDO..." : "GUARDAR"}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                {t.company && <span className="text-gray-500 text-xs">— {t.company}</span>}
              </div>
              <div className="flex gap-0.5 mb-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < t.rating ? "text-[#F0D000] fill-[#F0D000]" : "text-gray-600"}`} />
                ))}
              </div>
              <p className="text-gray-400 text-sm line-clamp-2">{t.text}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => toggleActive(t)} className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                {t.active ? "Activo" : "Inactivo"}
              </button>
              <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded">
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl">No hay testimonios.</div>
        )}
      </div>
    </div>
  );
}
