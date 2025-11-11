import { randomBytes } from 'crypto';

const TOKEN_EXPIRATION_HOURS = 24; // For verification and reset tokens

/**
 * Generate simple token (JWT not needed yet - can be added later)
 * For now, using random token for all auth flows
 */
export function generateToken(userId: string, expiresIn?: string): string {
  // Simple token: userId_randomhash_timestamp
  const randomPart = randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${userId}_${randomPart}_${timestamp}`;
}

/**
 * Verify token (simple validation - JWT can be added later)
 */
export function verifyToken(token: string): { userId: string } | null {
  try {
    // For now, just check if token is not empty
    // Later: Implement proper JWT verification
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    const parts = token.split('_');
    if (parts.length !== 3) {
      return null;
    }

    const userId = parts[0];
    if (!userId) {
      return null;
    }

    return { userId };
  } catch (error) {
    return null;
  }
}

/**
 * Generate random token for email verification and password reset
 */
export function generateRandomToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Calculate token expiration time
 */
export function getTokenExpirationTime(hours: number = TOKEN_EXPIRATION_HOURS): Date {
  const now = new Date();
  now.setHours(now.getHours() + hours);
  return now;
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expirationTime: Date | null): boolean {
  if (!expirationTime) return true;
  return new Date() > expirationTime;
}

/**
 * JWT Payload Interface
 */
export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
