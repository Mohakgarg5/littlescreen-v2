"use client";

import { useState } from "react";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";

interface PlaylistItem {
  id: string;
  video_id: string;
  title: string;
  thumbnail_url?: string;
  channel_name?: string;
  position: number;
}

interface Props {
  playlistId: string;
  initialItems: PlaylistItem[];
}

export default function PlaylistItemsList({ playlistId, initialItems }: Props) {
  const [items, setItems] = useState<PlaylistItem[]>(initialItems);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const removeItem = async (itemId: string) => {
    setRemovingId(itemId);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/items?item_id=${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      }
    } catch {
      // silent fail
    } finally {
      setRemovingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 mb-12">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-gray-500 text-sm mb-2">No videos yet in this playlist</p>
        <Link href="/discover" className="text-sm font-semibold text-[#C07A4A] hover:underline">
          Discover videos to add →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
      {items.map((item) => (
        <div
          key={item.id}
          className="group bg-white rounded-2xl border border-[#E8E1D6] overflow-hidden hover:shadow-md hover:border-[#C07A4A]/40 transition-all"
        >
          {item.thumbnail_url && (
            <div className="aspect-video bg-gray-100 overflow-hidden">
              <img
                src={item.thumbnail_url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-3.5">
            <h3 className="font-semibold text-sm text-[#2D1F0E] line-clamp-2 mb-1">
              {item.title}
            </h3>
            {item.channel_name && (
              <p className="text-xs text-[#8A7060] mb-3">{item.channel_name}</p>
            )}
            <div className="flex items-center gap-2">
              <a
                href={`https://www.youtube.com/watch?v=${item.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#C07A4A] hover:text-[#A8633A] transition-colors"
              >
                <ExternalLink size={12} />
                Watch
              </a>
              <button
                onClick={() => removeItem(item.id)}
                disabled={removingId === item.id}
                className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                title="Remove from playlist"
              >
                {removingId === item.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
