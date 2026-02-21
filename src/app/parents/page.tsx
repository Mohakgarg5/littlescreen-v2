"use client";

import { useState } from "react";
import { Search, Users, Sparkles, TrendingUp } from "lucide-react";
import { SAMPLE_PARENTS } from "@/lib/parents";
import { SAMPLE_PLAYLISTS } from "@/lib/data";
import ParentCard from "@/components/ParentCard";
import PlaylistCard from "@/components/PlaylistCard";
import { useFollow } from "@/lib/FollowContext";

export default function CommunityPage() {
  const [tab, setTab] = useState<"discover" | "following">("discover");
  const [search, setSearch] = useState("");
  const { following } = useFollow();

  const filteredParents = SAMPLE_PARENTS.filter(
    (p) =>
      !search ||
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.bio.toLowerCase().includes(search.toLowerCase()) ||
      p.badges.some((b) => b.toLowerCase().includes(search.toLowerCase()))
  );

  const followingParents = SAMPLE_PARENTS.filter((p) => following.has(p.username));

  const followingPlaylists = SAMPLE_PLAYLISTS.filter((pl) =>
    followingParents.some((p) =>
      p.playlists.some((pp) => pp.id === pl.id)
    )
  );

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Users size={16} className="text-orange-500" />
                <span className="text-orange-500 text-sm font-semibold uppercase tracking-wider">Community</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Parent Profiles</h1>
              <p className="text-gray-500 text-sm mt-1">
                Follow parents whose picks you trust — see their new playlists in your feed.
              </p>
            </div>
            {following.size > 0 && (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
                <span className="text-orange-600 font-bold text-sm">{following.size}</span>
                <span className="text-orange-600 text-sm">following</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 w-fit mb-5">
            <button
              onClick={() => setTab("discover")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === "discover" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Discover Parents
            </button>
            <button
              onClick={() => setTab("following")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                tab === "following" ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Following
              {following.size > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {following.size}
                </span>
              )}
            </button>
          </div>

          {/* Search */}
          {tab === "discover" && (
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search parents by name, specialty, badges..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FEFAF5] border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {tab === "discover" ? (
          <>
            {/* Top parent spotlight */}
            {filteredParents.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={15} className="text-orange-500" />
                  <span className="text-sm font-bold text-gray-700">Most Followed This Month</span>
                </div>
                {/* Hero parent */}
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${filteredParents[filteredParents.length - 1].gradient} p-6 text-white mb-2`}>
                  <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-12 -left-6 w-32 h-32 bg-white/10 rounded-full" />
                  <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-5xl flex-shrink-0 border-2 border-white/30">
                      {filteredParents[filteredParents.length - 1].avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {filteredParents[filteredParents.length - 1].badges.map((b) => (
                          <span key={b} className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            {b}
                          </span>
                        ))}
                      </div>
                      <h2 className="font-black text-2xl mb-1">
                        {filteredParents[filteredParents.length - 1].displayName}
                      </h2>
                      <p className="text-white/80 text-sm mb-3 max-w-lg">
                        {filteredParents[filteredParents.length - 1].bio}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <span><strong className="text-white">{filteredParents[filteredParents.length - 1].followers.toLocaleString()}</strong> followers</span>
                        <span><strong className="text-white">{filteredParents[filteredParents.length - 1].playlistCount}</strong> playlists</span>
                        <span>{filteredParents[filteredParents.length - 1].kidsAges}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Parent grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredParents.map((parent) => (
                <ParentCard key={parent.username} parent={parent} />
              ))}
            </div>

            {filteredParents.length === 0 && (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="font-bold text-gray-700 text-lg mb-2">No parents found</h3>
                <p className="text-gray-500 text-sm">Try a different search</p>
              </div>
            )}
          </>
        ) : (
          // Following tab
          <>
            {following.size === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="font-black text-gray-800 text-xl mb-2">{"You're not following anyone yet"}</h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  Follow parents whose screen time picks you trust. Their new playlists will show up right here.
                </p>
                <button
                  onClick={() => setTab("discover")}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-violet-600 text-white px-6 py-3 rounded-2xl font-semibold hover:opacity-90 transition-opacity shadow-md"
                >
                  <Sparkles size={14} />
                  Discover Parents to Follow
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Followed parents chips */}
                <div>
                  <h2 className="font-black text-gray-900 text-lg mb-4">
                    Parents you follow ({followingParents.length})
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {followingParents.map((p) => (
                      <ParentCard key={p.username} parent={p} variant="compact" />
                    ))}
                  </div>
                </div>

                {/* Their playlists */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={15} className="text-amber-500" />
                    <h2 className="font-black text-gray-900 text-lg">
                      Playlists from people you follow
                    </h2>
                  </div>
                  {followingPlaylists.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {followingPlaylists.map((pl) => (
                        <PlaylistCard key={pl.id} playlist={pl} variant="featured" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No playlists from followed parents yet.</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
