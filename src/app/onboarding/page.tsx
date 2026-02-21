"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2, Check, Calendar } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

// ── Types ──
interface ChildForm {
  name: string;
  dateOfBirth: string;
}

// ── Helpers ──
function ageFromDOB(dob: string): string {
  if (!dob) return "";
  const birth = new Date(dob);
  const now = new Date();
  const months =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} old`;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  return remMonths > 0 ? `${years}y ${remMonths}m old` : `${years} years old`;
}

const CONCERNS = [
  { id: "speech",    label: "Speech / language delays",   emoji: "🗣️" },
  { id: "screen",    label: "Screen addiction fears",     emoji: "📵" },
  { id: "content",   label: "Inappropriate content",      emoji: "⚠️" },
  { id: "sleep",     label: "Sleep disruption",           emoji: "😴" },
  { id: "attention", label: "Short attention span",       emoji: "🎯" },
  { id: "emotions",  label: "Emotional regulation",       emoji: "😤" },
];

const SITUATIONS = [
  { id: "bedtime",    label: "Bedtime wind-down",  emoji: "🌙" },
  { id: "travel",     label: "Long flights/travel", emoji: "✈️" },
  { id: "restaurant", label: "Restaurant waits",   emoji: "🍕" },
  { id: "sick-day",   label: "Sick days",           emoji: "🤒" },
  { id: "morning",    label: "Morning routine",     emoji: "☀️" },
  { id: "learning",   label: "Learning time",       emoji: "📚" },
];

// ── Step components ──
function StepWelcome({ name, onNext }: { name: string; onNext: () => void }) {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-7xl mb-5 animate-float inline-block">📺</div>
      <h1 className="text-3xl sm:text-4xl font-black text-[#2D1F0E] mb-3">
        Welcome, {name?.split(" ")[0] || "Parent"}! 👋
      </h1>
      <p className="text-[#6A5A4A] text-lg mb-2 leading-relaxed max-w-md mx-auto">
        Let&apos;s set up your littleScreen so we can show you
        content that actually works for your kids.
      </p>
      <p className="text-[#B09A88] text-sm mb-10">
        Takes about 1 minute · No credit card needed
      </p>
      <div className="grid grid-cols-3 gap-4 mb-10 max-w-sm mx-auto">
        {[
          { emoji: "✅", label: "Parent-verified videos" },
          { emoji: "🎯", label: "Age-matched picks" },
          { emoji: "🔒", label: "No ads, no algorithms" },
        ].map(({ emoji, label }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-[#E8E1D6] shadow-sm text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="text-xs font-semibold text-[#4A3728] leading-tight">{label}</div>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        className="inline-flex items-center gap-2 bg-[#C07A4A] text-white px-10 py-4 rounded-2xl font-bold text-base hover:bg-[#A8633A] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-transform"
      >
        Let&apos;s get started <ArrowRight size={18} />
      </button>
    </div>
  );
}

function StepKids({
  children,
  onChange,
  onNext,
  onBack,
}: {
  children: ChildForm[];
  onChange: (c: ChildForm[]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const addChild = () =>
    onChange([...children, { name: "", dateOfBirth: "" }]);

  const removeChild = (i: number) =>
    onChange(children.filter((_, idx) => idx !== i));

  const updateChild = (i: number, field: keyof ChildForm, value: string) => {
    const next = [...children];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  const valid = children.length > 0 && children.every((c) => c.name && c.dateOfBirth);

  return (
    <div className="animate-fade-in-up">
      <div className="text-4xl mb-4 text-center">👶</div>
      <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E] text-center mb-2">
        Tell us about your little ones
      </h2>
      <p className="text-[#8A7060] text-sm text-center mb-8">
        We&apos;ll use their ages to surface the most relevant content.
      </p>

      <div className="space-y-4 mb-5">
        {children.map((child, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8E1D6] p-5 shadow-sm relative">
            {children.length > 1 && (
              <button
                onClick={() => removeChild(i)}
                className="absolute top-4 right-4 p-1.5 text-[#C9B9A8] hover:text-red-400 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={15} />
              </button>
            )}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#F3E3D3] flex items-center justify-center text-sm font-bold text-[#C07A4A]">
                {i + 1}
              </div>
              <span className="font-semibold text-[#4A3728] text-sm">Child {i + 1}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#6A5A4A] mb-1.5 uppercase tracking-wide">
                  Name
                </label>
                <input
                  type="text"
                  value={child.name}
                  onChange={(e) => updateChild(i, "name", e.target.value)}
                  placeholder="e.g. Emma"
                  className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] placeholder-[#B09A88] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#6A5A4A] mb-1.5 uppercase tracking-wide flex items-center gap-1">
                  <Calendar size={11} /> Birthday
                </label>
                <input
                  type="date"
                  value={child.dateOfBirth}
                  onChange={(e) => updateChild(i, "dateOfBirth", e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  min={new Date(Date.now() - 6 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  className="w-full px-4 py-3 bg-[#F7F2EB] border border-[#E8E1D6] rounded-xl text-sm text-[#2D1F0E] focus:outline-none focus:border-[#C07A4A] focus:ring-2 focus:ring-[#C07A4A]/10 transition-all"
                />
                {child.dateOfBirth && (
                  <p className="text-xs text-[#5E8F75] mt-1 font-medium">
                    🎂 {ageFromDOB(child.dateOfBirth)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {children.length < 4 && (
        <button
          onClick={addChild}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-[#D6CEC3] text-[#8A7060] hover:border-[#C07A4A]/60 hover:text-[#C07A4A] hover:bg-[#F7F2EB] transition-all text-sm font-medium mb-6"
        >
          <Plus size={16} />
          Add another child
        </button>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[#E8E1D6] text-[#8A7060] hover:bg-[#F7F2EB] transition-all text-sm font-medium">
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!valid}
          className="flex-1 flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function StepPreferences({
  concerns,
  situations,
  onToggleConcern,
  onToggleSituation,
  onNext,
  onBack,
}: {
  concerns: string[];
  situations: string[];
  onToggleConcern: (id: string) => void;
  onToggleSituation: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="animate-fade-in-up">
      <div className="text-4xl mb-4 text-center">🎯</div>
      <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E] text-center mb-2">
        What matters most to you?
      </h2>
      <p className="text-[#8A7060] text-sm text-center mb-8">
        We&apos;ll personalise your discover feed. Select all that apply.
      </p>

      <div className="mb-6">
        <h3 className="font-bold text-[#4A3728] text-sm uppercase tracking-wider mb-3">
          My concerns
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CONCERNS.map(({ id, label, emoji }) => {
            const active = concerns.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggleConcern(id)}
                className={`flex items-center gap-2 px-3.5 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  active
                    ? "bg-[#F3E3D3] border-[#C07A4A] text-[#C07A4A]"
                    : "bg-white border-[#E8E1D6] text-[#6A5A4A] hover:border-[#C07A4A]/40"
                }`}
              >
                <span>{emoji}</span>
                <span className="text-xs leading-tight">{label}</span>
                {active && <Check size={12} className="ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-[#4A3728] text-sm uppercase tracking-wider mb-3">
          Situations I need help with
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SITUATIONS.map(({ id, label, emoji }) => {
            const active = situations.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggleSituation(id)}
                className={`flex items-center gap-2 px-3.5 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                  active
                    ? "bg-[#EEF7F2] border-[#5E8F75] text-[#5E8F75]"
                    : "bg-white border-[#E8E1D6] text-[#6A5A4A] hover:border-[#5E8F75]/40"
                }`}
              >
                <span>{emoji}</span>
                <span className="text-xs leading-tight">{label}</span>
                {active && <Check size={12} className="ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[#E8E1D6] text-[#8A7060] hover:bg-[#F7F2EB] transition-all text-sm font-medium">
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md"
        >
          Almost done <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function StepDone({
  name,
  children,
  loading,
  error,
  onSubmit,
  onBack,
}: {
  name: string;
  children: ChildForm[];
  loading: boolean;
  error: string;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="text-7xl mb-5">🎉</div>
      <h2 className="text-3xl font-black text-[#2D1F0E] mb-3">
        You&apos;re all set, {name?.split(" ")[0]}!
      </h2>
      <p className="text-[#6A5A4A] mb-8 leading-relaxed max-w-sm mx-auto">
        We&apos;ll personalise your video feed based on your kids&apos; ages and your preferences.
      </p>

      {/* Kids summary */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {children.map((c, i) => (
          <div key={i} className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-[#E8E1D6] shadow-sm">
            <span className="text-xl">{["👶","🧒","👦","👧"][i % 4]}</span>
            <div className="text-left">
              <div className="font-bold text-[#2D1F0E] text-sm">{c.name}</div>
              <div className="text-xs text-[#8A7060]">{ageFromDOB(c.dateOfBirth)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* What they'll get */}
      <div className="bg-[#F7F2EB] rounded-2xl p-5 mb-8 text-left border border-[#E8E1D6] space-y-3">
        {[
          "🎬  500+ parent-verified videos matched to your kids' ages",
          "🎵  Curated playlists for bedtime, travel, sick days & more",
          "💬  Community posts — what worked for families like yours",
        ].map((item) => (
          <div key={item} className="text-sm text-[#4A3728]">{item}</div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[#E8E1D6] text-[#8A7060] hover:bg-[#F7F2EB] transition-all text-sm font-medium">
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3.5 rounded-xl font-bold hover:bg-[#A8633A] transition-colors shadow-lg disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Setting up…</>
          ) : (
            <>Start Exploring <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main onboarding page ──
export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [childForms, setChildForms] = useState<ChildForm[]>([
    { name: "", dateOfBirth: "" },
  ]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [situations, setSituations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleConcern = useCallback((id: string) => {
    setConcerns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const toggleSituation = useCallback((id: string) => {
    setSituations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleFinish = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ children: childForms }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Setup failed");
      await refreshUser();
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = 4;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(145deg, #FDF7EE 0%, #F0EBE0 100%)" }}
    >
      {/* Subtle blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #E8B86D, transparent)" }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5E8F75, transparent)" }} />

      <div className="relative w-full max-w-lg">
        {/* Logo + step indicator */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C07A4A] to-[#5E8F75] flex items-center justify-center">
              <span className="text-white text-sm">📺</span>
            </div>
            <span className="font-bold text-lg">
              <span className="text-[#C07A4A]">little</span>
              <span className="text-[#5E8F75]">Screen</span>
            </span>
          </div>
          {step > 0 && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: STEPS - 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < step ? "bg-[#C07A4A] w-6" : i === step ? "bg-[#E8C8A8] w-4" : "bg-[#E8E1D6] w-4"
                  }`}
                />
              ))}
              <span className="text-xs text-[#B09A88] ml-1 font-medium">
                {step}/{STEPS - 1}
              </span>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D6] shadow-xl p-8">
          {step === 0 && (
            <StepWelcome
              name={user?.name || ""}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepKids
              children={childForms}
              onChange={setChildForms}
              onNext={() => setStep(2)}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <StepPreferences
              concerns={concerns}
              situations={situations}
              onToggleConcern={toggleConcern}
              onToggleSituation={toggleSituation}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepDone
              name={user?.name || ""}
              children={childForms}
              loading={loading}
              error={error}
              onSubmit={handleFinish}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
