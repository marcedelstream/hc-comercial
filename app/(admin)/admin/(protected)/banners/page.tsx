export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import BannersClient from "./banners-client";

export default async function BannersPage() {
  let banners: Record<string, unknown>[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const { data } = await supabase.from("banners").select("*").order("order_index");
      banners = data ?? [];
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">BANNERS / HERO</h1>
      <BannersClient initialBanners={banners} />
    </div>
  );
}
