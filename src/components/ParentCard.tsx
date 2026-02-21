"use client";

import Link from "next/link";
import { Users, BookOpen, CheckCircle2 } from "lucide-react";
import { Parent } from "@/lib/parents";
import { useFollow } from "@/lib/FollowContext";

interface ParentCardProps {
  parent: Parent;
  variant?: "default" | "compact";
}

export default function ParentCard({ parent, variant = "default" }: ParentCardProps) {
  const { isFollowing, toggleFollow } = useFollow();
  const following = isFollowing(parent.username);

  if (variant === "compact") {
    return (
      <div className="card-lift flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-orange-200">
        <Link href={`/parents/${parent.username}`} className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${parent.gradient} flex items-center justify-center text-xl flex-shrink-0`}>
            {parent.avatar}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-gray-900 flex items-center gap-1">
              {parent.displayName}
              {parent.badges.some((b) => ["Official", "ECE Professional", "Medical Professional"].includes(b)) && (
                <CheckCircle2 size={13} className="text-blue-500" />
              )}
            </div>
            <div className="text-xs text-gray-400">{parent.kidsAges}</div>
          </div>
        </Link>
        <button
          onClick={() => toggleFollow(parent.username)}
          className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
            following
              ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      </div>
    );
  }

  return (
    <div className="card-lift bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 overflow-hidden group">
      {/* Cover gradient */}
      <div className={`relative h-20 bg-gradient-to-br ${parent.gradient}`}>
        <div className="absolute -bottom-6 left-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${parent.gradient} border-4 border-white flex items-center justify-center text-3xl shadow-lg`}>
            {parent.avatar}
          </div>
        </div>
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-1">
          {parent.badges.slice(0, 1).map((badge) => (
            <span key={badge} className="bg-white/90 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-8 px-5 pb-5">
        {/* Name + verified */}
        <Link href={`/parents/${parent.username}`}>
          <h3 className="font-black text-gray-900 text-base flex items-center gap-1.5 group-hover:text-orange-600 transition-colors mb-0.5">
            {parent.displayName}
            {parent.badges.some((b) =>
              ["Official", "ECE Professional", "Medical Professional"].includes(b)
            ) && <CheckCircle2 size={15} className="text-blue-500" />}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mb-3">{parent.kidsAges} · {parent.location}</p>
        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">{parent.bio}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Users size={12} className="text-orange-400" />
            <strong className="text-gray-700">{parent.followers.toLocaleString()}</strong> followers
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={12} className="text-violet-400" />
            <strong className="text-gray-700">{parent.playlistCount}</strong> playlists
          </span>
        </div>

        {/* Follow button */}
        <button
          onClick={() => toggleFollow(parent.username)}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
            following
              ? "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500 border border-gray-200"
              : "bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:opacity-90 shadow-md hover:shadow-lg"
          }`}
        >
          {following ? "✓ Following" : "+ Follow"}
        </button>
      </div>
    </div>
  );
}
