import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decodeToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { video_id, trigger, rating, comment } = body;

  if (!trigger) {
    return NextResponse.json({ error: "trigger is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // For dashboard_check: skip if already submitted in last 24 hours
  if (trigger === "dashboard_check") {
    const { data: recent } = await supabase
      .from("feedback")
      .select("id")
      .eq("user_id", decoded.id)
      .eq("trigger", "dashboard_check")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: decoded.id,
    video_id: video_id || null,
    trigger,
    rating: rating ?? null,
    comment: comment?.trim() || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
