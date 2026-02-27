import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decodeToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { concerns } = body;

  if (!Array.isArray(concerns) || concerns.length === 0) {
    return NextResponse.json({ error: "No concerns provided" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Replace existing concerns for this user
  await supabase.from("parent_concerns").delete().eq("user_id", decoded.id);

  const rows = concerns.map((concern: string) => ({
    user_id: decoded.id,
    concern,
  }));

  const { error } = await supabase.from("parent_concerns").insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
