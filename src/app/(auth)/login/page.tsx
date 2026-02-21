"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(145deg, #FDF7EE 0%, #F0EBE0 100%)" }}
    >
      {/* Soft background blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8B86D, transparent)" }} />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
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
          <h1 className="text-2xl font-black text-[#2D1F0E]">Welcome back</h1>
          <p className="text-[#8A7060] text-sm mt-1">Sign in to your parent account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D6] shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#4A3728] mb-1.5">
                Email address
              </label>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#4A3728]">Password</label>
                <a href="#" className="text-xs text-[#C07A4A] hover:text-[#A8633A] font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                <span className="text-base">⚠️</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#E8E1D6]" />
            <span className="text-xs text-[#B09A88]">or</span>
            <div className="flex-1 h-px bg-[#E8E1D6]" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-[#8A7060]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-bold text-[#C07A4A] hover:text-[#A8633A] transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Bottom note */}
        <p className="text-center text-xs text-[#B09A88] mt-6">
          Built by parents, not by algorithms. Always free.
        </p>
      </div>
    </div>
  );
}
