import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/lib/supabase";
import { decodeToken } from "@/lib/auth";

const CONCERN_LABELS: Record<string, string> = {
  physical_activity: "Physical activity 🏃",
  social_connection:  "Social connection 🤝",
  mental_health:      "Mental health 🧠",
  online_safety:      "Online safety 🔒",
  schoolwork:         "Schoolwork 📚",
  sleep:              "Sleep 😴",
};

async function sendDashboardCheckEmail(
  email: string,
  name: string,
  userId: string,
  supabase: ReturnType<typeof getSupabaseAdmin>
) {
  // Fetch their playlists + concerns in parallel
  const [{ data: playlists }, { data: concerns }] = await Promise.all([
    supabase
      .from("playlists")
      .select("id, name, moment")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(3),
    supabase
      .from("parent_concerns")
      .select("concern")
      .eq("user_id", userId),
  ]);

  const firstName = name?.split(" ")[0] || "there";

  const playlistsHtml = playlists && playlists.length > 0
    ? `
      <div style="background:white;border-radius:16px;padding:20px;border:1px solid #E8E1D6;margin-bottom:16px;">
        <h2 style="color:#2D1F0E;font-size:16px;margin:0 0 12px;">Your recent playlists 🎵</h2>
        ${playlists.map((p) => `
          <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F3EDE4;">
            <span style="font-size:20px;">${p.moment ? "🎵" : "📋"}</span>
            <span style="color:#4A3728;font-size:14px;font-weight:600;">${p.name}</span>
          </div>
        `).join("")}
      </div>`
    : "";

  const concernTip = concerns && concerns.length > 0
    ? (() => {
        const c = concerns[Math.floor(Math.random() * concerns.length)].concern;
        const tips: Record<string, string> = {
          physical_activity: "Try balancing screen time with an active break — even 10 minutes of movement makes a difference.",
          social_connection: "After screen time, ask your child one question about what they watched — it sparks real conversation.",
          mental_health:     "Calm content before bed (like nature videos or soft music) can help with emotional regulation.",
          online_safety:     "Co-watching occasionally helps you see exactly what your child is exposed to.",
          schoolwork:        "Educational playlists tagged 'learning' can make screen time feel purposeful.",
          sleep:             "A screen-free wind-down of 30 minutes before bed makes a measurable difference in sleep quality.",
        };
        const label = CONCERN_LABELS[c] || c;
        const tip = tips[c] || "Keep up the intentional parenting — it matters more than you know.";
        return `
          <div style="background:#F3E3D3;border-radius:16px;padding:20px;margin-bottom:16px;border-left:4px solid #C07A4A;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;text-transform:uppercase;color:#C07A4A;letter-spacing:0.5px;">Tip for your concern: ${label}</p>
            <p style="margin:0;font-size:14px;color:#4A3728;line-height:1.6;">${tip}</p>
          </div>`;
      })()
    : "";

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#FEFAF5;">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="font-size:36px;">📺</span>
        <h1 style="color:#C07A4A;font-size:22px;margin:8px 0 4px;">Hey ${firstName} 👋</h1>
        <p style="color:#8A7060;font-size:14px;margin:0;">Checking in from littleScreen</p>
      </div>

      <div style="background:white;border-radius:16px;padding:20px;border:1px solid #E8E1D6;margin-bottom:16px;">
        <p style="color:#2D1F0E;font-size:15px;line-height:1.7;margin:0;">
          How's screen time going this week? We hope the content you've been exploring has been helpful for your little ones. 💛
        </p>
      </div>

      ${concernTip}
      ${playlistsHtml}

      <div style="background:white;border-radius:16px;padding:20px;border:1px solid #E8E1D6;margin-bottom:16px;text-align:center;">
        <p style="color:#6A5A4A;font-size:14px;margin:0 0 14px;">How is littleScreen working for you?</p>
        <div style="display:flex;justify-content:center;gap:8px;">
          ${[1,2,3,4,5].map((r) => `
            <a href="https://littlescreen-v2.vercel.app" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background:#F7F2EB;border-radius:10px;text-decoration:none;font-size:18px;">
              ${"⭐".repeat(r)}
            </a>
          `).join("")}
        </div>
      </div>

      <p style="text-align:center;color:#B09A88;font-size:12px;margin-top:24px;">
        littleScreen · Parent-verified screen time, done right<br/>
        <a href="https://littlescreen-v2.vercel.app" style="color:#C07A4A;">Open app</a>
      </p>
    </div>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `Hey ${firstName}, how's screen time going? 📺`,
    html,
  });
}

export async function POST(request: NextRequest) {
  const decoded = decodeToken(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { video_id, trigger, rating, comment } = body;

  if (!trigger) {
    return NextResponse.json({ error: "trigger is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // For dashboard_check: skip if already sent in last 24 hours
  if (trigger === "dashboard_check") {
    const { data: recent } = await supabase
      .from("feedback")
      .select("id")
      .eq("user_id", decoded.id)
      .eq("trigger", "dashboard_check")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(1);

    if (recent && recent.length > 0) {
      return NextResponse.json({ ok: true, skipped: true });
    }
  }

  const { error } = await supabase.from("feedback").insert({
    user_id: decoded.id,
    video_id: video_id || null,
    trigger,
    rating: rating ?? null,
    comment: comment?.trim() || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send personal check-in email to the parent on dashboard_check
  if (trigger === "dashboard_check" && decoded.email) {
    sendDashboardCheckEmail(
      decoded.email,
      decoded.name || "",
      decoded.id,
      supabase
    ).catch(() => {}); // fire-and-forget, don't block the response
  }

  return NextResponse.json({ ok: true });
}
