import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const { allowed, remaining, resetAt } = checkRateLimit(ip);

  const response: NextResponse = allowed
    ? NextResponse.next()
    : NextResponse.json(
        { error: "Too many requests. Please slow down.", code: "RATE_LIMIT_ERROR" },
        { status: 429 }
      );

  response.headers.set("X-RateLimit-Remaining", String(remaining));
  response.headers.set("X-RateLimit-Reset", String(Math.ceil((resetAt - Date.now()) / 1000)));

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
