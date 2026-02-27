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
  { id: "physical_activity", label: "Physical activity",  emoji: "🏃" },
  { id: "social_connection", label: "Social connection",  emoji: "🤝" },
  { id: "mental_health",     label: "Mental health",      emoji: "🧠" },
  { id: "online_safety",     label: "Online safety",      emoji: "🔒" },
  { id: "schoolwork",        label: "Schoolwork",         emoji: "📚" },
  { id: "sleep",             label: "Sleep",              emoji: "😴" },
];

// ── Step 0: Kids ──
function StepKids({
  children,
  onChange,
  onNext,
}: {
  children: ChildForm[];
  onChange: (c: ChildForm[]) => void;
  onNext: () => void;
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

      <button
        onClick={onNext}
        disabled={!valid}
        className="w-full flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue <ArrowRight size={15} />
      </button>
    </div>
  );
}

// ── Step 1: Concerns ──
function StepConcerns({
  concerns,
  onToggle,
  onBack,
  onSubmit,
  loading,
  error,
}: {
  concerns: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}) {
  return (
    <div className="animate-fade-in-up">
      <div className="text-4xl mb-4 text-center">🎯</div>
      <h2 className="text-2xl sm:text-3xl font-black text-[#2D1F0E] text-center mb-2">
        What&apos;s your top concern with screen time?
      </h2>
      <p className="text-[#8A7060] text-sm text-center mb-8">
        We&apos;ll personalise your feed. Select all that apply.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
        {CONCERNS.map(({ id, label, emoji }) => {
          const active = concerns.includes(id);
          return (
            <button
              key={id}
              onClick={() => onToggle(id)}
              className={`flex items-center gap-2 px-3.5 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                active
                  ? "bg-[#F3E3D3] border-[#C07A4A] text-[#C07A4A]"
                  : "bg-white border-[#E8E1D6] text-[#6A5A4A] hover:border-[#C07A4A]/40"
              }`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="text-xs leading-tight">{label}</span>
              {active && <Check size={12} className="ml-auto flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-[#E8E1D6] text-[#8A7060] hover:bg-[#F7F2EB] transition-all text-sm font-medium"
        >
          <ArrowLeft size={15} /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-[#C07A4A] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#A8633A] transition-colors shadow-md disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Setting up…</>
          ) : (
            <>Start Exploring <ArrowRight size={15} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main onboarding page ──
export default function OnboardingPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [childForms, setChildForms] = useState<ChildForm[]>([
    { name: "", dateOfBirth: "" },
  ]);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleConcern = useCallback((id: string) => {
    setConcerns((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleFinish = async () => {
    setError("");
    setLoading(true);
    try {
      // Run both calls in parallel: upstream onboarding + local concerns
      await Promise.all([
        fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ children: childForms }),
        }).then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Setup failed");
        }),
        concerns.length > 0
          ? fetch("/api/parent-concerns", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ concerns }),
            })
          : Promise.resolve(),
      ]);
      await refreshUser();
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex items-center gap-1.5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-[#C07A4A] w-6" : "bg-[#E8E1D6] w-4"
                }`}
              />
            ))}
            <span className="text-xs text-[#B09A88] ml-1 font-medium">
              {step + 1}/2
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[#E8E1D6] shadow-xl p-8">
          {step === 0 && (
            <StepKids
              children={childForms}
              onChange={setChildForms}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <StepConcerns
              concerns={concerns}
              onToggle={toggleConcern}
              onBack={() => setStep(0)}
              onSubmit={handleFinish}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
