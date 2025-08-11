import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Use your actual secret from env if needed
const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret });
  const { pathname } = request.nextUrl;

  // ✅ Public paths that don't require auth
  const publicPaths = ["/", "/about"];
  const authPages = ["/sign-in", "/sign-up", "/verify"];

  // 1️⃣ If logged in & visiting sign-in/signup → go to dashboard
  if (token && authPages.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2️⃣ If NOT logged in & visiting dashboard → go to sign-in
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 3️⃣ Allow public pages without redirect
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 4️⃣ Default allow
  return NextResponse.next();
}

// ✅ Only run middleware on paths we care about
export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};
