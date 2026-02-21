"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Search, BookOpen, Compass, Sparkles, Users, MessageCircleHeart, LogOut } from "lucide-react";
import { useFollow } from "@/lib/FollowContext";
import { useAuth } from "@/lib/AuthContext";

const navLinks = [
  { href: "/discover",   label: "Discover",   icon: Compass },
  { href: "/playlists",  label: "Playlists",  icon: BookOpen },
  { href: "/community",  label: "What Worked", icon: MessageCircleHeart },
  { href: "/parents",    label: "Parents",    icon: Users },
];

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { following } = useFollow();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E1D6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white text-lg">📺</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              <span style={{ color: "#C07A4A" }}>little</span>
              <span style={{ color: "#5E8F75" }}>Screen</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              const showBadge = href === "/parents" && following.size > 0;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#F3E3D3] text-[#C07A4A]"
                      : "text-[#6A5A4A] hover:text-[#C07A4A] hover:bg-[#F7F2EB]"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {showBadge && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C07A4A] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {following.size > 9 ? "9+" : following.size}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2.5">
            <button className="p-2 text-[#8A7060] hover:text-[#C07A4A] hover:bg-[#F7F2EB] rounded-xl transition-all">
              <Search size={17} />
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-[#F7F2EB] border border-[#E8E1D6] px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {userInitial}
                  </div>
                  <span className="text-sm font-medium text-[#4A3728] max-w-[100px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-[#8A7060] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#6A5A4A] hover:text-[#C07A4A] px-3 py-2 rounded-xl hover:bg-[#F7F2EB] transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 bg-[#C07A4A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#A8633A] transition-colors shadow-sm"
                >
                  <Sparkles size={13} />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button
            className="md:hidden p-2 text-[#6A5A4A] hover:text-[#C07A4A] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#E8E1D6] px-4 py-4 space-y-1.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            const showBadge = href === "/parents" && following.size > 0;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#F3E3D3] text-[#C07A4A]"
                    : "text-[#6A5A4A] hover:bg-[#F7F2EB]"
                }`}
              >
                <Icon size={16} />
                {label}
                {showBadge && (
                  <span className="ml-auto bg-[#C07A4A] text-white text-xs rounded-full px-2 py-0.5 font-bold">
                    {following.size}
                  </span>
                )}
              </Link>
            );
          })}
          {user ? (
            <div className="flex items-center justify-between px-4 py-3 bg-[#F7F2EB] rounded-xl mt-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center text-white text-xs font-bold">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-[#4A3728]">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-500 font-medium"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-1">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl border border-[#E8E1D6] text-sm font-semibold text-[#4A3728] hover:bg-[#F7F2EB] transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#C07A4A] text-white px-4 py-3 rounded-xl text-sm font-semibold"
              >
                <Sparkles size={13} />
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
