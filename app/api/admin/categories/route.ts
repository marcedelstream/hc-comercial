import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function getClient() {
  const { createServiceRoleClient } = await import("@/lib/supabase-admin");
  return createServiceRoleClient();
}

export async function GET() {
  try {
    const supabase = await getClient();
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Error al obtener categorías" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await getClient();
    const { data, error } = await supabase.from("categories").insert(body).select().single();
    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al crear categoría" }, { status: 500 });
  }
}
