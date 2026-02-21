import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Shield, Users, Heart, Star, MessageCircleHeart } from "lucide-react";
import { MOMENTS, SAMPLE_PLAYLISTS } from "@/lib/data";
import { COMMUNITY_POSTS } from "@/lib/community";
import PlaylistCard from "@/components/PlaylistCard";
import WhatWorkedCard from "@/components/WhatWorkedCard";

const TRUST_STATS = [
  { value: "12,000+", label: "Parent Reviews",       icon: Users  },
  { value: "98%",     label: "No Ads or Algorithms", icon: Shield },
  { value: "4.8★",    label: "Avg Parent Rating",    icon: Star   },
  { value: "Free",    label: "Always & Forever",     icon: Heart  },
];

const HOW_IT_WORKS = [
  {
    step: "01", emoji: "🔍",
    title: "Find your moment",
    desc: "Bedtime meltdown? Long flight? Pick your moment and get a curated shortlist — not a scroll-hole.",
    color: "from-[#C07A4A] to-[#D4956A]",
  },
  {
    step: "02", emoji: "✅",
    title: "Trust real parents",
    desc: "Every pick is added by a real parent, tagged by age and moment, rated by whether it actually worked.",
    color: "from-[#5E8F75] to-[#7AAF93]",
  },
  {
    step: "03", emoji: "📋",
    title: "Save your playlist",
    desc: "Build a personal library of trusted content and resources. Your bedtime playlist, always ready.",
    color: "from-[#8878C8] to-[#A898D8]",
  },
];

export default function HomePage() {
  const featuredPlaylists = SAMPLE_PLAYLISTS.slice(0, 4);
  const previewPosts = COMMUNITY_POSTS.slice(0, 2);

  return (
    <div className="min-h-screen bg-[#F7F2EB]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-14 pb-20 px-4"
        style={{ background: "linear-gradient(145deg, #FDF7EE 0%, #F5EFE4 50%, #EEE8F5 100%)" }}
      >
        {/* Soft blobs */}
        <div className="animate-blob absolute -top-24 -left-16 w-72 h-72 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, #E8B86D, transparent)" }} />
        <div className="animate-blob absolute -bottom-20 -right-16 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #5E8F75, transparent)", animationDelay: "4s" }} />

        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-[#C07A4A] bg-[#F3E3D3] border border-[#E8C8A8] text-sm font-medium px-4 py-1.5 rounded-full mb-7">
            <Sparkles size={13} />
            Built by parents, not by algorithms
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2D1F0E] leading-tight mb-6">
            Screen time that{" "}
            <span className="gradient-text">actually works</span>
            <br className="hidden sm:block" />
            {" "}for your little one
          </h1>

          <p className="text-base sm:text-lg text-[#6A5A4A] max-w-xl mx-auto mb-10 leading-relaxed">
            No endless scrolling. No algorithm traps. Parent-verified playlists and
            real-family resources — organized by <strong className="text-[#2D1F0E]">moments that matter</strong>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/discover"
              className="flex items-center justify-center gap-2 bg-[#C07A4A] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-[#A8633A] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-base"
            >
              Explore Parent Picks <ArrowRight size={15} />
            </Link>
            <Link href="/community"
              className="flex items-center justify-center gap-2 bg-white text-[#4A3728] border border-[#E8E1D6] px-8 py-3.5 rounded-2xl font-semibold hover:border-[#C07A4A]/50 hover:text-[#C07A4A] transition-all shadow-sm text-base"
            >
              <MessageCircleHeart size={16} />
              What Worked For Us
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-[#8A7060]">
            <div className="flex -space-x-2">
              {["👩", "👨", "👩‍🦱", "🧔"].map((emoji, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-[#EDE0D0] border-2 border-white flex items-center justify-center text-sm shadow-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <span>12,000+ parents already use littleScreen</span>
          </div>
        </div>
      </section>

      {/* ── Trust Stats ── */}
      <section className="bg-white border-y border-[#E8E1D6] py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-[#F3E3D3] rounded-xl mb-2">
                <Icon size={17} className="text-[#C07A4A]" />
              </div>
              <div className="text-2xl font-black text-[#2D1F0E]">{value}</div>
              <div className="text-xs text-[#8A7060] mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Moment ── */}
      <section className="py-16 px-4 bg-[#F7F2EB]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[#C07A4A] text-sm font-semibold uppercase tracking-wider mb-1">Browse by Moment</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E]">{"What's happening right now?"}</h2>
            </div>
            <Link href="/discover" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#C07A4A] hover:text-[#A8633A] transition-colors">
              See all <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MOMENTS.map((moment) => (
              <Link
                key={moment.id}
                href={`/discover?moment=${moment.id}`}
                className="card-lift flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-white border border-[#E8E1D6] shadow-sm hover:border-[#C07A4A]/40 text-center group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{moment.emoji}</span>
                <span className="text-xs font-semibold text-[#4A3728] leading-tight">{moment.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Playlists ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[#5E8F75] text-sm font-semibold uppercase tracking-wider mb-1">Community Favorites</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E]">Top Parent-Picked Playlists</h2>
            </div>
            <Link href="/playlists" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#5E8F75] hover:text-[#4A7A60] transition-colors">
              All playlists <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredPlaylists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* ── What Worked preview ── */}
      <section className="py-16 px-4 bg-[#F7F2EB]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[#C07A4A] text-sm font-semibold uppercase tracking-wider mb-1">Parent Knowledge</p>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E]">What worked for their kids</h2>
              <p className="text-[#8A7060] text-sm mt-1">
                Real stories with linked resources — YouTube, Amazon, books, apps.
              </p>
            </div>
            <Link href="/community" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#C07A4A] hover:text-[#A8633A] transition-colors">
              See all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-4">
            {previewPosts.map((post) => (
              <WhatWorkedCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C07A4A] hover:text-[#A8633A] bg-white px-5 py-2.5 rounded-xl border border-[#E8E1D6] shadow-sm transition-colors"
            >
              Read all community posts <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#5E8F75] text-sm font-semibold uppercase tracking-wider mb-2">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E] mb-12">
            Stop doom-scrolling. Start doing.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ step, emoji, title, desc, color }) => (
              <div key={step} className="relative text-left bg-[#F7F2EB] rounded-2xl p-6 border border-[#E8E1D6]">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${color} mb-4`}>
                  <span className="text-2xl">{emoji}</span>
                </div>
                <div className="absolute top-5 right-5 text-5xl font-black text-[#E8E1D6] select-none">{step}</div>
                <h3 className="font-bold text-[#2D1F0E] text-base mb-2">{title}</h3>
                <p className="text-[#8A7060] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UVP Banner ── */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #8D6A4A, #5E8F75)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📺</div>
          <blockquote className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
            &ldquo;The opposite of YouTube for kids.&rdquo;
          </blockquote>
          <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
            No engagement-bait. No autoplay rabbit holes. No algorithm.
            Just parents sharing what worked — and what didn&apos;t.
          </p>
          <Link href="/discover"
            className="inline-flex items-center gap-2 bg-white text-[#8D6A4A] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#F7F2EB] transition-colors shadow-lg"
          >
            <Sparkles size={15} />
            Start Exploring
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 px-4 bg-[#F7F2EB]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[#C07A4A] text-sm font-semibold uppercase tracking-wider mb-2">Real Parents</p>
          <h2 className="text-center text-2xl sm:text-3xl font-black text-[#2D1F0E] mb-10">
            What parents are saying
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { quote: "Finally a place where I can trust the recommendations. No random garbage after 5 minutes.", author: "Sarah M.", role: "Mom of 3y, 2y, 1y", emoji: "👩" },
              { quote: "Used the flight playlist on a 6-hour trip. My toddler was CALM the whole time. Game changer.", author: "James K.", role: "Dad of 2y", emoji: "👨" },
              { quote: "I love that I can see 'didn't work' feedback too. So much more honest than star ratings.", author: "Priya N.", role: "Mom of twins", emoji: "👩‍🦱" },
            ].map(({ quote, author, role, emoji }) => (
              <div key={author} className="bg-white rounded-2xl p-5 border border-[#E8E1D6] shadow-sm">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#E8B86D] text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#4A3728] text-sm leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#EDE0D0] flex items-center justify-center text-base">{emoji}</div>
                  <div>
                    <div className="text-sm font-semibold text-[#2D1F0E]">{author}</div>
                    <div className="text-xs text-[#8A7060]">{role}</div>
                  </div>
                  <CheckCircle2 size={13} className="ml-auto text-[#5E8F75]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#2D1F0E] text-[#8A7060] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center">
                <span className="text-white text-sm">📺</span>
              </div>
              <span className="font-bold text-white text-lg">
                <span className="text-[#D4956A]">little</span>
                <span className="text-[#7AAF93]">Screen</span>
              </span>
            </div>
            <div className="flex gap-6 text-sm">
              {["/discover", "/playlists", "/community", "/parents"].map((href) => (
                <Link key={href} href={href} className="hover:text-white transition-colors capitalize">
                  {href.replace("/", "")}
                </Link>
              ))}
            </div>
          </div>
          <div className="border-t border-[#4A3728] pt-6 text-center text-xs text-[#5A4A38]">
            © 2025 littleScreen — Built by parents, for parents. The opposite of YouTube for kids.
          </div>
        </div>
      </footer>
    </div>
  );
}
