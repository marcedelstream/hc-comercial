export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import ProductForm from "@/components/admin/product-form";

export default async function NuevoProductoPage() {
  let categories: { id: string; name: string }[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const { data } = await supabase.from("categories").select("id, name").order("name");
      categories = data ?? [];
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">NUEVO PRODUCTO</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
