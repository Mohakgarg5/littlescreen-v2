"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles, PlusCircle, TrendingUp, BookOpen, Filter } from "lucide-react";
import { COMMUNITY_POSTS } from "@/lib/community";
import { MOMENTS, AGE_GROUPS, Moment, AgeGroup } from "@/lib/data";
import WhatWorkedCard from "@/components/WhatWorkedCard";
import Link from "next/link";

const SORT_OPTIONS = [
  { value: "saves", label: "Most Saved" },
  { value: "likes", label: "Most Liked" },
  { value: "recent", label: "Most Recent" },
];

export default function CommunityPage() {
  const [activeMoment, setActiveMoment] = useState<Moment | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("saves");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let posts = COMMUNITY_POSTS.filter((p) => {
      const matchMoment = activeMoment === "all" || p.moment === activeMoment;
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.body.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchMoment && matchSearch;
    });

    if (sort === "saves") posts = [...posts].sort((a, b) => b.saves - a.saves);
    else if (sort === "likes") posts = [...posts].sort((a, b) => b.likes - a.likes);
    return posts;
  }, [activeMoment, search, sort]);

  const topPost = filtered[0];
  const restPosts = filtered.slice(1);
  const momentData = MOMENTS.find((m) => m.id === activeMoment);

  return (
    <div className="min-h-screen bg-[#F7F2EB]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E1D6]">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Title */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={15} className="text-[#C07A4A]" />
                <span className="text-[#C07A4A] text-sm font-semibold uppercase tracking-wider">
                  Community Knowledge
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#2D1F0E]">
                What Worked For My Kid
              </h1>
              <p className="text-[#8A7060] text-sm mt-1.5 max-w-lg">
                Real parent experiences — screen time, products, routines, and resources that
                actually solved the problem. No fluff, no sponsored content.
              </p>
            </div>
            <button className="hidden sm:flex flex-shrink-0 items-center gap-2 bg-[#C07A4A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A8633A] transition-colors shadow-sm">
              <PlusCircle size={15} />
              Share What Worked
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B09A88]" />
            <input
              type="text"
              placeholder="Search by moment, product, show, or tip..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A]/60 focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
            />
          </div>

          {/* Sort + filter toggle row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
              <button
                onClick={() => setActiveMoment("all")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  activeMoment === "all"
                    ? "bg-[#C07A4A] text-white border-[#C07A4A] shadow-sm"
                    : "bg-white text-[#8A7060] border-[#E8E1D6] hover:border-[#C07A4A]/50 hover:text-[#C07A4A]"
                }`}
              >
                ✨ All Moments
              </button>
              {MOMENTS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMoment(m.id === activeMoment ? "all" : m.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    activeMoment === m.id
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-[#8A7060] border-[#E8E1D6] hover:border-[#C07A4A]/50 hover:text-[#C07A4A]"
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
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-[#E8E1D6] rounded-xl px-3 py-2 bg-white text-[#8A7060] focus:outline-none focus:border-[#C07A4A]/60"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Active moment banner */}
      {activeMoment !== "all" && momentData && (
        <div className="py-3 px-4 border-b border-[#E8E1D6]" style={{ backgroundColor: momentData.bg }}>
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <span className="text-2xl">{momentData.emoji}</span>
            <div>
              <p className="font-semibold text-[#2D1F0E] text-sm">{momentData.label}</p>
              <p className="text-xs text-[#8A7060]">{filtered.length} posts from parents</p>
            </div>
            <button
              onClick={() => setActiveMoment("all")}
              className="ml-auto text-xs text-[#8A7060] hover:text-[#2D1F0E] bg-white/80 px-3 py-1.5 rounded-lg border border-white/60 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {filtered.length > 0 ? (
          <div className="space-y-5">
            {/* Top post — slightly highlighted */}
            {topPost && (
              <div className="relative">
                <div className="absolute -top-3 left-4 z-10">
                  <span className="flex items-center gap-1.5 bg-[#C07A4A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <TrendingUp size={11} />
                    Most Saved
                  </span>
                </div>
                <div className="pt-4">
                  <WhatWorkedCard post={topPost} />
                </div>
              </div>
            )}

            {/* Divider */}
            {restPosts.length > 0 && (
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[#E8E1D6]" />
                <span className="text-xs text-[#B09A88] font-medium">{restPosts.length} more posts</span>
                <div className="flex-1 h-px bg-[#E8E1D6]" />
              </div>
            )}

            {/* Rest of posts */}
            {restPosts.map((post) => (
              <WhatWorkedCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💭</div>
            <h3 className="font-bold text-[#4A3728] text-lg mb-2">No posts found</h3>
            <p className="text-[#8A7060] text-sm mb-4">Try a different moment or clear your search</p>
            <button
              onClick={() => { setActiveMoment("all"); setSearch(""); }}
              className="text-sm font-semibold text-[#C07A4A] hover:text-[#A8633A]"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* CTA to share */}
        <div className="mt-10 bg-white rounded-2xl border border-[#E8E1D6] p-6 text-center shadow-sm">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-black text-[#2D1F0E] text-lg mb-2">
            Found something that worked?
          </h3>
          <p className="text-[#8A7060] text-sm mb-4 max-w-md mx-auto">
            Share your experience with linked resources — YouTube videos, Amazon products,
            books, apps. Help other parents skip the trial and error.
          </p>
          <button className="inline-flex items-center gap-2 bg-[#C07A4A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A8633A] transition-colors shadow-sm">
            <PlusCircle size={15} />
            Share What Worked For My Kid
          </button>
          <p className="text-xs text-[#B09A88] mt-3">No sponsored content · No ads · Parent-verified only</p>
        </div>
      </div>
    </div>
  );
}
