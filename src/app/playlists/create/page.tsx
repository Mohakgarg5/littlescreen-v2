"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Loader2, BookOpen, Globe, Lock } from "lucide-react";
import { MOMENTS } from "@/lib/data";

const AGE_GROUPS = [
  { id: "1-2",  label: "1–2 years" },
  { id: "2-3",  label: "2–3 years" },
  { id: "3-4",  label: "3–4 years" },
  { id: "4-5",  label: "4–5 years" },
  { id: "5-6",  label: "5–6 years" },
  { id: "all",  label: "All ages" },
];

export default function CreatePlaylistPage() {
  const router = useRouter();
  const tagInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [moment, setMoment] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTag = () => {
    const cleaned = tagInput.trim().toLowerCase().replace(/^#/, "");
    if (cleaned && !tags.includes(cleaned) && tags.length < 10) {
      setTags((prev) => [...prev, cleaned]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Playlist name is required.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          moment: moment || undefined,
          age_group: ageGroup || undefined,
          is_public: isPublic,
          tags,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create playlist");

      router.push("/playlists");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAF5] py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/playlists"
            className="p-2 rounded-xl border border-[#E8E1D6] text-[#8A7060] hover:bg-[#F7F2EB] transition-all"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#2D1F0E]">Create Playlist</h1>
            <p className="text-sm text-[#8A7060]">Curate videos for your little ones</p>
          </div>
          <div className="ml-auto">
            <BookOpen size={28} className="text-[#C07A4A]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="bg-white rounded-2xl border border-[#E8E1D6] p-6 shadow-sm">
            <label className="block text-xs font-bold text-[#6A5A4A] uppercase tracking-wider mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rainy Day Favourites"
              maxLength={60}
              className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
            />
            <div className="text-right text-xs text-[#B09A88] mt-1">{name.length}/60</div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#E8E1D6] p-6 shadow-sm">
            <label className="block text-xs font-bold text-[#6A5A4A] uppercase tracking-wider mb-2">
              Description <span className="normal-case font-normal text-[#B09A88]">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this playlist for? What worked for your kids?"
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all resize-none"
            />
            <div className="text-right text-xs text-[#B09A88] mt-1">{description.length}/200</div>
          </div>

          {/* Moment */}
          <div className="bg-white rounded-2xl border border-[#E8E1D6] p-6 shadow-sm">
            <label className="block text-xs font-bold text-[#6A5A4A] uppercase tracking-wider mb-3">
              Moment <span className="normal-case font-normal text-[#B09A88]">(optional)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MOMENTS.map(({ id, label, emoji }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMoment(moment === id ? "" : id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                    moment === id
                      ? "bg-[#F3E3D3] border-[#C07A4A] text-[#C07A4A]"
                      : "bg-[#F7F2EB] border-[#E8E1D6] text-[#6A5A4A] hover:border-[#C07A4A]/40"
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="leading-tight text-center">{label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Group */}
          <div className="bg-white rounded-2xl border border-[#E8E1D6] p-6 shadow-sm">
            <label className="block text-xs font-bold text-[#6A5A4A] uppercase tracking-wider mb-3">
              Age Group <span className="normal-case font-normal text-[#B09A88]">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setAgeGroup(ageGroup === id ? "" : id)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                    ageGroup === id
                      ? "bg-[#7C3AED]/10 border-[#7C3AED] text-[#7C3AED]"
                      : "bg-[#F7F2EB] border-[#E8E1D6] text-[#6A5A4A] hover:border-[#7C3AED]/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-[#E8E1D6] p-6 shadow-sm">
            <label className="block text-xs font-bold text-[#6A5A4A] uppercase tracking-wider mb-2">
              Tags <span className="normal-case font-normal text-[#B09A88]">(optional · up to 10)</span>
            </label>
            <p className="text-xs text-[#B09A88] mb-3">Type a tag and press Enter to add</p>

            {/* Tag pills */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-[#F3E3D3] text-[#C07A4A] text-xs font-medium px-3 py-1.5 rounded-full border border-[#E8C8A0]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-0.5 hover:text-red-500 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={tagInputRef}
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value.replace(/\s/g, ""))}
                onKeyDown={handleTagKeyDown}
                placeholder="#bedtime, #calm, #travel…"
                maxLength={30}
                disabled={tags.length >= 10}
                className="flex-1 px-4 py-2.5 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim() || tags.length >= 10}
                className="px-4 py-2.5 bg-[#F3E3D3] text-[#C07A4A] rounded-xl border border-[#E8C8A0] hover:bg-[#EDD5B8] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Visibility */}
          <div className="bg-white rounded-2xl border border-[#E8E1D6] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isPublic ? (
                  <div className="w-10 h-10 rounded-xl bg-[#EEF7F2] flex items-center justify-center">
                    <Globe size={18} className="text-[#5E8F75]" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#F7F2EB] flex items-center justify-center">
                    <Lock size={18} className="text-[#8A7060]" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-[#2D1F0E] text-sm">
                    {isPublic ? "Public playlist" : "Private playlist"}
                  </div>
                  <div className="text-xs text-[#8A7060]">
                    {isPublic ? "Other parents can discover this" : "Only visible to you"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic((p) => !p)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  isPublic ? "bg-[#5E8F75]" : "bg-[#D6CEC3]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    isPublic ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-4 rounded-2xl font-bold text-base hover:bg-[#A8633A] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Creating…</>
            ) : (
              <>Create Playlist</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
