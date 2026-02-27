import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

const APPROVED_CHANNELS = [
  { channel_name: "Ms. Rachel - Songs for Littles", platform: "YouTube", age_min: 0, age_max: 3 },
  { channel_name: "Cocomelon - Nursery Rhymes", platform: "YouTube", age_min: 0, age_max: 3 },
  { channel_name: "Bluey", platform: "Disney+", age_min: 3, age_max: 7 },
  { channel_name: "Cosmic Kids Yoga", platform: "YouTube", age_min: 2, age_max: 6 },
  { channel_name: "Sesame Street", platform: "YouTube", age_min: 2, age_max: 5 },
  { channel_name: "Daniel Tiger's Neighborhood", platform: "PBS Kids", age_min: 2, age_max: 4 },
  { channel_name: "Numberblocks", platform: "Netflix", age_min: 2, age_max: 5 },
  { channel_name: "Pinkfong Baby Shark", platform: "YouTube", age_min: 0, age_max: 3 },
  { channel_name: "Super Simple Songs - Kids Songs", platform: "YouTube", age_min: 0, age_max: 4 },
  { channel_name: "Kids Learning Tube", platform: "YouTube", age_min: 3, age_max: 6 },
  { channel_name: "Blippi - Educational Videos for Kids", platform: "YouTube", age_min: 2, age_max: 5 },
  { channel_name: "Little Baby Bum - Nursery Rhymes & Kids Songs", platform: "YouTube", age_min: 0, age_max: 3 },
  { channel_name: "Peppa Pig - Official Channel", platform: "YouTube", age_min: 2, age_max: 5 },
  { channel_name: "PBS Kids", platform: "PBS Kids", age_min: 2, age_max: 6 },
  { channel_name: "Kiddie Academy", platform: "YouTube", age_min: 2, age_max: 5 },
  { channel_name: "Dave and Ava - Nursery Rhymes and Baby Songs", platform: "YouTube", age_min: 0, age_max: 3 },
  { channel_name: "Mother Goose Club Playhouse", platform: "YouTube", age_min: 0, age_max: 4 },
  { channel_name: "GEO Kids", platform: "YouTube", age_min: 2, age_max: 6 },
  { channel_name: "Learn English Kids - British Council", platform: "YouTube", age_min: 3, age_max: 6 },
  { channel_name: "Peekaboo Kidz", platform: "YouTube", age_min: 3, age_max: 6 },
];

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase
    .from("approved_channels")
    .upsert(APPROVED_CHANNELS, { onConflict: "channel_name" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, seeded: APPROVED_CHANNELS.length });
}
