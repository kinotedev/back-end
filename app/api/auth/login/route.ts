import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';
import { loginSchema } from '@/lib/validators';
import { generateToken } from '@/lib/auth';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from '@/lib/api-response';

/**
 * POST /api/auth/login
 * 
 * Login user with email and password
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return notFoundResponse('Invalid email or password');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return unauthorizedResponse(
        'Email not verified. Please check your email for verification link.'
      );
    }

    // Verify password using crypto (simple SHA256)
    const hashedPassword = createHash('sha256')
      .update(password + process.env.PASSWORD_SALT || 'salt')
      .digest('hex');

    const isPasswordValid = hashedPassword === user.password;

    if (!isPasswordValid) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    return successResponse(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isEmailVerified: user.isEmailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
        },
      },
      'Login successful',
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    return internalErrorResponse(error);
  }
}
