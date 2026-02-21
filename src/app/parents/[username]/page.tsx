"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Users, BookOpen, Calendar, CheckCircle2, Share2 } from "lucide-react";
import { SAMPLE_PARENTS } from "@/lib/parents";
import PlaylistCard from "@/components/PlaylistCard";
import ParentCard from "@/components/ParentCard";
import { useFollow } from "@/lib/FollowContext";

export default function ParentProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const parent = SAMPLE_PARENTS.find((p) => p.username === username);
  const { isFollowing, toggleFollow, following } = useFollow();

  if (!parent) {
    return (
      <div className="min-h-screen bg-[#FEFAF5] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👻</div>
          <h2 className="font-black text-xl text-gray-800 mb-2">Parent not found</h2>
          <Link href="/parents" className="text-orange-500 font-semibold hover:underline">
            Back to Community
          </Link>
        </div>
      </div>
    );
  }

  const isFollowingParent = isFollowing(parent.username);
  const followingCount = isFollowingParent
    ? parent.followers + 1
    : parent.followers;

  const suggestedParents = SAMPLE_PARENTS.filter(
    (p) =>
      p.username !== parent.username &&
      !following.has(p.username)
  ).slice(0, 4);

  const isOfficial = parent.badges.some((b) =>
    ["Official", "ECE Professional", "Medical Professional"].includes(b)
  );

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      {/* Cover */}
      <div className={`relative bg-gradient-to-br ${parent.gradient} pt-6 pb-20 px-4`}>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -bottom-16 -left-8 w-40 h-40 bg-white/10 rounded-full" />

        <div className="relative max-w-4xl mx-auto">
          <Link
            href="/parents"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft size={15} />
            Community
          </Link>

          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 flex items-center justify-center text-5xl sm:text-6xl border-2 border-white/30 flex-shrink-0 shadow-xl">
              {parent.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                {parent.badges.map((badge) => (
                  <span key={badge} className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {badge}
                  </span>
                ))}
              </div>
              <h1 className="font-black text-3xl sm:text-4xl text-white leading-tight flex items-center gap-2">
                {parent.displayName}
                {isOfficial && <CheckCircle2 size={24} className="text-white/90" />}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} />
                  {parent.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  Joined {parent.joinedDate}
                </span>
                <span>Kids: {parent.kidsAges}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile card floating */}
      <div className="max-w-4xl mx-auto px-4 -mt-10 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Stats */}
            <div className="flex items-center gap-6 flex-1">
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900">{followingCount.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Followers</div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900">{parent.following.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Following</div>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="text-center">
                <div className="text-2xl font-black text-gray-900">{parent.playlistCount}</div>
                <div className="text-xs text-gray-500">Playlists</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFollow(parent.username)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isFollowingParent
                    ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500 border border-gray-200"
                    : "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md hover:opacity-90"
                }`}
              >
                {isFollowingParent ? "✓ Following" : "+ Follow"}
              </button>
              <button className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all border border-gray-200">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed mt-4 pt-4 border-t border-gray-100">
            {parent.bio}
          </p>
        </div>
      </div>

      {/* Playlists */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-violet-600" />
            <h2 className="font-black text-gray-900 text-xl">
              {parent.displayName.split(" ")[0]}&apos;s Playlists
            </h2>
            <span className="bg-violet-50 text-violet-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {parent.playlists.length}
            </span>
          </div>
        </div>

        {parent.playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {parent.playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} variant="featured" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 mb-12">
            <div className="text-4xl mb-3">🎵</div>
            <p className="text-gray-500 text-sm">No playlists yet</p>
          </div>
        )}

        {/* Suggested parents */}
        {suggestedParents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Users size={16} className="text-orange-500" />
              <h3 className="font-black text-gray-900 text-lg">More parents to follow</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedParents.map((p) => (
                <ParentCard key={p.username} parent={p} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
