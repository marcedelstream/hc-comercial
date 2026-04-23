export const dynamic = "force-dynamic";
import Link from "next/link";
import { Plus } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import ProductsClient from "./products-client";

export default async function ProductosPage() {
  let products: Record<string, unknown>[] = [];
  let categories: { id: string; name: string }[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const [{ data: prods }, { data: cats }] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("id, name").order("name"),
      ]);
      products = prods ?? [];
      categories = cats ?? [];
    } catch {}
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white tracking-wider">PRODUCTOS</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-[#F0D000] text-[#0A0A0A] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#F0D000]/90 transition-colors"
        >
          <Plus className="h-4 w-4" /> NUEVO
        </Link>
      </div>
      <ProductsClient initialProducts={products} categories={categories} />
    </div>
  );
}
