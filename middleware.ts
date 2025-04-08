import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode'; // Use jwt-decode to check expiration

// Define the structure of the JWT payload again for middleware
interface CustomJwtPayload {
  exp?: number;
  // Add other claims if needed for checks in middleware
}

export function middleware(request: NextRequest) {
  // Try getting token from cookies using the CORRECT name
  let token = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  let isTokenValid = false;
  if (token) {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp > currentTime) {
        isTokenValid = true;
      }
    } catch (error) {
      console.error("Middleware token decode error:", error);
      // Invalid token, treat as logged out
    }
  }

  // Define protected routes (adjust as needed)
  const protectedRoutes = [
    '/cart', 
    '/my-reviews', 
    '/discount-coupons', 
    '/my-followed-stores', 
    '/user-info', 
    '/address', // Covers /address, /address/new, etc.
    '/favorites',
    '/my-orders' // Added My Orders as protected
  ];

  // Define auth routes
  const authRoutes = ['/signin', '/sign-up', '/forgot-password'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.includes(pathname);

  // Redirect logged-in users away from auth pages
  if (isTokenValid && isAuthRoute) {
    console.log("Middleware: Redirecting logged-in user from auth page to /");
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect logged-out users away from protected pages
  if (!isTokenValid && isProtectedRoute) {
    console.log(`Middleware: Redirecting logged-out user from ${pathname} to /signin`);
    // Store the intended destination to redirect after login
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    // Match all protected routes
    '/cart/:path*',
    '/my-reviews/:path*',
    '/discount-coupons/:path*',
    '/my-followed-stores/:path*',
    '/user-info/:path*',
    '/address/:path*',
    '/favorites/:path*',
    '/my-orders/:path*', // Added matcher for My Orders
    // Add other protected route matchers

    // Match auth routes to prevent access when logged in
    '/signin',
    '/sign-up',
    '/forgot-password',
  ],
}; 