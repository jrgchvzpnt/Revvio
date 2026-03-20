import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Mock local auth
  const isAuth = request.cookies.has("local_auth");

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === "/login" && isAuth) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Security Headers
  const response = NextResponse.next();
  
  // HSTS (HTTP Strict Transport Security)
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // Prevent Clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
