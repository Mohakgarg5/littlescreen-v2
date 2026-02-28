"use client";

import { useState } from "react";
import { Play, Star, Users, Bookmark, CheckCircle2, ShieldCheck } from "lucide-react";
import { Video } from "@/lib/videos";
import { MOMENTS } from "@/lib/data";
import VideoModal from "./VideoModal";
import { useApprovedChannels } from "@/lib/ApprovedChannelsContext";

interface VideoCardProps {
  video: Video;
  variant?: "default" | "compact" | "featured";
}

export default function VideoCard({ video, variant = "default" }: VideoCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { isApproved } = useApprovedChannels();
  const channelApproved = isApproved(video.channelName);

  const primaryMoment = video.moments[0]
    ? MOMENTS.find((m) => m.id === video.moments[0])
    : null;

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="card-lift w-full flex gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 text-left group"
        >
          <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            {!imgError ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-violet-100 flex items-center justify-center text-xl">
                📺
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={16} className="text-white fill-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-xs leading-tight mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
              {video.title}
            </h4>
            <p className="text-gray-400 text-xs line-clamp-1">{video.channelName}</p>
            {video.parentRating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-gray-500">{video.parentRating}</span>
              </div>
            )}
          </div>
        </button>
        {modalOpen && <VideoModal video={video} onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  if (variant === "featured") {
    return (
      <>
        <div
          onClick={() => setModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
          className="card-lift w-full group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 text-left cursor-pointer"
        >
          {/* Thumbnail — 16:9 */}
          <div className="relative w-full overflow-hidden bg-gray-100" style={{ paddingBottom: "56.25%" }}>
            {!imgError ? (
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-violet-100 flex items-center justify-center text-4xl">
                📺
              </div>
            )}
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                <Play size={22} className="text-orange-500 fill-orange-500 ml-0.5" />
              </div>
            </div>
            {/* Age badge */}
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Ages {video.ageMin}–{video.ageMax}
            </div>
            {/* Moment badge */}
            {primaryMoment && (
              <div
                className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: primaryMoment.bg, color: primaryMoment.color }}
              >
                {primaryMoment.emoji} {primaryMoment.label}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3.5">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors flex-1">
                {video.title}
              </h3>
              <button
                onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
                className="p-1 text-gray-300 hover:text-orange-400 transition-colors flex-shrink-0"
              >
                <Bookmark size={14} />
              </button>
            </div>
            <p className="text-gray-400 text-xs mb-2">{video.channelName}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">
                {video.category}
              </span>
              {video.parentRating > 0 ? (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Star size={11} className="text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-gray-700">{video.parentRating}</span>
                  {video.reviewCount > 0 && (
                    <span className="flex items-center gap-0.5">
                      <Users size={10} />
                      {video.reviewCount}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-400" />
                  Parent pick
                </span>
              )}
            </div>
          </div>
        </div>
        {modalOpen && <VideoModal video={video} onClose={() => setModalOpen(false)} />}
      </>
    );
  }

  // Default card
  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
        className="card-lift w-full group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 text-left cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative w-full overflow-hidden bg-gray-100" style={{ paddingBottom: "56.25%" }}>
          {!imgError ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-violet-100 flex items-center justify-center text-4xl">
              📺
            </div>
          )}
          <div className="absolute inset-0 bg-black/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play size={18} className="text-orange-500 fill-orange-500 ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {video.ageMin}–{video.ageMax} yrs
          </div>
          {primaryMoment && (
            <div
              className="absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: primaryMoment.bg, color: primaryMoment.color }}
            >
              {primaryMoment.emoji}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {video.title}
          </h3>
          <div className="flex items-center gap-1.5 mb-2.5">
            <p className="text-gray-400 text-xs truncate">{video.channelName}</p>
            {channelApproved && (
              <span title="Parent-verified channel"><ShieldCheck size={12} className="text-emerald-500 flex-shrink-0" /></span>
            )}
          </div>
          <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2">
            {video.description}
          </p>
          <div className="flex items-center justify-between pt-2.5 border-t border-gray-50">
            <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">
              {video.category}
            </span>
            {video.parentRating > 0 ? (
              <div className="flex items-center gap-1 text-xs">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-700">{video.parentRating}</span>
                {video.reviewCount > 0 && (
                  <span className="text-gray-400 flex items-center gap-0.5">
                    <Users size={10} />
                    {video.reviewCount}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs text-emerald-600 flex items-center gap-1">
                <CheckCircle2 size={10} />
                Parent pick
              </span>
            )}
          </div>
        </div>
      </div>
      {modalOpen && <VideoModal video={video} onClose={() => setModalOpen(false)} />}
    </>
  );
}
