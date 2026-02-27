import { NextResponse } from "next/server";

const API = "https://nuventionmedia.vercel.app";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Invalid email or password" },
        { status: res.status }
      );
    }

    // Extract JWT from upstream Set-Cookie header
    const setCookieHeader = res.headers.get("set-cookie") || "";
    const tokenMatch = setCookieHeader.match(/(?:^|,\s*)token=([^;,\s]+)/);
    const token = tokenMatch?.[1];

    if (!token) {
      return NextResponse.json({ error: "Authentication failed — could not issue session" }, { status: 500 });
    }

    const response = NextResponse.json({ user: data.user ?? data });
    response.cookies.set("ls_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Connection error" }, { status: 500 });
  }
}
