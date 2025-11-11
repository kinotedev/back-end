import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';
import { registerSchema } from '@/lib/validators';
import { generateRandomToken, getTokenExpirationTime } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
  conflictResponse,
} from '@/lib/api-response';

/**
 * POST /api/auth/register
 * 
 * Register a new user with email and password
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email, password, fullName } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return conflictResponse('Email already registered');
    }

    // Hash password using crypto (simple SHA256)
    // Note: In production, use bcryptjs
    const hashedPassword = createHash('sha256')
      .update(password + process.env.PASSWORD_SALT || 'salt')
      .digest('hex');

    // Generate email verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = getTokenExpirationTime(24);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName || null,
        emailVerificationToken,
        emailVerificationExpires,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Send verification email (non-blocking)
    try {
      await sendVerificationEmail(
        email,
        emailVerificationToken,
        fullName
      );
    } catch (emailError) {
      console.warn('Email sending failed:', emailError);
      // Continue anyway - user can request resend
    }

    return successResponse(
      {
        user,
        message: 'Registration successful. Please check your email to verify your account.',
      },
      'User registered successfully',
      201
    );
  } catch (error) {
    console.error('Register error:', error);
    return internalErrorResponse(error);
  }
}
