import type { NextRequest, NextResponse } from "next/server";
import { auth0 } from "./lib/auth0";
import { withSecurityHeaders } from "./middleware-security";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = await auth0.middleware(request);
  
  // Appliquer les headers de sécurité
  return withSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

