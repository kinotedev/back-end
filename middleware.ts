import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Middleware to verify token in Authorization header
 * Used for protected API routes
 */

// Routes that require authentication
const protectedRoutes = [
  '/api/user',
  '/api/todo',
  '/api/calendar',
  '/api/activity',
  '/api/streak',
  '/api/ai',
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user info to request headers for use in API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match protected API routes
    '/api/user/:path*',
    '/api/todo/:path*',
    '/api/calendar/:path*',
    '/api/activity/:path*',
    '/api/streak/:path*',
    '/api/ai/:path*',
  ],
};
