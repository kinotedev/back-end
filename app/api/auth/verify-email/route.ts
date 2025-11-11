import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { emailVerificationSchema } from '@/lib/validators';
import { isTokenExpired } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from '@/lib/api-response';

/**
 * POST /api/auth/verify-email
 * 
 * Verify user email with verification token
 * 
 * @swagger
 * /api/auth/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify email address
 *     description: Verify user email using verification token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123def456...
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = emailVerificationSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { token } = parsed.data;

    // Find user by verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return notFoundResponse('Invalid verification token');
    }

    // Check if token is expired
    if (isTokenExpired(user.emailVerificationExpires)) {
      return unauthorizedResponse('Verification token has expired');
    }

    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    // Send welcome email
    const emailSent = await sendWelcomeEmail(user.email, user.name || undefined);

    if (!emailSent) {
      console.warn('Failed to send welcome email to:', user.email);
    }

    return successResponse(
      { message: 'Email verified successfully' },
      'Your email has been verified. You can now login.'
    );
  } catch (error) {
    console.error('Email verification error:', error);
    return internalErrorResponse(error);
  }
}
