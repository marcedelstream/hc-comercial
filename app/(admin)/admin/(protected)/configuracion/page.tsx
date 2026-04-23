export const dynamic = "force-dynamic";
import { createServiceRoleClient } from "@/lib/supabase-admin";
import SettingsClient from "./settings-client";

export default async function ConfiguracionPage() {
  let settings: Record<string, unknown> = {};
  let products: { id: string; name: string }[] = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (supabaseUrl) {
    try {
      const supabase = await createServiceRoleClient();
      const [{ data: settingsData }, { data: prods }] = await Promise.all([
        supabase.from("site_settings").select("key, value"),
        supabase.from("products").select("id, name").eq("active", true).order("name"),
      ]);
      settingsData?.forEach(({ key, value }: { key: string; value: unknown }) => {
        settings[key] = value;
      });
      products = prods ?? [];
    } catch {}
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white tracking-wider mb-6">CONFIGURACIÓN</h1>
      <SettingsClient initialSettings={settings} products={products} />
    </div>
  );
}
