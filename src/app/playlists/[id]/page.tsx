import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Bookmark, CheckCircle2, Share2, Users, Clock, Tag } from "lucide-react";
import { SAMPLE_PLAYLISTS, PARENT_PICKS, MOMENTS } from "@/lib/data";
import ContentCard from "@/components/ContentCard";
import PlaylistCard from "@/components/PlaylistCard";
import PlaylistItemsList from "@/components/PlaylistItemsList";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

interface UserPlaylist {
  id: string;
  name: string;
  description?: string;
  moment?: string;
  age_group?: string;
  is_public: boolean;
  saves: number;
  created_at: string;
  tags: string[];
  items: Array<{
    id: string;
    video_id: string;
    title: string;
    thumbnail_url?: string;
    channel_name?: string;
    position: number;
  }>;
}

async function getUserPlaylist(id: string): Promise<UserPlaylist | null> {
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("playlists")
      .select(`*, playlist_tags(tag), playlist_items(*)`)
      .eq("id", id)
      .single();

    if (!data) return null;

    return {
      ...data,
      tags: (data.playlist_tags || []).map((t: { tag: string }) => t.tag),
      items: (data.playlist_items || []).sort((a: { position: number }, b: { position: number }) => a.position - b.position),
    };
  } catch {
    return null;
  }
}

const momentEmojis: Record<string, string> = {
  bedtime: "🌙", travel: "✈️", calm: "🌿", "sick-day": "🤒",
  restaurant: "🍕", learning: "📚", active: "💃", morning: "☀️",
};

const GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-orange-400 to-rose-500",
  "from-teal-500 to-cyan-600",
  "from-indigo-500 to-blue-600",
];

export default async function PlaylistDetailPage({ params }: Props) {
  const { id } = await params;

  // Try sample playlists first
  const samplePlaylist = SAMPLE_PLAYLISTS.find((p) => p.id === id);

  if (samplePlaylist) {
    const relatedContent = PARENT_PICKS.filter((item) =>
      item.moments.some((m) => samplePlaylist.moments.includes(m))
    );
    const momentData = samplePlaylist.moments
      .map((m) => MOMENTS.find((x) => x.id === m))
      .filter(Boolean);
    const related = SAMPLE_PLAYLISTS.filter(
      (p) => p.id !== samplePlaylist.id && p.moments.some((m) => samplePlaylist.moments.includes(m))
    ).slice(0, 4);

    return (
      <div className="min-h-screen bg-[#FEFAF5]">
        {/* Hero */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${samplePlaylist.gradient} pt-6 pb-10 px-4`}>
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />
          <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="relative max-w-4xl mx-auto">
            <Link href="/playlists" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
              <ArrowLeft size={15} />
              Back to Playlists
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <span className="text-8xl animate-float">{samplePlaylist.coverEmoji}</span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {samplePlaylist.parentVerified && (
                    <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle2 size={11} />
                      Parent Verified
                    </span>
                  )}
                  {momentData.map((m) => m && (
                    <span key={m.id} className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}>
                      {m.emoji} {m.label}
                    </span>
                  ))}
                </div>
                <h1 className="font-black text-3xl sm:text-4xl text-white leading-tight mb-2">{samplePlaylist.title}</h1>
                <p className="text-white/80 text-base leading-relaxed mb-4 max-w-xl">{samplePlaylist.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1.5"><Clock size={13} />{samplePlaylist.itemCount} videos</span>
                  <span className="flex items-center gap-1.5"><Users size={13} />{samplePlaylist.saves.toLocaleString()} saves</span>
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={13} />by {samplePlaylist.createdBy}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button className="flex items-center gap-2 bg-white text-gray-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-md text-sm">
                <Bookmark size={15} /> Save Playlist
              </button>
              <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                <Share2 size={15} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><Tag size={12} />Ages:</span>
            {samplePlaylist.ageGroups.map((age) => (
              <span key={age} className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full font-medium">{age} yrs</span>
            ))}
            <span className="ml-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">Tags:</span>
            {samplePlaylist.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="font-black text-xl text-gray-900 mb-1">Videos in this playlist</h2>
          <p className="text-sm text-gray-500 mb-6">These are the parent-picks tagged for {samplePlaylist.moments.join(", ")}</p>
          {relatedContent.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
              {relatedContent.map((item) => <ContentCard key={item.id} item={item} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 mb-12">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 text-sm">No videos yet — be the first to add one!</p>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h2 className="font-black text-xl text-gray-900 mb-5">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((pl) => <PlaylistCard key={pl.id} playlist={pl} variant="default" />)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Try user playlist from Supabase
  const userPlaylist = await getUserPlaylist(id);
  if (!userPlaylist) notFound();

  const gradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const momentLabel = userPlaylist.moment ? (MOMENTS.find((m) => m.id === userPlaylist.moment)?.label || userPlaylist.moment) : null;
  const momentEmoji = userPlaylist.moment ? momentEmojis[userPlaylist.moment] || "🎵" : "🎵";

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      {/* Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} pt-6 pb-10 px-4`}>
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full" />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="relative max-w-4xl mx-auto">
          <Link href="/playlists" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft size={15} />
            Back to Playlists
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <span className="text-8xl animate-float">{momentEmoji}</span>
            <div className="flex-1">
              {momentLabel && (
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-white/20 text-white">
                    {momentEmoji} {momentLabel}
                  </span>
                  {userPlaylist.age_group && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white">{userPlaylist.age_group}y</span>
                  )}
                </div>
              )}
              <h1 className="font-black text-3xl sm:text-4xl text-white leading-tight mb-2">{userPlaylist.name}</h1>
              {userPlaylist.description && (
                <p className="text-white/80 text-base leading-relaxed mb-4 max-w-xl">{userPlaylist.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><Clock size={13} />{userPlaylist.items.length} videos</span>
                {userPlaylist.is_public && (
                  <span className="flex items-center gap-1.5"><Users size={13} />Public playlist</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="flex items-center gap-2 bg-white text-gray-800 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-md text-sm">
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Tags */}
      {(userPlaylist.tags.length > 0 || userPlaylist.age_group) && (
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2">
            {userPlaylist.age_group && (
              <>
                <span className="flex items-center gap-1.5 text-xs text-gray-500 font-medium"><Tag size={12} />Age:</span>
                <span className="text-xs bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-1 rounded-full font-medium">{userPlaylist.age_group} yrs</span>
              </>
            )}
            {userPlaylist.tags.length > 0 && (
              <>
                <span className="ml-2 flex items-center gap-1.5 text-xs text-gray-500 font-medium">Tags:</span>
                {userPlaylist.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-[#F3E3D3] text-[#C07A4A] px-2.5 py-1 rounded-full">#{tag}</span>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-black text-xl text-gray-900">Videos in this playlist</h2>
          <Link href="/discover" className="text-sm font-semibold text-[#C07A4A] hover:text-[#A8633A] transition-colors">
            + Add videos
          </Link>
        </div>
        <p className="text-sm text-gray-500 mb-6">{userPlaylist.items.length} video{userPlaylist.items.length !== 1 ? "s" : ""} curated by you</p>
        <PlaylistItemsList playlistId={userPlaylist.id} initialItems={userPlaylist.items} />
      </div>
    </div>
  );
}
