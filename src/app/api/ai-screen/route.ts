import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSupabaseAdmin } from "@/lib/supabase";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, description, channelName, ageMin, ageMax } = body;

  if (!title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const prompt = `You are a child safety content reviewer for a parent-verified platform for children ages 0-6.

Content to review:
Title: ${title}
Channel: ${channelName || "Unknown"}
Description: ${description || "No description provided"}
Target age range: ${ageMin ?? 0}–${ageMax ?? 6} years

Assess this content for age-appropriateness for young children (0-6 years). Consider:
1. Is the content safe and appropriate for young children?
2. Does it contain any concerning themes (violence, inappropriate language, scary content, adult topics)?
3. Is it genuinely educational or entertaining for the target age group?
4. Does the channel name suggest family-friendly content?

Respond with ONLY valid JSON, no markdown, no extra text:
{
  "approved": true,
  "score": 0.95,
  "notes": "Brief explanation under 100 words"
}`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0]?.type === "text" ? message.content[0].text : null;
    if (!content) {
      return NextResponse.json({ error: "Unexpected response from AI" }, { status: 500 });
    }

    let parsed: { approved: boolean; score: number; notes: string };
    try {
      // Strip any markdown code fences if present
      const cleaned = content.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("content_ratings")
      .upsert(
        {
          title,
          source: "ai_screen",
          ai_approved: parsed.approved,
          ai_score: parsed.score,
          ai_notes: parsed.notes,
          scraped_at: new Date().toISOString(),
        },
        { onConflict: "title,source" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data, result: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI screening failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
