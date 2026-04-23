"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
}

interface Props {
  initialSettings: Record<string, unknown>;
  products: Product[];
}

export default function SettingsClient({ initialSettings, products }: Props) {
  const [tickerText, setTickerText] = useState(String(initialSettings.ticker_text ?? ""));
  const [blackBannerId, setBlackBannerId] = useState(String(initialSettings.black_banner_product_id ?? ""));
  const [specialOfferId, setSpecialOfferId] = useState(String(initialSettings.special_offer_product_id ?? ""));
  const [specialOfferEndsAt, setSpecialOfferEndsAt] = useState(String(initialSettings.special_offer_ends_at ?? ""));
  const [bestSellerIds, setBestSellerIds] = useState<string[]>(
    Array.isArray(initialSettings.best_seller_product_ids) ? initialSettings.best_seller_product_ids as string[] : []
  );
  const [loading, setLoading] = useState(false);

  function toggleBestSeller(id: string) {
    setBestSellerIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function save() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker_text: tickerText,
          black_banner_product_id: blackBannerId || null,
          special_offer_product_id: specialOfferId || null,
          special_offer_ends_at: specialOfferEndsAt || null,
          best_seller_product_ids: bestSellerIds,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Configuración guardada");
    } catch {
      toast.error("Error al guardar");
    } finally {
      setLoading(false);
    }
  }

  const field = "w-full bg-[#0A0A0A] border border-[#2A2A2A] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#F0D000]/50";
  const section = "bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 space-y-4";

  return (
    <div className="max-w-2xl space-y-6">
      <div className={section}>
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">TICKER / MARQUEE</h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">Texto del ticker (se repite automáticamente)</label>
          <input value={tickerText} onChange={(e) => setTickerText(e.target.value)} placeholder="ENVIOS A TODO PARAGUAY ★ ..." className={field} />
        </div>
      </div>

      <div className={section}>
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">BANNER NEGRO</h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">Producto destacado en el banner negro</label>
          <select value={blackBannerId} onChange={(e) => setBlackBannerId(e.target.value)} className={field}>
            <option value="">— Sin producto —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={section}>
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">MÁS VENDIDOS</h2>
        <p className="text-gray-500 text-xs">Seleccioná los productos que aparecen en la sección "Más vendidos"</p>
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
          {products.map((p) => (
            <label key={p.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-white/[0.03]">
              <input
                type="checkbox"
                checked={bestSellerIds.includes(p.id)}
                onChange={() => toggleBestSeller(p.id)}
                className="w-4 h-4 accent-[#F0D000]"
              />
              <span className="text-gray-300 text-sm">{p.name}</span>
            </label>
          ))}
          {products.length === 0 && <p className="text-gray-600 text-sm py-4 text-center">No hay productos activos</p>}
        </div>
      </div>

      <div className={section}>
        <h2 className="text-[#F0D000] text-sm font-semibold tracking-wider">OFERTA ESPECIAL CON COUNTDOWN</h2>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">Producto en oferta</label>
          <select value={specialOfferId} onChange={(e) => setSpecialOfferId(e.target.value)} className={field}>
            <option value="">— Sin producto —</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-xs mb-1.5">Fecha y hora de vencimiento</label>
          <input
            type="datetime-local"
            value={specialOfferEndsAt ? specialOfferEndsAt.slice(0, 16) : ""}
            onChange={(e) => setSpecialOfferEndsAt(e.target.value ? new Date(e.target.value).toISOString() : "")}
            className={field}
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="w-full bg-[#F0D000] text-[#0A0A0A] font-bold py-3 rounded-xl text-sm hover:bg-[#F0D000]/90 transition-colors disabled:opacity-50 tracking-wider"
      >
        {loading ? "GUARDANDO..." : "GUARDAR CONFIGURACIÓN"}
      </button>
    </div>
  );
}
