import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function getClient() {
  const { createServiceRoleClient } = await import("@/lib/supabase-admin");
  return createServiceRoleClient();
}

export async function GET() {
  try {
    const supabase = await getClient();
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const settings: Record<string, unknown> = {};
    data?.forEach(({ key, value }: { key: string; value: unknown }) => {
      settings[key] = value;
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Error al obtener configuración" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await getClient();
    const entries = [
      { key: "ticker_text", value: body.ticker_text ?? null },
      { key: "black_banner_product_id", value: body.black_banner_product_id ?? null },
      { key: "best_seller_product_ids", value: body.best_seller_product_ids ?? [] },
      { key: "special_offer_product_id", value: body.special_offer_product_id ?? null },
      { key: "special_offer_ends_at", value: body.special_offer_ends_at ?? null },
    ];
    const { error } = await supabase
      .from("site_settings")
      .upsert(entries, { onConflict: "key" });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al guardar configuración" }, { status: 500 });
  }
}
