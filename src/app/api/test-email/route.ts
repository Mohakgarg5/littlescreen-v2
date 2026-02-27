import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { decodeToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const decoded = decodeToken(request);
  const lsToken = request.cookies.get("ls_token")?.value;

  // Step 1: what's in the JWT?
  const jwtInfo = {
    hasToken: !!lsToken,
    decodedId: decoded?.id,
    decodedEmail: decoded?.email,
    decodedName: decoded?.name,
    onboardingComplete: decoded?.onboardingComplete,
  };

  // Step 2: fetch from upstream
  let upstreamEmail: string | undefined;
  let upstreamName: string | undefined;
  let upstreamError: string | undefined;

  if (lsToken) {
    try {
      const me = await fetch("https://nuventionmedia.vercel.app/api/auth/me", {
        headers: { Cookie: `token=${lsToken}` },
        cache: "no-store",
      });
      const data = await me.json();
      upstreamEmail = data.user?.email || data.email;
      upstreamName = data.user?.name || data.name;
      if (!me.ok) upstreamError = JSON.stringify(data);
    } catch (e) {
      upstreamError = String(e);
    }
  }

  const finalEmail = decoded?.email || upstreamEmail;
  const finalName = decoded?.name || upstreamName || "";

  // Step 3: try sending
  let resendResult: unknown;
  let resendError: unknown;

  if (finalEmail) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: finalEmail,
      subject: "littleScreen test email",
      html: `<p>Hello ${finalName || finalEmail}! This is a test from littleScreen. If you got this, email is working ✅</p>`,
    });
    resendResult = result.data;
    resendError = result.error;
  }

  return NextResponse.json({
    jwtInfo,
    upstream: { email: upstreamEmail, name: upstreamName, error: upstreamError },
    finalEmail,
    resend: { result: resendResult, error: resendError },
    env: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      fromEmail: process.env.RESEND_FROM_EMAIL,
    },
  });
}
