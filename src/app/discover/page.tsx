"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, CheckCircle2, TrendingUp, Sparkles, Play } from "lucide-react";
import { MOMENTS, AGE_GROUPS, SAMPLE_PLAYLISTS, Moment, AgeGroup } from "@/lib/data";
import { fetchVideos, videoMatchesAge, Video } from "@/lib/videos";
import VideoCard from "@/components/VideoCard";
import VideoModal from "@/components/VideoModal";
import ContentCard from "@/components/ContentCard";
import PlaylistCard from "@/components/PlaylistCard";

type TabType = "videos" | "picks" | "playlists";

export default function DiscoverPage() {
  const [tab, setTab] = useState<TabType>("videos");
  const [activeMoment, setActiveMoment] = useState<Moment | "all">("all");
  const [activeAge, setActiveAge] = useState<AgeGroup>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredVideo, setFeaturedVideo] = useState<Video | null>(null);
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);

  useEffect(() => {
    fetchVideos().then((data) => {
      setVideos(data);
      setLoading(false);
      // Pick featured: highest rated with most reviews
      const best = [...data].sort(
        (a, b) => b.parentRating * b.reviewCount - a.parentRating * a.reviewCount
      )[0];
      if (best) setFeaturedVideo(best);
    });
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(videos.map((v) => v.category));
    return ["all", ...Array.from(cats)];
  }, [videos]);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      const matchesMoment = activeMoment === "all" || v.moments.includes(activeMoment as Moment);
      const matchesAge = videoMatchesAge(v, activeAge);
      const matchesCat = activeCategory === "all" || v.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesMoment && matchesAge && matchesCat && matchesSearch;
    });
  }, [videos, activeMoment, activeAge, activeCategory, searchQuery]);

  const filteredPlaylists = SAMPLE_PLAYLISTS.filter((pl) => {
    const matchesMoment = activeMoment === "all" || pl.moments.includes(activeMoment as Moment);
    const matchesAge = activeAge === "all" || pl.ageGroups.includes(activeAge);
    const matchesSearch =
      !searchQuery ||
      pl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pl.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMoment && matchesAge && matchesSearch;
  });

  const activeMomentData = MOMENTS.find((m) => m.id === activeMoment);

  const FilterBar = () => (
    <div className="space-y-3">
      {/* Moment filters */}
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-2 pb-1 min-w-max">
          <button
            onClick={() => setActiveMoment("all")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border ${
              activeMoment === "all"
                ? "bg-orange-500 text-white border-orange-500 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-500"
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
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-200 hover:text-orange-500"
              }`}
              style={activeMoment === m.id ? { backgroundColor: m.color, borderColor: m.color } : {}}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age + Category row */}
      <div className="flex flex-wrap gap-2">
        {AGE_GROUPS.map((ag) => (
          <button
            key={ag.id}
            onClick={() => setActiveAge(ag.id === activeAge ? "all" : ag.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              activeAge === ag.id
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : "bg-white text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600"
            }`}
          >
            {ag.label}
          </button>
        ))}
        {tab === "videos" && (
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-gray-200 flex-wrap">
            <SlidersHorizontal size={12} className="text-gray-400" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? "all" : cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-orange-500" />
                <span className="text-orange-500 text-sm font-semibold uppercase tracking-wider">Parent Picks</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Discover</h1>
              <p className="text-gray-500 text-sm mt-1">
                {tab === "videos"
                  ? loading
                    ? "Loading parent-verified videos..."
                    : `${filteredVideos.length} parent-verified videos`
                  : tab === "picks"
                  ? "6 curated parent picks"
                  : `${filteredPlaylists.length} playlists`}
                {activeMoment !== "all" && activeMomentData && (
                  <span> · {activeMomentData.emoji} {activeMomentData.label}</span>
                )}
              </p>
            </div>

            {/* Tab switcher */}
            <div className="flex items-center bg-gray-100 rounded-xl p-1">
              {(["videos", "picks", "playlists"] as TabType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                    tab === t ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t === "videos" ? "🎬 Videos" : t === "picks" ? "⭐ Picks" : "🎵 Playlists"}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={
                tab === "videos"
                  ? "Search videos, channels, tags..."
                  : "Search content, tags, moments..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#FEFAF5] border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          <FilterBar />
        </div>
      </div>

      {/* Active moment banner */}
      {activeMoment !== "all" && activeMomentData && (
        <div className="py-4 px-4" style={{ backgroundColor: activeMomentData.bg }}>
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <span className="text-3xl">{activeMomentData.emoji}</span>
            <div>
              <h2 className="font-bold text-gray-900 text-base">{activeMomentData.label}</h2>
              <p className="text-sm text-gray-600">Showing parent-verified picks for this moment</p>
            </div>
            <button
              onClick={() => setActiveMoment("all")}
              className="ml-auto text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white/80 px-3 py-1.5 rounded-lg border border-white/50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── VIDEOS TAB ── */}
        {tab === "videos" && (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                    <div className="shimmer w-full" style={{ paddingBottom: "56.25%" }} />
                    <div className="p-4 space-y-2">
                      <div className="shimmer h-4 rounded-lg w-3/4" />
                      <div className="shimmer h-3 rounded-lg w-1/2" />
                      <div className="shimmer h-3 rounded-lg w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Featured video hero */}
                {featuredVideo && !searchQuery && activeMoment === "all" && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={15} className="text-amber-500" />
                      <span className="text-sm font-bold text-gray-700">Top Rated by Parents</span>
                    </div>
                    <div
                      className="relative overflow-hidden rounded-2xl cursor-pointer group shadow-lg"
                      onClick={() => setFeaturedModalOpen(true)}
                    >
                      {/* Thumbnail bg */}
                      <div className="relative w-full overflow-hidden" style={{ maxHeight: "320px" }}>
                        <img
                          src={featuredVideo.thumbnailUrl}
                          alt={featuredVideo.title}
                          className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                            <Play size={24} className="text-orange-500 fill-orange-500 ml-1" />
                          </div>
                        </div>
                        {/* Info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={13} className="text-emerald-400" />
                            <span className="text-white/80 text-xs font-semibold">Parent Verified</span>
                            <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-auto">
                              Ages {featuredVideo.ageMin}–{featuredVideo.ageMax}
                            </span>
                          </div>
                          <h2 className="text-white font-black text-xl sm:text-2xl leading-tight mb-1">
                            {featuredVideo.title}
                          </h2>
                          <p className="text-white/70 text-sm">{featuredVideo.channelName}</p>
                          {featuredVideo.parentRating > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-sm ${i < Math.floor(featuredVideo.parentRating) ? "text-amber-400" : "text-white/30"}`}>★</span>
                                ))}
                              </div>
                              <span className="text-white font-bold text-sm">{featuredVideo.parentRating}</span>
                              <span className="text-white/60 text-xs">({featuredVideo.reviewCount} reviews)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {featuredModalOpen && (
                      <VideoModal video={featuredVideo} onClose={() => setFeaturedModalOpen(false)} />
                    )}
                  </div>
                )}

                {/* Video grid */}
                {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {(searchQuery || activeMoment !== "all" ? filteredVideos : filteredVideos).map(
                      (video) => (
                        <VideoCard key={video.id} video={video} variant="featured" />
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No videos found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search</p>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── PICKS TAB ── */}
        {tab === "picks" && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={15} className="text-amber-500" />
                <span className="text-sm font-bold text-gray-700">Top Community Pick</span>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-violet-600 p-6 text-white">
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-12 -left-6 w-32 h-32 bg-white/10 rounded-full" />
                <div className="relative flex items-center gap-5">
                  <span className="text-6xl">🎵</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={14} />
                      <span className="text-xs font-semibold">Parent Verified</span>
                    </div>
                    <h3 className="font-black text-xl mb-1">Songs for Littles – Ms. Rachel</h3>
                    <p className="text-white/80 text-sm">Speech therapist-approved. Best for language development.</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="font-bold">94% say it worked</span>
                      <span className="text-white/60">·</span>
                      <span className="text-white/80">2,847 reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { emoji: "🐕", title: "Bluey — Best Calm Episodes", platform: "Disney+", rating: 4.8, reviews: 1923, worked: 97, age: "3-6", cat: "Social Skills" },
                { emoji: "🌙", title: "CoComelon Bedtime Songs Only", platform: "YouTube", rating: 4.2, reviews: 3201, worked: 81, age: "1-2", cat: "Calming" },
                { emoji: "🧘", title: "Cosmic Kids Yoga", platform: "YouTube", rating: 4.7, reviews: 1567, worked: 89, age: "2-5", cat: "Motor Skills" },
                { emoji: "🐯", title: "Daniel Tiger's Neighborhood", platform: "PBS Kids", rating: 4.8, reviews: 2134, worked: 93, age: "2-5", cat: "Social Skills" },
                { emoji: "🔢", title: "Numberblocks", platform: "Netflix", rating: 4.9, reviews: 1342, worked: 96, age: "2-5", cat: "Educational" },
              ].map((item) => (
                <div key={item.title} className="card-lift bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-50 to-violet-50 flex items-center justify-center text-3xl">
                      {item.emoji}
                    </div>
                    <div>
                      <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">{item.cat}</span>
                      <p className="text-xs text-gray-400 mt-0.5">{item.platform} · Ages {item.age}</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>★ {item.rating} ({item.reviews.toLocaleString()})</span>
                    <span className="text-emerald-600 font-semibold">{item.worked}% worked</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PLAYLISTS TAB ── */}
        {tab === "playlists" && (
          <>
            {filteredPlaylists.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={15} className="text-amber-500" />
                  <span className="text-sm font-bold text-gray-700">Most Saved Playlist</span>
                </div>
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${filteredPlaylists[0].gradient} p-6 text-white`}>
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-12 -left-6 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="relative flex items-center gap-5">
                    <span className="text-6xl">{filteredPlaylists[0].coverEmoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={14} /><span className="text-xs font-semibold">Parent Verified</span>
                      </div>
                      <h3 className="font-black text-xl mb-1">{filteredPlaylists[0].title}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{filteredPlaylists[0].description}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span>{filteredPlaylists[0].itemCount} videos</span>
                        <span className="text-white/60">·</span>
                        <span>{filteredPlaylists[0].saves.toLocaleString()} saves</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredPlaylists.slice(1).map((pl) => (
                <PlaylistCard key={pl.id} playlist={pl} variant="featured" />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-black text-gray-900 text-lg mb-2">Know something that worked?</h3>
          <p className="text-gray-500 text-sm mb-4">
            Add your own parent pick and help thousands of other parents find what actually works.
          </p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-violet-600 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-md">
            <Sparkles size={14} />
            Share a Parent Pick
          </button>
        </div>
      </div>
    </div>
  );
}
