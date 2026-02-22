"use client";

import { ThumbsUp, CheckCircle2, ExternalLink, Bookmark } from "lucide-react";
import { ContentItem } from "@/lib/data";

interface ContentCardProps {
  item: ContentItem;
  variant?: "default" | "compact";
}

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "bg-red-50 text-red-600",
  Netflix: "bg-red-900/10 text-red-800",
  "PBS Kids": "bg-green-50 text-green-700",
  "Disney+": "bg-blue-50 text-blue-600",
  Spotify: "bg-green-50 text-green-600",
};

function getPlatformUrl(platform: string, title: string): string {
  const q = encodeURIComponent(title);
  switch (platform) {
    case "YouTube":   return `https://www.youtube.com/results?search_query=${q}`;
    case "Netflix":   return `https://www.netflix.com/search?q=${q}`;
    case "PBS Kids":  return `https://pbskids.org/`;
    case "Disney+":   return `https://www.disneyplus.com/search/${q}`;
    case "Spotify":   return `https://open.spotify.com/search/${q}`;
    default:          return `https://www.youtube.com/results?search_query=${q}`;
  }
}

export default function ContentCard({ item, variant = "default" }: ContentCardProps) {
  const url = getPlatformUrl(item.platform, item.title);

  if (variant === "compact") {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-lift flex gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 cursor-pointer"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-violet-100 flex items-center justify-center flex-shrink-0 text-2xl">
          {item.thumbnail}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-0.5 line-clamp-1">{item.title}</h4>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${PLATFORM_COLORS[item.platform]}`}>
              {item.platform}
            </span>
            <span className="flex items-center gap-0.5 text-emerald-600">
              <ThumbsUp size={10} />
              {item.workedFor}%
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="card-lift group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-gradient-to-br from-orange-50 via-violet-50 to-blue-50 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.thumbnail}</span>
        {/* Platform badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${PLATFORM_COLORS[item.platform]}`}>
          {item.platform}
        </span>
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
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
              <Bookmark size={13} />
            </button>
            <span
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
            >
              <ExternalLink size={13} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
