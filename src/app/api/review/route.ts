import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ review: [] }, { status: 200 });
}
