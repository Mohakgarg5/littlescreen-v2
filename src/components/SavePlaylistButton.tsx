"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";

interface SavePlaylistButtonProps {
  initialSaves: number;
}

export default function SavePlaylistButton({ initialSaves }: SavePlaylistButtonProps) {
  const [saved, setSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(initialSaves);

  const toggle = () => {
    setSaved((v) => !v);
    setSaveCount((c) => (saved ? c - 1 : c + 1));
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md text-sm ${
        saved
          ? "bg-[#C07A4A] text-white hover:bg-[#A8633A]"
          : "bg-white text-gray-800 hover:bg-gray-50"
      }`}
    >
      <Bookmark size={15} className={saved ? "fill-white" : ""} />
      {saved ? `Saved (${saveCount.toLocaleString()})` : "Save Playlist"}
    </button>
  );
}
