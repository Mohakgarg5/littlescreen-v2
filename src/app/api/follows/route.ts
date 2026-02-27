import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decodeToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("follows")
    .select("following_username")
    .eq("follower_id", decoded.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json((data || []).map((r) => r.following_username));
}

export async function POST(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await request.json();
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("follows")
    .upsert({ follower_id: decoded.id, following_username: username }, { onConflict: "follower_id,following_username" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await request.json();
  if (!username) {
    return NextResponse.json({ error: "username is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", decoded.id)
    .eq("following_username", username);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
