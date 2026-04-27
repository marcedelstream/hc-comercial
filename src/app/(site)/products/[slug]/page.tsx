import { getProductBySlug } from "@/get-api-data/product";
import { redirect, notFound } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function ProductRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  redirect(`/${product.category.slug}/${slug}`);
}
