import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decodeToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("playlists")
    .select(`
      *,
      playlist_tags(tag),
      playlist_items(*)
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...data,
    tags: (data.playlist_tags || []).map((t: { tag: string }) => t.tag),
    items: data.playlist_items || [],
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { name, description, moment, age_group, is_public, tags } = body;

  const supabase = getSupabaseAdmin();

  // Verify ownership
  const { data: existing } = await supabase
    .from("playlists")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!existing || existing.user_id !== decoded.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) updates.name = name.trim();
  if (description !== undefined) updates.description = description?.trim() || null;
  if (moment !== undefined) updates.moment = moment || null;
  if (age_group !== undefined) updates.age_group = age_group || null;
  if (is_public !== undefined) updates.is_public = is_public;

  const { error } = await supabase.from("playlists").update(updates).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Replace tags if provided
  if (Array.isArray(tags)) {
    await supabase.from("playlist_tags").delete().eq("playlist_id", id);
    if (tags.length > 0) {
      await supabase.from("playlist_tags").insert(
        tags.map((tag: string) => ({ playlist_id: id, tag: tag.toLowerCase().trim() }))
      );
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();

  // Verify ownership
  const { data: existing } = await supabase
    .from("playlists")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!existing || existing.user_id !== decoded.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await supabase.from("playlists").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
