"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, BookOpen, Sparkles, CheckCircle2, Plus, Loader2, Trash2 } from "lucide-react";
import { MOMENTS, AGE_GROUPS, SAMPLE_PLAYLISTS, Moment, AgeGroup } from "@/lib/data";
import PlaylistCard from "@/components/PlaylistCard";
import { useAuth } from "@/lib/AuthContext";

interface UserPlaylist {
  id: string;
  name: string;
  description?: string;
  moment?: string;
  age_group?: string;
  is_public: boolean;
  saves: number;
  tags: string[];
  item_count: number;
  created_at: string;
}

export default function PlaylistsPage() {
  const { user } = useAuth();
  const [activeMoment, setActiveMoment] = useState<Moment | "all">("all");
  const [activeAge, setActiveAge] = useState<AgeGroup>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"saves" | "recent" | "videos">("saves");
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [loadingUserPlaylists, setLoadingUserPlaylists] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoadingUserPlaylists(true);
    fetch("/api/playlists")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUserPlaylists(data);
      })
      .catch(() => {})
      .finally(() => setLoadingUserPlaylists(false));
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this playlist?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/playlists/${id}`, { method: "DELETE" });
      setUserPlaylists((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = SAMPLE_PLAYLISTS
    .filter((pl) => {
      const matchesMoment = activeMoment === "all" || pl.moments.includes(activeMoment as Moment);
      const matchesAge = activeAge === "all" || pl.ageGroups.includes(activeAge);
      const matchesSearch =
        !searchQuery ||
        pl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pl.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMoment && matchesAge && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "saves") return b.saves - a.saves;
      if (sortBy === "videos") return b.itemCount - a.itemCount;
      return 0;
    });

  const activeMomentData = MOMENTS.find((m) => m.id === activeMoment);

  const momentEmojis: Record<string, string> = {
    bedtime: "🌙", travel: "✈️", calm: "🌿", "sick-day": "🤒",
    restaurant: "🍕", learning: "📚", active: "💃", morning: "☀️",
  };

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-violet-600" />
                <span className="text-violet-600 text-sm font-semibold uppercase tracking-wider">Browse</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Playlists</h1>
              <p className="text-gray-500 text-sm mt-1">
                {filtered.length} curated playlists by real parents
                {activeMoment !== "all" && activeMomentData && (
                  <span> · {activeMomentData.emoji} {activeMomentData.label}</span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-violet-300"
                >
                  <option value="saves">Most Saved</option>
                  <option value="videos">Most Videos</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
              {/* Create button */}
              <Link
                href="/playlists/create"
                className="flex items-center gap-1.5 bg-[#C07A4A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#A8633A] transition-colors shadow-sm"
              >
                <Plus size={14} /> New Playlist
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search playlists by name, moment, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#FEFAF5] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100 transition-all"
            />
          </div>

          {/* Moment filters */}
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex gap-2 pb-1 min-w-max">
              <button
                onClick={() => setActiveMoment("all")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                  activeMoment === "all"
                    ? "bg-violet-600 text-white border-violet-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-violet-200 hover:text-violet-600"
                }`}
              >
                ✨ All Moments
              </button>
              {MOMENTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMoment(m.id === activeMoment ? "all" : m.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
                    activeMoment === m.id
                      ? "text-white border-transparent shadow-md"
                      : "bg-white text-gray-600 border-gray-200 hover:border-violet-200 hover:text-violet-500"
                  }`}
                  style={
                    activeMoment === m.id
                      ? { backgroundColor: m.color, borderColor: m.color }
                      : {}
                  }
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Age filters */}
          <div className="flex flex-wrap gap-2 mt-3">
            {AGE_GROUPS.map((ag) => (
              <button
                key={ag.id}
                onClick={() => setActiveAge(ag.id === activeAge ? "all" : ag.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  activeAge === ag.id
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {ag.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active moment banner */}
      {activeMoment !== "all" && activeMomentData && (
        <div className="py-4 px-4" style={{ backgroundColor: activeMomentData.bg }}>
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-3xl">{activeMomentData.emoji}</span>
            <div>
              <h2 className="font-bold text-gray-900 text-base">{activeMomentData.label}</h2>
              <p className="text-sm text-gray-600">Playlists curated for this moment</p>
            </div>
            <button
              onClick={() => setActiveMoment("all")}
              className="ml-auto text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white/80 px-3 py-1.5 rounded-lg border border-white/50"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* ── Your Playlists Section ── */}
        {user && (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎵</span>
                <h2 className="font-black text-gray-900 text-lg">Your Playlists</h2>
                {userPlaylists.length > 0 && (
                  <span className="bg-[#F3E3D3] text-[#C07A4A] text-xs font-bold px-2 py-0.5 rounded-full">
                    {userPlaylists.length}
                  </span>
                )}
              </div>
              <Link
                href="/playlists/create"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#C07A4A] hover:text-[#A8633A]"
              >
                <Plus size={14} /> Create new
              </Link>
            </div>

            {loadingUserPlaylists ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-6">
                <Loader2 size={16} className="animate-spin" /> Loading your playlists…
              </div>
            ) : userPlaylists.length === 0 ? (
              <Link href="/playlists/create" className="block">
                <div className="border-2 border-dashed border-[#E8E1D6] rounded-2xl p-8 text-center hover:border-[#C07A4A]/50 hover:bg-[#F7F2EB] transition-all group">
                  <div className="text-4xl mb-3">📋</div>
                  <div className="font-semibold text-gray-600 group-hover:text-[#C07A4A] mb-1">Create your first playlist</div>
                  <div className="text-sm text-gray-400">Curate videos for bedtime, travel, learning & more</div>
                </div>
              </Link>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {userPlaylists.map((pl) => (
                  <div key={pl.id} className="relative group">
                    <Link href={`/playlists/${pl.id}`}>
                      <div className="bg-white rounded-2xl border border-[#E8E1D6] p-5 shadow-sm hover:shadow-md hover:border-[#C07A4A]/40 transition-all h-full">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center text-lg">
                            {pl.moment ? momentEmojis[pl.moment] || "🎵" : "🎵"}
                          </div>
                          <div className="flex items-center gap-1">
                            {pl.is_public ? (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Public</span>
                            ) : (
                              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">Private</span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-bold text-[#2D1F0E] text-sm mb-1 line-clamp-2">{pl.name}</h3>
                        {pl.description && (
                          <p className="text-xs text-[#8A7060] mb-2 line-clamp-2">{pl.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {pl.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-[#C07A4A] bg-[#F3E3D3] px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-[#B09A88]">
                          {pl.item_count} video{pl.item_count !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </Link>
                    {/* Delete button */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleDelete(pl.id); }}
                      disabled={deletingId === pl.id}
                      className="absolute top-3 right-10 opacity-0 group-hover:opacity-100 p-1.5 bg-white border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm"
                      title="Delete playlist"
                    >
                      {deletingId === pl.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                ))}

                {/* Add new card */}
                <Link href="/playlists/create">
                  <div className="border-2 border-dashed border-[#E8E1D6] rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-full min-h-[160px] hover:border-[#C07A4A]/50 hover:bg-[#F7F2EB] transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-[#F3E3D3] flex items-center justify-center group-hover:bg-[#EDD5B8] transition-all">
                      <Plus size={18} className="text-[#C07A4A]" />
                    </div>
                    <span className="text-xs font-semibold text-[#C07A4A]">New Playlist</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ── Community Playlists Section ── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-violet-600" />
            <h2 className="font-black text-gray-900 text-lg">Community Playlists</h2>
          </div>

          {filtered.length > 0 ? (
            <>
              {/* Featured / Hero playlist */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={15} className="text-amber-500" />
                  <span className="text-sm font-bold text-gray-700">Most Saved This Week</span>
                </div>
                <Link href={`/playlists/${filtered[0].id}`} className="block group">
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${filtered[0].gradient} p-6 md:p-8 text-white`}>
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-white/10 rounded-full" />
                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <span className="text-7xl animate-float">{filtered[0].coverEmoji}</span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="flex items-center gap-1 bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            <CheckCircle2 size={11} />
                            Parent Verified
                          </span>
                          {filtered[0].ageGroups.slice(0, 3).map((age) => (
                            <span key={age} className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">
                              {age}y
                            </span>
                          ))}
                        </div>
                        <h2 className="font-black text-2xl sm:text-3xl leading-tight mb-2 group-hover:underline underline-offset-2">{filtered[0].title}</h2>
                        <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-3 max-w-lg">
                          {filtered[0].description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                          <span className="font-semibold text-white">{filtered[0].itemCount} videos</span>
                          <span>·</span>
                          <span>{filtered[0].saves.toLocaleString()} saves</span>
                          <span>·</span>
                          <span>by {filtered[0].createdBy}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {filtered[0].tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="bg-white/20 text-white/90 text-xs px-2.5 py-1 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="flex-shrink-0 bg-white/20 group-hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                        Open Playlist →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secondary featured row */}
              {filtered.length >= 3 && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filtered.slice(1, 3).map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} variant="featured" />
                    ))}
                  </div>
                </div>
              )}

              {filtered.length > 3 && (
                <>
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <h3 className="font-black text-gray-900 text-lg">All Community Playlists</h3>
                    <span className="text-sm text-gray-400">{filtered.length - 3} more</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.slice(3).map((playlist) => (
                      <PlaylistCard key={playlist.id} playlist={playlist} variant="default" />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="font-bold text-gray-700 text-lg mb-2">No playlists found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => { setActiveMoment("all"); setActiveAge("all"); setSearchQuery(""); }}
                className="text-sm font-semibold text-violet-600 hover:text-violet-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Playlist CTA */}
      <div className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-3">🎵</div>
          <h3 className="font-black text-gray-900 text-lg mb-2">Create your own playlist</h3>
          <p className="text-gray-500 text-sm mb-4">
            Save your favorite parent picks into a personal playlist — bedtime, travel, learning, whatever you need.
          </p>
          <Link
            href="/playlists/create"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <Sparkles size={14} />
            Start a New Playlist
          </Link>
        </div>
      </div>
    </div>
  );
}
