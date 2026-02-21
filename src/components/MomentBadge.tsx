import { MOMENTS, Moment } from "@/lib/data";

interface MomentBadgeProps {
  moment: Moment;
  size?: "sm" | "md";
}

export default function MomentBadge({ moment, size = "sm" }: MomentBadgeProps) {
  const m = MOMENTS.find((x) => x.id === moment);
  if (!m) return null;

  if (size === "md") {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
        style={{ backgroundColor: m.bg, color: m.color }}
      >
        <span>{m.emoji}</span>
        {m.label}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: m.bg, color: m.color }}
    >
      <span className="text-xs">{m.emoji}</span>
      {m.label}
    </span>
  );
}
