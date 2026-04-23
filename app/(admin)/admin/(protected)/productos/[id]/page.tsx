export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import ProductForm from "@/components/admin/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;
  let product = null;
  let categories: { id: string; name: string }[] = [];

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const [{ data: prod }, { data: cats }] = await Promise.all([
        supabase.from("products").select("*").eq("id", id).single(),
        supabase.from("categories").select("id, name").order("name"),
      ]);
      product = prod;
      categories = cats ?? [];
    } catch {}
  }

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">EDITAR PRODUCTO</h1>
      <ProductForm categories={categories} product={product as Record<string, unknown>} />
    </div>
  );
}
