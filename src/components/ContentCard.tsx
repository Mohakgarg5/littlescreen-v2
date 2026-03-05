"use client";

import { useState } from "react";
import { ThumbsUp, CheckCircle2, X, Play } from "lucide-react";
import { ContentItem } from "@/lib/data";

interface ContentCardProps {
  item: ContentItem;
  variant?: "default" | "compact";
}

function EmbedModal({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
          <p className="text-gray-500 text-sm mb-2">{item.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ThumbsUp size={11} />
              {item.workedFor}% say it worked
            </span>
            <span>★ {item.parentRating} ({item.parentReviews.toLocaleString()} reviews)</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-500" />
              Added by {item.addedBy}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContentCard({ item, variant = "default" }: ContentCardProps) {
  const [showEmbed, setShowEmbed] = useState(false);

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={() => setShowEmbed(true)}
          className="card-lift flex gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 cursor-pointer w-full text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-violet-100 flex items-center justify-center flex-shrink-0 text-2xl">
            {item.thumbnail}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-0.5 line-clamp-1">{item.title}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                YouTube
              </span>
              <span className="flex items-center gap-0.5 text-emerald-600">
                <ThumbsUp size={10} />
                {item.workedFor}%
              </span>
            </div>
          </div>
        </button>
        {showEmbed && <EmbedModal item={item} onClose={() => setShowEmbed(false)} />}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowEmbed(true)}
        className="card-lift group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 cursor-pointer w-full text-left"
      >
        {/* Thumbnail */}
        <div className="relative h-36 bg-gradient-to-br from-orange-50 via-violet-50 to-blue-50 flex items-center justify-center overflow-hidden">
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.thumbnail}</span>
          {/* YouTube badge */}
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
            YouTube
          </span>
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={18} className="text-orange-500 fill-orange-500 ml-0.5" />
            </div>
          </div>
          {/* Duration */}
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {item.duration}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">{item.description}</p>

          {/* Parent stats */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.floor(item.parentRating) ? "text-amber-400" : "text-gray-200"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold text-gray-700">{item.parentRating}</span>
              <span className="text-xs text-gray-400">({item.parentReviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <ThumbsUp size={11} />
              {item.workedFor}% say it worked
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Bottom */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <CheckCircle2 size={12} className="text-emerald-500" />
              Added by {item.addedBy}
            </div>
            <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
              <Play size={11} className="fill-orange-500" />
              Watch
            </span>
          </div>
        </div>
      </button>
      {showEmbed && <EmbedModal item={item} onClose={() => setShowEmbed(false)} />}
    </>
  );
}
