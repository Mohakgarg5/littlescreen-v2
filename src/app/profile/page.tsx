"use client";

import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { User, Mail, Baby, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="min-h-screen bg-[#FEFAF5]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] pt-10 pb-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
            {initial}
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{user.name}</h1>
          <p className="text-white/70 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6 pb-12">
        <div className="bg-white rounded-2xl border border-[#E8E1D6] shadow-sm overflow-hidden">
          {/* Name */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-[#F3EDE4]">
            <div className="w-9 h-9 rounded-xl bg-[#F3E3D3] flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-[#C07A4A]" />
            </div>
            <div>
              <p className="text-xs text-[#8A7060] font-medium uppercase tracking-wide">Name</p>
              <p className="text-sm font-semibold text-[#2D1F0E]">{user.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-[#F3EDE4]">
            <div className="w-9 h-9 rounded-xl bg-[#F3E3D3] flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-[#C07A4A]" />
            </div>
            <div>
              <p className="text-xs text-[#8A7060] font-medium uppercase tracking-wide">Email</p>
              <p className="text-sm font-semibold text-[#2D1F0E]">{user.email}</p>
            </div>
          </div>

          {/* Children */}
          {user.children && user.children.length > 0 && (
            <div className="flex items-start gap-4 px-5 py-4 border-b border-[#F3EDE4]">
              <div className="w-9 h-9 rounded-xl bg-[#F3E3D3] flex items-center justify-center flex-shrink-0">
                <Baby size={16} className="text-[#C07A4A]" />
              </div>
              <div>
                <p className="text-xs text-[#8A7060] font-medium uppercase tracking-wide mb-1">Children</p>
                {user.children.map((child: { id: number; name: string; age: number }) => (
                  <p key={child.id} className="text-sm font-semibold text-[#2D1F0E]">
                    {child.name} <span className="text-[#8A7060] font-normal">· {child.age} yr{child.age !== 1 ? "s" : ""}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Group */}
          {user.groupMemberships && user.groupMemberships.length > 0 && (
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-xl bg-[#F3E3D3] flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-[#C07A4A]" />
              </div>
              <div>
                <p className="text-xs text-[#8A7060] font-medium uppercase tracking-wide">Parent group</p>
                <p className="text-sm font-semibold text-[#2D1F0E]">
                  {user.groupMemberships[0].group.icon} {user.groupMemberships[0].group.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => router.back()}
          className="w-full mt-4 py-3 rounded-xl border border-[#E8E1D6] text-sm font-semibold text-[#6A5A4A] hover:bg-[#F7F2EB] transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
}
