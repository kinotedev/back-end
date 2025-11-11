import { NextRequest } from 'next/server';

/**
 * Extract user ID from request headers (set by middleware)
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  const userId = req.headers.get('x-user-id');
  return userId;
}

/**
 * Validate that user ID exists
 */
export function validateUserContext(req: NextRequest): { valid: boolean; userId?: string } {
  const userId = getUserIdFromRequest(req);
  
  if (!userId) {
    return { valid: false };
  }

  return { valid: true, userId };
}

/**
 * Format request for logging
 */
export function logRequest(method: string, route: string, userId?: string): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${route}${userId ? ` (User: ${userId})` : ''}`);
}

/**
 * Sanitize user data for response
 */
export function sanitizeUser(user: any) {
  const { password, emailVerificationToken, passwordResetToken, twoFactorSecret, ...safe } = user;
  return safe;
}
