import { NextRequest, NextResponse } from "next/server";

const API = "https://nuventionmedia.vercel.app";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("ls_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const res = await fetch(`${API}/api/onboarding`, {
      method: "POST",
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // Onboarding re-issues JWT — extract and update our cookie
    const setCookieHeader = res.headers.get("set-cookie") || "";
    const tokenMatch = setCookieHeader.match(/(?:^|,\s*)token=([^;,\s]+)/);
    const newToken = tokenMatch?.[1];

    const response = NextResponse.json(data);

    if (newToken) {
      response.cookies.set("ls_token", newToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Connection error" }, { status: 500 });
  }
}
