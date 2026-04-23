export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import TestimonialsClient from "./testimonials-client";

export default async function TestimonialsPage() {
  let testimonials: Record<string, unknown>[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      testimonials = data ?? [];
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">TESTIMONIOS</h1>
      <TestimonialsClient initialTestimonials={testimonials} />
    </div>
  );
}
