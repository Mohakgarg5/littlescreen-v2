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
    .from("playlists")
    .select(`
      *,
      playlist_tags(tag),
      playlist_items(count)
    `)
    .eq("user_id", decoded.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Normalize shape
  const playlists = (data || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    moment: p.moment,
    age_group: p.age_group,
    is_public: p.is_public,
    saves: p.saves,
    created_at: p.created_at,
    tags: (p.playlist_tags || []).map((t: { tag: string }) => t.tag),
    item_count: p.playlist_items?.[0]?.count ?? 0,
  }));

  return NextResponse.json(playlists);
}

export async function POST(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, moment, age_group, is_public, tags } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Insert playlist
  const { data: playlist, error: playlistError } = await supabase
    .from("playlists")
    .insert({
      user_id: decoded.id,
      name: name.trim(),
      description: description?.trim() || null,
      moment: moment || null,
      age_group: age_group || null,
      is_public: is_public ?? false,
    })
    .select()
    .single();

  if (playlistError || !playlist) {
    return NextResponse.json({ error: playlistError?.message || "Failed to create playlist" }, { status: 500 });
  }

  // Insert tags if provided
  if (Array.isArray(tags) && tags.length > 0) {
    const tagRows = tags.map((tag: string) => ({
      playlist_id: playlist.id,
      tag: tag.toLowerCase().trim(),
    }));
    await supabase.from("playlist_tags").insert(tagRows);
  }

  return NextResponse.json({ id: playlist.id, ...playlist }, { status: 201 });
}
