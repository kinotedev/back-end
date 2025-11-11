import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { passwordResetSchema } from '@/lib/validators';
import { generateRandomToken, getTokenExpirationTime } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
  notFoundResponse,
} from '@/lib/api-response';

/**
 * POST /api/auth/forgot-password
 * 
 * Request password reset email
 * 
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request password reset
 *     description: Send password reset email to user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset email sent
 *       400:
 *         description: Validation error
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
    const parsed = passwordResetSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { email } = parsed.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists for security reasons
      return successResponse(
        { message: 'If user exists, password reset email has been sent' },
        'Check your email for password reset instructions'
      );
    }

    // Generate password reset token
    const passwordResetToken = generateRandomToken();
    const passwordResetExpires = getTokenExpirationTime(1); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Send password reset email
    const emailSent = await sendPasswordResetEmail(
      email,
      passwordResetToken,
      user.name || undefined
    );

    if (!emailSent) {
      console.warn('Failed to send password reset email to:', email);
      // Continue anyway as token is already stored
    }

    return successResponse(
      { message: 'Password reset email sent' },
      'Check your email for password reset instructions'
    );
  } catch (error) {
    console.error('Forgot password error:', error);
    return internalErrorResponse(error);
  }
}
