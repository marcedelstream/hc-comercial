import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface Params { params: Promise<{ id: string }> }

async function getClient() {
  const { createServiceRoleClient } = await import("@/lib/supabase-admin");
  return createServiceRoleClient();
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await getClient();
    const { data, error } = await supabase.from("categories").update(body).eq("id", id).select().single();
    if (error) throw error;
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await getClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al eliminar" }, { status: 500 });
  }
}
