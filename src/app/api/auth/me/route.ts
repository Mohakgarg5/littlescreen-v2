import { NextRequest, NextResponse } from "next/server";

const API = "https://nuventionmedia.vercel.app";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("ls_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API}/api/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: "Connection error" }, { status: 500 });
  }
}
