import { NextResponse } from "next/server";

const API = "https://nuventionmedia.vercel.app";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const res = await fetch(`${API}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Could not create account" },
        { status: res.status }
      );
    }

    // After signup, do an immediate login to get the token
    const loginRes = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });

    const loginData = await loginRes.json();
    const setCookieHeader = loginRes.headers.get("set-cookie") || "";
    const tokenMatch = setCookieHeader.match(/(?:^|,\s*)token=([^;,\s]+)/);
    const token = tokenMatch?.[1];

    if (!token) {
      return NextResponse.json({ error: "Account created but session could not be issued — please log in" }, { status: 500 });
    }

    const response = NextResponse.json({ user: loginData.user ?? data.user });
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
