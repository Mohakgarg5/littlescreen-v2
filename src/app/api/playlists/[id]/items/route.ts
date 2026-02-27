import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decodeToken } from "@/lib/auth";

async function verifyOwnership(playlistId: string, userId: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("playlists")
    .select("user_id")
    .eq("id", playlistId)
    .single();
  return data?.user_id === userId;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: playlistId } = await params;
  const body = await request.json();
  const { video_id, title, thumbnail_url, channel_name } = body;

  if (!video_id || !title) {
    return NextResponse.json({ error: "video_id and title are required" }, { status: 400 });
  }

  const isOwner = await verifyOwnership(playlistId, decoded.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();

  // Get current item count for position
  const { count } = await supabase
    .from("playlist_items")
    .select("*", { count: "exact", head: true })
    .eq("playlist_id", playlistId);

  const { data: item, error } = await supabase
    .from("playlist_items")
    .insert({
      playlist_id: playlistId,
      video_id,
      title,
      thumbnail_url: thumbnail_url || null,
      channel_name: channel_name || null,
      position: count ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, item }, { status: 201 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: playlistId } = await params;
  const itemId = request.nextUrl.searchParams.get("item_id");

  if (!itemId) {
    return NextResponse.json({ error: "item_id is required" }, { status: 400 });
  }

  const isOwner = await verifyOwnership(playlistId, decoded.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("playlist_items")
    .delete()
    .eq("id", itemId)
    .eq("playlist_id", playlistId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
