import { NextRequest, NextResponse } from "next/server";

const API = "https://nuventionmedia.vercel.app";
const MAX_VIDEOS = 500;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");

    const upstream = new URL(`${API}/api/videos`);
    if (category) upstream.searchParams.set("category", category);
    if (tag) upstream.searchParams.set("tag", tag);
    if (ageMin) upstream.searchParams.set("ageMin", ageMin);
    if (ageMax) upstream.searchParams.set("ageMax", ageMax);

    const res = await fetch(upstream.toString(), {
      next: { revalidate: 1800 }, // 30 min cache
    });

    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }

    const data = await res.json();

    // Upstream returns { videos: [...] } or a plain array
    const raw: unknown[] = Array.isArray(data) ? data : (Array.isArray(data?.videos) ? data.videos : []);

    // Cap at 500 videos, sorted by parentRating desc (rated ones first)
    const sorted = raw
      .sort((a: { parentRating: number }, b: { parentRating: number }) => b.parentRating - a.parentRating)
      .slice(0, MAX_VIDEOS);

    return NextResponse.json(sorted);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
