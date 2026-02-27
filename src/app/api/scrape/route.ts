import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import axios from "axios";
import * as cheerio from "cheerio";

type ScraperSource = "kids_in_mind" | "common_sense_media" | "plugged_in";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function scrapeKidsInMind(title: string) {
  const searchUrl = `https://www.kids-in-mind.com/cgi-bin/search/search.pl?q=${encodeURIComponent(title)}`;
  const { data: searchHtml } = await axios.get(searchUrl, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 10000,
  });

  const $s = cheerio.load(searchHtml);
  // Find first result link
  const firstLink = $s("a").filter((_, el) => {
    const href = $s(el).attr("href") || "";
    return href.includes("kids-in-mind.com") && !href.includes("search");
  }).first().attr("href");

  if (!firstLink) return null;

  await delay(1500);

  const { data: detailHtml } = await axios.get(firstLink, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 10000,
  });

  const $d = cheerio.load(detailHtml);

  // Kids-In-Mind shows ratings like "2.5.6" (sex/violence/language) in title or header
  const titleText = $d("title").text();
  const ratingMatch = titleText.match(/(\d+)\.(\d+)\.(\d+)/);

  if (!ratingMatch) {
    // Try the page content
    const bodyText = $d("body").text();
    const bodyMatch = bodyText.match(/(\d+)[\s.\/]+(\d+)[\s.\/]+(\d+)/);
    if (!bodyMatch) return null;
    return {
      sex_romance_nudity: parseInt(bodyMatch[1]),
      violence_scariness: parseInt(bodyMatch[2]),
      language: parseInt(bodyMatch[3]),
    };
  }

  return {
    sex_romance_nudity: parseInt(ratingMatch[1]),
    violence_scariness: parseInt(ratingMatch[2]),
    language: parseInt(ratingMatch[3]),
  };
}

async function scrapeCommonSenseMedia(title: string) {
  const searchUrl = `https://www.commonsensemedia.org/search/${encodeURIComponent(title)}`;
  const { data: searchHtml } = await axios.get(searchUrl, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 10000,
  });

  const $s = cheerio.load(searchHtml);

  // Find first result with age rating
  let ageRating: number | null = null;

  // CSM shows age ratings in search results
  const ageText = $s("[class*='rating'], [class*='age']").first().text().trim();
  const ageMatch = ageText.match(/(\d+)\+?/);
  if (ageMatch) ageRating = parseInt(ageMatch[1]);

  // If no age from search, try to get it from first result page
  if (!ageRating) {
    const firstLink = $s("a[href*='/reviews/']").first().attr("href");
    if (firstLink) {
      await delay(1500);
      const fullUrl = firstLink.startsWith("http") ? firstLink : `https://www.commonsensemedia.org${firstLink}`;
      const { data: detailHtml } = await axios.get(fullUrl, {
        headers: { "User-Agent": USER_AGENT },
        timeout: 10000,
      });
      const $d = cheerio.load(detailHtml);
      const detailAgeText = $d("[class*='age'], [data-testid*='age']").first().text().trim();
      const detailAgeMatch = detailAgeText.match(/(\d+)/);
      if (detailAgeMatch) ageRating = parseInt(detailAgeMatch[1]);
    }
  }

  return ageRating ? { age_min: ageRating } : null;
}

async function scrapePluggedIn(title: string) {
  const searchUrl = `https://www.pluggedin.com/?s=${encodeURIComponent(title)}`;
  const { data: searchHtml } = await axios.get(searchUrl, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 10000,
  });

  const $s = cheerio.load(searchHtml);

  // Find first review link
  const firstLink = $s("article a, .entry-title a").first().attr("href");
  if (!firstLink) return null;

  await delay(1500);

  const { data: detailHtml } = await axios.get(firstLink, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 10000,
  });

  const $d = cheerio.load(detailHtml);

  // Plugged In shows content concerns in sections
  const hasViolence = $d("body").text().toLowerCase().includes("violence");
  const hasSexual = $d("body").text().toLowerCase().includes("sexual");
  const hasDrugs = $d("body").text().toLowerCase().includes("drug");

  // Extract age recommendation if present
  const ageText = $d("[class*='age'], [class*='rating']").first().text();
  const ageMatch = ageText.match(/(\d+)\+?/);
  const ageMin = ageMatch ? parseInt(ageMatch[1]) : null;

  return {
    age_min: ageMin,
    violence_scariness: hasViolence ? 3 : 0,
    sex_romance_nudity: hasSexual ? 3 : 0,
    drinking_drugs_smoking: hasDrugs ? 3 : 0,
  };
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, source } = body as { title: string; source: ScraperSource };

  if (!title || !source) {
    return NextResponse.json({ error: "title and source are required" }, { status: 400 });
  }

  const validSources: ScraperSource[] = ["kids_in_mind", "common_sense_media", "plugged_in"];
  if (!validSources.includes(source)) {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 });
  }

  try {
    let scraped: Record<string, unknown> | null = null;

    if (source === "kids_in_mind") {
      scraped = await scrapeKidsInMind(title);
    } else if (source === "common_sense_media") {
      scraped = await scrapeCommonSenseMedia(title);
    } else if (source === "plugged_in") {
      scraped = await scrapePluggedIn(title);
    }

    if (!scraped) {
      return NextResponse.json({ error: "Content not found on source" }, { status: 404 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("content_ratings")
      .upsert(
        { title, source, ...scraped, scraped_at: new Date().toISOString() },
        { onConflict: "title,source" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Scraping failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
