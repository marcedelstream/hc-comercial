export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import CategoriesClient from "./categories-client";

export default async function CategoriasPage() {
  let categories: Record<string, unknown>[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const { data } = await supabase.from("categories").select("*").order("name");
      categories = data ?? [];
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">CATEGORÍAS</h1>
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
