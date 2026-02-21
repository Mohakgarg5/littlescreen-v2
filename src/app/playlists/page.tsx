"use client";

import { useState } from "react";
import { Search, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { MOMENTS, AGE_GROUPS, SAMPLE_PLAYLISTS, Moment, AgeGroup } from "@/lib/data";
import PlaylistCard from "@/components/PlaylistCard";

export default function PlaylistsPage() {
  const [activeMoment, setActiveMoment] = useState<Moment | "all">("all");
  const [activeAge, setActiveAge] = useState<AgeGroup>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"saves" | "recent" | "videos">("saves");

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

      {/* Playlists Grid — Parent Pick Discover Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filtered.length > 0 ? (
          <>
            {/* Featured / Hero playlist */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={15} className="text-amber-500" />
                <span className="text-sm font-bold text-gray-700">Most Saved This Week</span>
              </div>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${filtered[0].gradient} p-6 md:p-8 text-white cursor-pointer group`}>
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
                    <h2 className="font-black text-2xl sm:text-3xl leading-tight mb-2">{filtered[0].title}</h2>
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
                  <button className="flex-shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                    Open Playlist →
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary featured row (2-wide) */}
            {filtered.length >= 3 && (
              <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filtered.slice(1, 3).map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} variant="featured" />
                  ))}
                </div>
              </div>
            )}

            {/* Section heading */}
            {filtered.length > 3 && (
              <>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="font-black text-gray-900 text-lg">All Playlists</h3>
                  <span className="text-sm text-gray-400">{filtered.length - 3} more</span>
                </div>
                {/* Main grid — 4 columns like the discover layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.slice(3).map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} variant="default" />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-20">
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

      {/* Create Playlist CTA */}
      <div className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-3xl mb-3">🎵</div>
          <h3 className="font-black text-gray-900 text-lg mb-2">Create your own playlist</h3>
          <p className="text-gray-500 text-sm mb-4">
            Save your favorite parent picks into a personal playlist — bedtime, travel, learning, whatever you need.
          </p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-md">
            <Sparkles size={14} />
            Start a New Playlist
          </button>
        </div>
      </div>
    </div>
  );
}
