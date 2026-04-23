"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  product?: Record<string, unknown>;
}

const EMPTY = {
  sku: "", name: "", slug: "", description: "",
  price: "", price_original: "", stock: "0",
  category_id: "", badge: "",
  images: [] as string[],
  featured: false, is_best_seller: false, active: true,
};

export default function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    sku: String(product?.sku ?? ""),
    name: String(product?.name ?? ""),
    slug: String(product?.slug ?? ""),
    description: String(product?.description ?? ""),
    price: String(product?.price ?? ""),
    price_original: String(product?.price_original ?? ""),
    stock: String(product?.stock ?? "0"),
    category_id: String(product?.category_id ?? ""),
    badge: String(product?.badge ?? ""),
    images: (product?.images as string[]) ?? [],
    featured: Boolean(product?.featured),
    is_best_seller: Boolean(product?.is_best_seller),
    active: product?.active !== undefined ? Boolean(product.active) : true,
  });
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);

  function slugify(val: string) {
    return val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }

  function addImage() {
    const url = imageInput.trim();
    if (!url) return;
    setForm((f) => ({ ...f, images: [...f.images, url] }));
    setImageInput("");
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.price) { toast.error("Nombre y precio son obligatorios"); return; }
    setLoading(true);

    const payload = {
      sku: form.sku || null,
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || null,
      price: parseFloat(form.price),
      price_original: form.price_original ? parseFloat(form.price_original) : null,
      stock: parseInt(form.stock) || 0,
      category_id: form.category_id || null,
      badge: form.badge || null,
      images: form.images,
      featured: form.featured,
      is_best_seller: form.is_best_seller,
      active: form.active,
    };

    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(isEdit ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  const field = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F0D000]/50";
  const label = "block text-gray-400 text-xs mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">INFORMACIÓN BÁSICA</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Nombre *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
              className={field} required
            />
          </div>
          <div>
            <label className={label}>SKU</label>
            <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className={field} />
          </div>
        </div>

        <div>
          <label className={label}>Slug (URL)</label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={field} />
        </div>

        <div>
          <label className={label}>Descripción</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className={`${field} resize-none`}
          />
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">PRECIO Y STOCK</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={label}>Precio (Gs.) *</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={field} required />
          </div>
          <div>
            <label className={label}>Precio original</label>
            <input type="number" value={form.price_original} onChange={(e) => setForm({ ...form, price_original: e.target.value })} className={field} />
          </div>
          <div>
            <label className={label}>Stock</label>
            <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={field} />
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">CATEGORÍA Y ETIQUETA</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Categoría</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={field}>
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Badge / Etiqueta</label>
            <input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="Ej: NUEVO, OFERTA" className={field} />
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">IMÁGENES</h2>
        <div className="flex gap-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
            placeholder="URL de imagen..."
            className={`${field} flex-1`}
          />
          <button type="button" onClick={addImage} className="bg-[#2A2A2A] hover:bg-[#333] text-white px-3 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {form.images.length > 0 && (
          <div className="space-y-2">
            {form.images.map((url, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#0A0A0A] rounded-lg px-3 py-2">
                <span className="text-gray-400 text-xs flex-1 truncate">{url}</span>
                <button type="button" onClick={() => removeImage(i)} className="text-gray-500 hover:text-red-400">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider mb-4">OPCIONES</h2>
        <div className="space-y-3">
          {[
            { key: "active", label: "Activo (visible en el sitio)" },
            { key: "featured", label: "Producto destacado" },
            { key: "is_best_seller", label: "Más vendido" },
          ].map(({ key, label: lbl }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="w-4 h-4 accent-[#F0D000]"
              />
              <span className="text-gray-300 text-sm">{lbl}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/productos")}
          className="px-5 py-2.5 border border-[#2A2A2A] text-gray-300 rounded-lg text-sm hover:border-white/20 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[#F0D000] text-[#0A0A0A] font-bold rounded-lg text-sm hover:bg-[#F0D000]/90 transition-colors disabled:opacity-50"
        >
          {loading ? "GUARDANDO..." : isEdit ? "GUARDAR CAMBIOS" : "CREAR PRODUCTO"}
        </button>
      </div>
    </form>
  );
}
