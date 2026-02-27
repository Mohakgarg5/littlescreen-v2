import { NextRequest } from "next/server";

export interface DecodedToken {
  id: string;
  email?: string;
  name?: string;
  onboardingComplete?: boolean;
  exp?: number;
}

export function decodeToken(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get("ls_token")?.value;
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    );

    // Guard against expired tokens
    if (payload.exp && payload.exp < Date.now() / 1000) return null;

    // Upstream JWT may use 'id', 'sub', or 'userId'
    const rawId = payload.id ?? payload.sub ?? payload.userId;
    if (!rawId) return null;

    return {
      ...payload,
      id: String(rawId), // always store as string in Supabase TEXT columns
    };
  } catch {
    return null;
  }
}
