"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Sparkles, PlusCircle, TrendingUp, X, Loader2, CheckCircle2 } from "lucide-react";
import { COMMUNITY_POSTS, ResourceType } from "@/lib/community";
import { MOMENTS, AGE_GROUPS, Moment } from "@/lib/data";
import WhatWorkedCard from "@/components/WhatWorkedCard";

const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "saves", label: "Most Saved" },
  { value: "likes", label: "Most Liked" },
];

interface DbPost {
  id: string;
  user_name: string;
  title: string;
  body: string;
  moment?: string;
  age_group?: string;
  resources: { type: string; title: string; url: string }[];
  likes: number;
  saves: number;
  created_at: string;
}

function dbPostToCard(p: DbPost) {
  return {
    id: p.id,
    author: p.user_name,
    authorInitial: p.user_name.charAt(0).toUpperCase(),
    authorColor: "#C07A4A",
    childAge: p.age_group || "any age",
    moment: (p.moment as Moment) || ("calm" as Moment),
    title: p.title,
    body: p.body,
    resources: (p.resources || []).map((r) => ({ ...r, type: r.type as ResourceType })),
    likes: p.likes,
    saves: p.saves,
    createdAt: p.created_at,
    tags: [] as string[],
  };
}

export default function CommunityPage() {
  const [activeMoment, setActiveMoment] = useState<Moment | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [showShare, setShowShare] = useState(false);

  // DB posts
  const [dbPosts, setDbPosts] = useState<DbPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Share form
  const [shareTitle, setShareTitle] = useState("");
  const [shareBody, setShareBody] = useState("");
  const [shareMoment, setShareMoment] = useState("");
  const [shareAge, setShareAge] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetch("/api/community")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setDbPosts(data);
      })
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, []);

  const allPosts = useMemo(() => {
    const dbConverted = dbPosts.map(dbPostToCard);
    return [...dbConverted, ...COMMUNITY_POSTS];
  }, [dbPosts]);

  const filtered = useMemo(() => {
    let posts = allPosts.filter((p) => {
      const matchMoment = activeMoment === "all" || p.moment === activeMoment;
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.body.toLowerCase().includes(search.toLowerCase()) ||
        ("tags" in p && Array.isArray((p as { tags: string[] }).tags)
          ? (p as { tags: string[] }).tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
          : false);
      return matchMoment && matchSearch;
    });

    if (sort === "saves") posts = [...posts].sort((a, b) => b.saves - a.saves);
    else if (sort === "likes") posts = [...posts].sort((a, b) => b.likes - a.likes);
    return posts;
  }, [allPosts, activeMoment, search, sort]);

  const topPost = filtered[0];
  const restPosts = filtered.slice(1);
  const momentData = MOMENTS.find((m) => m.id === activeMoment);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareTitle.trim() || !shareBody.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: shareTitle.trim(),
          body: shareBody.trim(),
          moment: shareMoment || null,
          age_group: shareAge || null,
          resources: [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setDbPosts((prev) => [data, ...prev]);
      setSubmitted(true);
      setTimeout(() => {
        setShowShare(false);
        setSubmitted(false);
        setShareTitle("");
        setShareBody("");
        setShareMoment("");
        setShareAge("");
      }, 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EB]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8E1D6]">
        <div className="max-w-3xl mx-auto px-4 py-8">
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
            <button
              onClick={() => setShowShare(true)}
              className="hidden sm:flex flex-shrink-0 items-center gap-2 bg-[#C07A4A] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#A8633A] transition-colors shadow-sm"
            >
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

          {/* Sort + filter row */}
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
                  style={activeMoment === m.id ? { backgroundColor: m.color, borderColor: m.color } : {}}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>
            <div className="flex-shrink-0">
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
        {loadingPosts ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#C07A4A]" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-5">
            {topPost && (
              <div className="relative">
                <div className="absolute -top-3 left-4 z-10">
                  <span className="flex items-center gap-1.5 bg-[#C07A4A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    <TrendingUp size={11} />
                    {sort === "saves" ? "Most Saved" : sort === "likes" ? "Most Liked" : "Latest"}
                  </span>
                </div>
                <div className="pt-4">
                  <WhatWorkedCard post={topPost} />
                </div>
              </div>
            )}
            {restPosts.length > 0 && (
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-[#E8E1D6]" />
                <span className="text-xs text-[#B09A88] font-medium">{restPosts.length} more posts</span>
                <div className="flex-1 h-px bg-[#E8E1D6]" />
              </div>
            )}
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

        {/* Mobile CTA */}
        <div className="mt-10 bg-white rounded-2xl border border-[#E8E1D6] p-6 text-center shadow-sm">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="font-black text-[#2D1F0E] text-lg mb-2">Found something that worked?</h3>
          <p className="text-[#8A7060] text-sm mb-4 max-w-md mx-auto">
            Share your experience. Help other parents skip the trial and error.
          </p>
          <button
            onClick={() => setShowShare(true)}
            className="inline-flex items-center gap-2 bg-[#C07A4A] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#A8633A] transition-colors shadow-sm"
          >
            <PlusCircle size={15} />
            Share What Worked For My Kid
          </button>
          <p className="text-xs text-[#B09A88] mt-3">No sponsored content · No ads · Parent-verified only</p>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowShare(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E1D6]">
              <h2 className="font-black text-[#2D1F0E] text-lg">Share What Worked</h2>
              <button onClick={() => setShowShare(false)} className="p-2 text-[#8A7060] hover:text-[#2D1F0E] rounded-xl hover:bg-[#F7F2EB] transition-all">
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="px-6 py-12 text-center">
                <CheckCircle2 size={40} className="text-[#5E8F75] mx-auto mb-3" />
                <p className="font-bold text-[#2D1F0E] text-lg">Thank you!</p>
                <p className="text-[#8A7060] text-sm mt-1">Your post has been shared with the community.</p>
              </div>
            ) : (
              <form onSubmit={handleShare} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">
                    What worked? <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={shareTitle}
                    onChange={(e) => setShareTitle(e.target.value)}
                    placeholder="e.g. Cosmic Kids Yoga fixed our bedtime meltdowns"
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">
                    Tell us more <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={shareBody}
                    onChange={(e) => setShareBody(e.target.value)}
                    placeholder="What was the situation? What did you try? How did it help? The more detail, the more useful!"
                    required
                    rows={4}
                    maxLength={1000}
                    className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">Moment</label>
                    <select
                      value={shareMoment}
                      onChange={(e) => setShareMoment(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] focus:outline-none focus:border-[#C07A4A] transition-all"
                    >
                      <option value="">Any moment</option>
                      {MOMENTS.map((m) => (
                        <option key={m.id} value={m.id}>{m.emoji} {m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">Child&apos;s age</label>
                    <select
                      value={shareAge}
                      onChange={(e) => setShareAge(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] focus:outline-none focus:border-[#C07A4A] transition-all"
                    >
                      <option value="">Any age</option>
                      {AGE_GROUPS.filter((a) => a.id !== "all").map((a) => (
                        <option key={a.id} value={a.id}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                    <span>⚠️</span> {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !shareTitle.trim() || !shareBody.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Sharing…</>
                  ) : (
                    <><PlusCircle size={15} /> Share with the community</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
