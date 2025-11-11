import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validators';
import { isTokenExpired } from '@/lib/auth';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
  unauthorizedResponse,
  notFoundResponse,
} from '@/lib/api-response';

/**
 * POST /api/auth/reset-password
 * 
 * Reset password with token
 */
export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { token, password } = parsed.data;

    // Find user by reset token
    const user = await prisma.user.findUnique({
      where: { passwordResetToken: token },
    });

    if (!user) {
      return notFoundResponse('Invalid password reset token');
    }

    // Check if token is expired
    if (isTokenExpired(user.passwordResetExpires)) {
      return unauthorizedResponse('Password reset token has expired');
    }

    // Hash new password using crypto
    const hashedPassword = createHash('sha256')
      .update(password + process.env.PASSWORD_SALT || 'salt')
      .digest('hex');

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return successResponse(
      { message: 'Password reset successfully' },
      'Your password has been reset. You can now login with your new password.'
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return internalErrorResponse(error);
  }
}
