"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const PERKS = [
  "Parent-verified video picks, not algorithmic junk",
  "Playlists for bedtime, travel, sick days & more",
  "Community wisdom: what actually worked for real kids",
];

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      router.push("/onboarding");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(145deg, #FDF7EE 0%, #F0EBE0 100%)" }}
    >
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C07A4A, transparent)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5E8F75, transparent)" }} />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-2xl">📺</span>
            </div>
            <span className="font-bold text-2xl">
              <span className="text-[#C07A4A]">little</span>
              <span className="text-[#5E8F75]">Screen</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-[#2D1F0E]">Create your account</h1>
          <p className="text-[#8A7060] text-sm mt-1">Join 12,000+ parents already using littleScreen</p>
        </div>

        {/* Perks strip */}
        <div className="bg-[#EEF7F2] border border-[#C8E4D4] rounded-2xl p-4 mb-5 space-y-2">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-start gap-2 text-sm text-[#3A6A52]">
              <CheckCircle2 size={15} className="text-[#5E8F75] flex-shrink-0 mt-0.5" />
              {perk}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D6] shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Johnson"
                required
                className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-11 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B09A88] hover:text-[#8A7060] transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <>Create Account <ArrowRight size={15} /></>
              )}
            </button>

            <p className="text-xs text-center text-[#B09A88] pt-1">
              By signing up you agree to our{" "}
              <a href="#" className="underline hover:text-[#8A7060]">Terms</a> &amp;{" "}
              <a href="#" className="underline hover:text-[#8A7060]">Privacy Policy</a>
            </p>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#E8E1D6]" />
            <span className="text-xs text-[#B09A88]">already have an account?</span>
            <div className="flex-1 h-px bg-[#E8E1D6]" />
          </div>

          <Link
            href="/login"
            className="block w-full text-center py-3 rounded-xl border border-[#E8E1D6] text-sm font-semibold text-[#4A3728] hover:bg-[#F7F2EB] hover:border-[#C07A4A]/50 transition-all"
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
}
