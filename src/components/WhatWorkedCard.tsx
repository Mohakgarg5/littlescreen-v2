"use client";

import { useState } from "react";
import { Heart, Bookmark, Flag, ExternalLink, Play, ChevronDown, ChevronUp } from "lucide-react";
import { WhatWorkedPost, RESOURCE_META } from "@/lib/community";
import { MOMENTS } from "@/lib/data";
import VideoModal from "./VideoModal";
import { Video } from "@/lib/videos";

interface WhatWorkedCardProps {
  post: WhatWorkedPost;
}

export default function WhatWorkedCard({ post }: WhatWorkedCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [saveCount, setSaveCount] = useState(post.saves);
  const [expanded, setExpanded] = useState(false);
  const [videoModal, setVideoModal] = useState<{ youtubeId: string; title: string } | null>(null);

  const momentData = MOMENTS.find((m) => m.id === post.moment);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const toggleSave = () => {
    setSaved((v) => !v);
    setSaveCount((c) => (saved ? c - 1 : c + 1));
  };

  const bodyPreview = post.body.length > 220 && !expanded
    ? post.body.slice(0, 220) + "…"
    : post.body;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E1D6] shadow-sm overflow-hidden">
      {/* Moment accent line */}
      {momentData && (
        <div className="h-1 w-full" style={{ backgroundColor: momentData.color + "55" }} />
      )}

      <div className="p-5 sm:p-6">
        {/* Author header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0 shadow-sm"
              style={{ backgroundColor: post.authorColor }}
            >
              {post.authorInitial}
            </div>
            <div>
              <div className="font-semibold text-[#2D1F0E] text-sm">{post.author}</div>
              <div className="text-[#8A7060] text-xs">Child: {post.childAge}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {momentData && (
              <span
                className="hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ backgroundColor: momentData.bg, color: momentData.color }}
              >
                {momentData.emoji} {momentData.label}
              </span>
            )}
            <span className="text-xs text-[#B09A88]">{post.createdAt}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-[#2D1F0E] text-base leading-snug mb-3">
          {post.title}
        </h3>

        {/* Body */}
        <p className="text-[#4A3728] text-sm leading-relaxed mb-1">
          {bodyPreview}
        </p>
        {post.body.length > 220 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-[#C07A4A] font-semibold hover:text-[#A8633A] transition-colors mt-1 mb-3"
          >
            {expanded ? (
              <><ChevronUp size={13} /> Show less</>
            ) : (
              <><ChevronDown size={13} /> Read more</>
            )}
          </button>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-[#F0EBE2] text-[#8A7060] px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Linked Resources */}
        {post.resources.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-3.5 h-3.5 text-[#8A7060]">⊕</div>
              <span className="text-xs font-bold text-[#8A7060] uppercase tracking-widest">
                Linked Resources
              </span>
            </div>
            <div className="space-y-2">
              {post.resources.map((resource, i) => {
                const meta = RESOURCE_META[resource.type];
                const isYouTube = resource.type === "youtube" && resource.youtubeId;

                return (
                  <div key={i} className="group">
                    {isYouTube ? (
                      <button
                        onClick={() =>
                          setVideoModal({ youtubeId: resource.youtubeId!, title: resource.title })
                        }
                        className="resource-link w-full flex items-center gap-3 px-4 py-3 bg-[#F7F2EB] rounded-xl border border-[#E8E1D6] hover:border-[#C07A4A]/40 text-left"
                      >
                        <span
                          className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          {meta.label.toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm font-medium text-[#2D1F0E] line-clamp-1">
                          {resource.title}
                        </span>
                        {resource.note && (
                          <span className="hidden sm:block text-xs text-[#B09A88] line-clamp-1 max-w-[140px]">
                            {resource.note}
                          </span>
                        )}
                        <Play
                          size={14}
                          className="flex-shrink-0 text-[#C0392B] fill-[#C0392B] ml-1"
                        />
                      </button>
                    ) : (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resource-link flex items-center gap-3 px-4 py-3 bg-[#F7F2EB] rounded-xl border border-[#E8E1D6] hover:border-[#C07A4A]/40"
                      >
                        <span
                          className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          {meta.label.toUpperCase()}
                        </span>
                        <span className="flex-1 text-sm font-medium text-[#2D1F0E] line-clamp-1">
                          {resource.title}
                        </span>
                        {resource.price && (
                          <span className="text-xs font-semibold text-[#C07A4A] flex-shrink-0">
                            {resource.price}
                          </span>
                        )}
                        {resource.note && (
                          <span className="hidden sm:block text-xs text-[#B09A88] line-clamp-1 max-w-[120px]">
                            {resource.note}
                          </span>
                        )}
                        <ExternalLink
                          size={13}
                          className="flex-shrink-0 text-[#B09A88] group-hover:text-[#8A7060] transition-colors"
                        />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#F0EBE2]">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                liked ? "text-rose-500" : "text-[#B09A88] hover:text-rose-400"
              }`}
            >
              <Heart
                size={15}
                className={liked ? "fill-rose-500" : ""}
              />
              <span className="font-medium">{likeCount}</span>
            </button>
            <button
              onClick={toggleSave}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                saved ? "text-[#C07A4A]" : "text-[#B09A88] hover:text-[#C07A4A]"
              }`}
            >
              <Bookmark
                size={15}
                className={saved ? "fill-[#C07A4A]" : ""}
              />
              <span className="font-medium">{saveCount} saved</span>
            </button>
          </div>
          <button className="flex items-center gap-1 text-xs text-[#C9B9A8] hover:text-[#8A7060] transition-colors">
            <Flag size={12} />
            Report
          </button>
        </div>
      </div>

      {/* YouTube modal */}
      {videoModal && (
        <VideoModal
          video={
            {
              id: 0,
              youtubeId: videoModal.youtubeId,
              title: videoModal.title,
              description: "",
              channelName: "",
              ageMin: 1,
              ageMax: 6,
              category: "",
              tags: [],
              thumbnailUrl: `https://img.youtube.com/vi/${videoModal.youtubeId}/mqdefault.jpg`,
              parentRating: 0,
              reviewCount: 0,
              stimulationLevel: null,
              createdAt: "",
              moments: [post.moment],
            } as Video
          }
          onClose={() => setVideoModal(null)}
        />
      )}
    </div>
  );
}
