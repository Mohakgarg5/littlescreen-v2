import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: feedbackRows, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("email_sent", false)
    .gte("created_at", oneWeekAgo)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!feedbackRows || feedbackRows.length === 0) {
    return NextResponse.json({ ok: true, message: "No unsent feedback" });
  }

  // Aggregate stats
  const withRatings = feedbackRows.filter((f) => f.rating !== null);
  const avgRating = withRatings.length > 0
    ? (withRatings.reduce((sum, f) => sum + f.rating, 0) / withRatings.length).toFixed(1)
    : "N/A";

  const ratingCounts = [1, 2, 3, 4, 5].map((r) => ({
    rating: r,
    count: withRatings.filter((f) => f.rating === r).length,
  }));

  const comments = feedbackRows
    .filter((f) => f.comment)
    .slice(0, 10)
    .map((f) => `<li style="margin-bottom:8px;color:#4A3728;">"${f.comment}" <span style="color:#B09A88;font-size:12px;">(${f.trigger})</span></li>`)
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FEFAF5;">
      <div style="text-align:center;margin-bottom:24px;">
        <span style="font-size:32px;">📺</span>
        <h1 style="color:#C07A4A;font-size:24px;margin:8px 0;">littleScreen Weekly Feedback</h1>
        <p style="color:#8A7060;font-size:14px;">Past 7 days summary</p>
      </div>

      <div style="background:white;border-radius:16px;padding:20px;border:1px solid #E8E1D6;margin-bottom:16px;">
        <h2 style="color:#2D1F0E;font-size:18px;margin:0 0 16px;">Overview</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;color:#6A5A4A;font-size:14px;">Total feedback entries</td>
            <td style="padding:8px 0;color:#2D1F0E;font-weight:bold;text-align:right;">${feedbackRows.length}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6A5A4A;font-size:14px;">With ratings</td>
            <td style="padding:8px 0;color:#2D1F0E;font-weight:bold;text-align:right;">${withRatings.length}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#6A5A4A;font-size:14px;">Average rating</td>
            <td style="padding:8px 0;color:#C07A4A;font-weight:bold;font-size:18px;text-align:right;">⭐ ${avgRating}/5</td>
          </tr>
        </table>
      </div>

      <div style="background:white;border-radius:16px;padding:20px;border:1px solid #E8E1D6;margin-bottom:16px;">
        <h2 style="color:#2D1F0E;font-size:18px;margin:0 0 16px;">Rating Breakdown</h2>
        ${ratingCounts.map(({ rating, count }) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <span style="font-size:14px;width:24px;">${"⭐".repeat(rating)}</span>
            <div style="flex:1;height:8px;background:#F7F2EB;border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${feedbackRows.length > 0 ? Math.round((count / feedbackRows.length) * 100) : 0}%;background:#C07A4A;border-radius:4px;"></div>
            </div>
            <span style="font-size:12px;color:#8A7060;width:20px;">${count}</span>
          </div>
        `).join("")}
      </div>

      ${comments ? `
      <div style="background:white;border-radius:16px;padding:20px;border:1px solid #E8E1D6;">
        <h2 style="color:#2D1F0E;font-size:18px;margin:0 0 16px;">Recent Comments</h2>
        <ul style="padding-left:16px;margin:0;">${comments}</ul>
      </div>
      ` : ""}

      <p style="text-align:center;color:#B09A88;font-size:12px;margin-top:24px;">
        littleScreen Admin · Auto-generated weekly summary
      </p>
    </div>
  `;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: process.env.RESEND_ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL!,
    subject: `littleScreen: ${feedbackRows.length} feedback entries this week (avg ${avgRating}★)`,
    html,
  });

  if (emailError) {
    return NextResponse.json({ error: String(emailError) }, { status: 500 });
  }

  // Mark all as sent
  const ids = feedbackRows.map((f) => f.id);
  await supabase.from("feedback").update({ email_sent: true }).in("id", ids);

  return NextResponse.json({ ok: true, sent: feedbackRows.length });
}
