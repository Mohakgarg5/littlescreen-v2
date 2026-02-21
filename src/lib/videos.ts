import { Moment } from "./data";

export interface APIVideo {
  id: number;
  youtubeId: string;
  title: string;
  description: string;
  channelName: string;
  ageMin: number;
  ageMax: number;
  category: string;
  tags: string; // JSON-encoded array
  thumbnailUrl: string;
  parentRating: number;
  reviewCount: number;
  stimulationLevel: number | null;
  createdAt: string;
}

export interface Video extends Omit<APIVideo, "tags"> {
  tags: string[];
  moments: Moment[];
}

// Map API tags + categories → our moment system
const TAG_TO_MOMENT: Record<string, Moment> = {
  "Bedtime Wind-Down": "bedtime",
  "Travel": "travel",
  "Tantrum Moments": "calm",
  "Public Reset": "restaurant",
  "Meal Prep": "morning",
  "Skill Bridge": "learning",
};

const CATEGORY_TO_MOMENT: Record<string, Moment> = {
  Calming: "calm",
  Educational: "learning",
  "Motor Skills": "active",
  Creative: "active",
  "Social Skills": "learning",
};

function inferMoments(tags: string[], category: string): Moment[] {
  const moments = new Set<Moment>();
  for (const tag of tags) {
    if (TAG_TO_MOMENT[tag]) moments.add(TAG_TO_MOMENT[tag]);
  }
  if (CATEGORY_TO_MOMENT[category]) moments.add(CATEGORY_TO_MOMENT[category]);
  if (moments.size === 0) moments.add("learning"); // fallback
  return Array.from(moments);
}

export function normalizeVideo(v: APIVideo): Video {
  let tags: string[] = [];
  try {
    tags = JSON.parse(v.tags);
  } catch {
    tags = [];
  }
  return {
    ...v,
    tags,
    moments: inferMoments(tags, v.category),
  };
}

export async function fetchVideos(params?: {
  category?: string;
  tag?: string;
  ageMin?: number;
  ageMax?: number;
}): Promise<Video[]> {
  try {
    // Use our proxy route (capped at 500, sorted by rating)
    const url = new URL("/api/videos", typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
    if (params?.category) url.searchParams.set("category", params.category);
    if (params?.tag) url.searchParams.set("tag", params.tag);
    if (params?.ageMin) url.searchParams.set("ageMin", String(params.ageMin));
    if (params?.ageMax) url.searchParams.set("ageMax", String(params.ageMax));

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return [];
    const data: APIVideo[] = await res.json();
    return data.map(normalizeVideo);
  } catch {
    return [];
  }
}

// Age range to our group labels
export function videoMatchesAge(video: Video, ageGroup: string): boolean {
  if (ageGroup === "all") return true;
  const [minStr, maxStr] = ageGroup.split("-");
  const min = parseInt(minStr);
  const max = parseInt(maxStr);
  return video.ageMin <= max && video.ageMax >= min;
}
