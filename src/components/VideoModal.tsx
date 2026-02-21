"use client";

import { useEffect, useCallback } from "react";
import { X, Star, Users, ExternalLink, Bookmark, CheckCircle2 } from "lucide-react";
import { Video } from "@/lib/videos";
import { MOMENTS } from "@/lib/data";

interface VideoModalProps {
  video: Video;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: VideoModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const moments = video.moments
    .map((m) => MOMENTS.find((x) => x.id === m))
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

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
          {/* Close button overlay */}
          <button
            onClick={onClose}
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
              <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all">
                <Bookmark size={17} />
              </button>
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
          <div className="flex flex-wrap gap-2">
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
              <span
                key={tag}
                className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Parent verified note */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-xs text-gray-500">
              Curated by the littleScreen parent community — no algorithm, just real picks.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
