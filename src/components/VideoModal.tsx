"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { X, Star, Users, ExternalLink, BookmarkPlus, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { Video } from "@/lib/videos";
import { MOMENTS } from "@/lib/data";

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

interface ContentRating {
  source: string;
  age_min?: number;
  age_max?: number;
  sex_romance_nudity?: number;
  violence_scariness?: number;
  products_purchases?: number;
  drinking_drugs_smoking?: number;
  language?: number;
  ai_approved?: boolean;
  ai_score?: number;
  ai_notes?: string;
}

interface Playlist {
  id: string;
  name: string;
  item_count: number;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState<ContentRating[]>([]);

  // Save to playlist state
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistPicker, setShowPlaylistPicker] = useState(false);
  const [savingToPlaylist, setSavingToPlaylist] = useState<string | null>(null);
  const [savedToPlaylist, setSavedToPlaylist] = useState<string | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (!feedbackSubmitted && !showFeedback) {
      setShowFeedback(true);
    } else {
      onClose();
    }
  }, [feedbackSubmitted, showFeedback, onClose]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    },
    [handleClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Fetch content ratings
  useEffect(() => {
    if (!video.title) return;
    fetch(`/api/content-ratings?title=${encodeURIComponent(video.title)}`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRatings(data); })
      .catch(() => {});
  }, [video.title]);

  // Fetch user's playlists for the picker
  useEffect(() => {
    fetch("/api/playlists")
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { if (Array.isArray(data)) setPlaylists(data); })
      .catch(() => {});
  }, []);

  // Close picker on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPlaylistPicker(false);
      }
    }
    if (showPlaylistPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPlaylistPicker]);

  const saveToPlaylist = async (playlistId: string) => {
    setSavingToPlaylist(playlistId);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: video.youtubeId,
          title: video.title,
          thumbnail_url: video.thumbnailUrl,
          channel_name: video.channelName,
        }),
      });
      if (res.ok) {
        setSavedToPlaylist(playlistId);
        setTimeout(() => {
          setShowPlaylistPicker(false);
          setSavedToPlaylist(null);
        }, 1200);
      }
    } catch {
      // silent fail
    } finally {
      setSavingToPlaylist(null);
    }
  };

  const submitFeedback = async (selectedRating: number) => {
    setRating(selectedRating);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: video.youtubeId,
          trigger: "video_ends",
          rating: selectedRating,
          comment: comment.trim() || undefined,
        }),
      });
    } catch {
      // silent fail
    }
    setFeedbackSubmitted(true);
    setTimeout(() => onClose(), 800);
  };

  const skipFeedback = () => {
    setFeedbackSubmitted(true);
    onClose();
  };

  const moments = video.moments
    .map((m) => MOMENTS.find((x) => x.id === m))
    .filter(Boolean);

  const kimRating = ratings.find((r) => r.source === "kids_in_mind");
  const csmRating = ratings.find((r) => r.source === "common_sense_media");
  const aiRating = ratings.find((r) => r.source === "ai_screen");
  const hasRatings = ratings.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
        {/* YouTube embed */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Info panel */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-gray-900 text-lg leading-snug mb-1 line-clamp-2">
                {video.title}
              </h2>
              <p className="text-sm text-gray-500">{video.channelName}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Save to Playlist */}
              <div className="relative" ref={pickerRef}>
                <button
                  onClick={() => setShowPlaylistPicker((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-[#C07A4A] bg-[#F3E3D3] hover:bg-[#EBD5C0] rounded-xl transition-all"
                  title="Save to playlist"
                >
                  <BookmarkPlus size={15} />
                  Save
                  <ChevronDown size={12} />
                </button>

                {showPlaylistPicker && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100">
                      <p className="text-xs font-bold text-gray-700">Save to playlist</p>
                    </div>
                    {playlists.length === 0 ? (
                      <div className="px-3 py-4 text-center">
                        <p className="text-xs text-gray-500">No playlists yet.</p>
                        <a href="/playlists/create" className="text-xs text-[#C07A4A] font-semibold hover:underline">
                          Create one →
                        </a>
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto">
                        {playlists.map((pl) => (
                          <button
                            key={pl.id}
                            onClick={() => saveToPlaylist(pl.id)}
                            disabled={!!savingToPlaylist || savedToPlaylist === pl.id}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#F7F2EB] transition-colors text-left disabled:opacity-60"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800 line-clamp-1">{pl.name}</p>
                              <p className="text-xs text-gray-400">{pl.item_count} videos</p>
                            </div>
                            {savingToPlaylist === pl.id && (
                              <Loader2 size={14} className="text-[#C07A4A] animate-spin flex-shrink-0" />
                            )}
                            {savedToPlaylist === pl.id && (
                              <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
              >
                <ExternalLink size={17} />
              </a>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {video.parentRating > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < Math.floor(video.parentRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-700">{video.parentRating}</span>
                {video.reviewCount > 0 && (
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <Users size={11} />
                    {video.reviewCount}
                  </span>
                )}
              </div>
            )}
            <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-2.5 py-1 rounded-full">
              {video.category}
            </span>
            <span className="text-xs bg-orange-50 text-orange-600 font-medium px-2.5 py-1 rounded-full">
              Ages {video.ageMin}–{video.ageMax}
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4">{video.description}</p>

          {/* Moments & tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {moments.map(
              (m) =>
                m && (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ backgroundColor: m.bg, color: m.color }}
                  >
                    {m.emoji} {m.label}
                  </span>
                )
            )}
            {video.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Content Safety Section */}
          <div className="pt-4 border-t border-gray-100 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-gray-700">🛡️ Content Safety</span>
            </div>
            {hasRatings ? (
              <div className="flex flex-wrap gap-2">
                {csmRating && (
                  <span className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 font-medium">
                    📊 CSM: Age {csmRating.age_min}+
                  </span>
                )}
                {kimRating && (
                  <span className="flex items-center gap-1.5 text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full border border-purple-100 font-medium">
                    🎬 KIM: {kimRating.sex_romance_nudity ?? "-"}/{kimRating.violence_scariness ?? "-"}/{kimRating.language ?? "-"}
                  </span>
                )}
                {aiRating && (
                  <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${
                    aiRating.ai_approved
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    🤖 AI: {aiRating.ai_approved ? "Approved" : "Review needed"}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Content ratings not yet available for this video.</p>
            )}
          </div>

          {/* Parent verified note */}
          <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-xs text-gray-500">
              Curated by the littleScreen parent community — no algorithm, just real picks.
            </span>
          </div>
        </div>

        {/* Feedback slide-up panel */}
        {showFeedback && !feedbackSubmitted && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E8E1D6] rounded-b-3xl px-5 pb-6 pt-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-[#2D1F0E] text-sm">Did this work for your kids?</p>
                <p className="text-xs text-[#8A7060]">Help other parents find great content</p>
              </div>
              <button onClick={skipFeedback} className="text-xs text-[#B09A88] hover:text-[#8A7060] underline">
                Skip
              </button>
            </div>

            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => submitFeedback(s)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      s <= (hoverRating || rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                </button>
              ))}
            </div>

            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Any notes? (optional)"
              className="w-full px-3 py-2 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-xs text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] transition-all"
            />
          </div>
        )}

        {/* Feedback success */}
        {feedbackSubmitted && rating > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#EEF7F2] border-t border-[#C8E6D8] rounded-b-3xl px-5 py-4 text-center">
            <CheckCircle2 size={20} className="text-[#5E8F75] mx-auto mb-1" />
            <p className="text-sm font-semibold text-[#2D1F0E]">Thanks for your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
}
