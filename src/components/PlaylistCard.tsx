"use client";

import Link from "next/link";
import { Bookmark, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { Playlist } from "@/lib/data";

interface PlaylistCardProps {
  playlist: Playlist;
  variant?: "default" | "compact" | "featured";
}

export default function PlaylistCard({ playlist, variant = "default" }: PlaylistCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/playlists/${playlist.id}`} className="block group">
        <div className="card-lift relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-orange-200">
          {/* Gradient Cover */}
          <div className={`relative h-44 bg-gradient-to-br ${playlist.gradient} flex items-center justify-center overflow-hidden`}>
            <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
              {playlist.coverEmoji}
            </span>
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-4 w-32 h-32 bg-white/10 rounded-full" />
            {/* Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[#5E8F75] text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <CheckCircle2 size={11} />
              Parent Verified
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-[#2D1F0E] text-base leading-snug mb-1 group-hover:text-[#C07A4A] transition-colors line-clamp-2">
              {playlist.title}
            </h3>
            <p className="text-[#8A7060] text-xs leading-relaxed mb-3 line-clamp-2">
              {playlist.description}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-[#B09A88]">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#C07A4A] rounded-full opacity-70" />
                  {playlist.itemCount} videos
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} />
                  {playlist.saves.toLocaleString()} saves
                </span>
              </div>
              <ChevronRight size={15} className="text-[#D6CEC3] group-hover:text-[#C07A4A] group-hover:translate-x-0.5 transition-all" />
            </div>

            {/* Age tags */}
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-[#F0EBE2]">
              {playlist.ageGroups.slice(0, 3).map((age) => (
                <span key={age} className="text-xs bg-[#F3E3D3] text-[#C07A4A] px-2 py-0.5 rounded-full font-medium">
                  {age}y
                </span>
              ))}
              <span className="text-xs bg-[#EEF7F2] text-[#5E8F75] px-2 py-0.5 rounded-full font-medium">
                {playlist.moments[0]}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/playlists/${playlist.id}`} className="block group">
        <div className="card-lift flex gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-orange-200">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${playlist.gradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-2xl">{playlist.coverEmoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-0.5 group-hover:text-orange-600 transition-colors line-clamp-1">
              {playlist.title}
            </h3>
            <p className="text-gray-500 text-xs line-clamp-1 mb-1">{playlist.description}</p>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{playlist.itemCount} videos</span>
              <span>·</span>
              <span>{playlist.saves.toLocaleString()} saves</span>
            </div>
          </div>
          {playlist.parentVerified && (
            <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0 mt-1" />
          )}
        </div>
      </Link>
    );
  }

  // Default
  return (
    <Link href={`/playlists/${playlist.id}`} className="block group">
      <div className="card-lift relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-orange-200">
        {/* Gradient Cover */}
        <div className={`relative h-36 bg-gradient-to-br ${playlist.gradient} flex items-center justify-center overflow-hidden`}>
          <span className="text-6xl drop-shadow group-hover:scale-110 transition-transform duration-300">
            {playlist.coverEmoji}
          </span>
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-3 w-24 h-24 bg-white/10 rounded-full" />
          {playlist.parentVerified && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 text-emerald-600 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
              <CheckCircle2 size={10} />
              Verified
            </div>
          )}
        </div>

        <div className="p-3.5">
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
            {playlist.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{playlist.itemCount} videos</span>
            <span className="flex items-center gap-1">
              <Bookmark size={10} />
              {playlist.saves.toLocaleString()}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {playlist.ageGroups.slice(0, 2).map((age) => (
              <span key={age} className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded-full">
                {age}y
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
