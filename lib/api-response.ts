import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * API Response types
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: Record<string, unknown>;
}

/**
 * Success response
 */
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Error response
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message: error,
      error,
      ...(details && { details }),
    },
    { status }
  );
}

/**
 * Validation error response from Zod
 */
export function validationErrorResponse(
  zodError: ZodError
): NextResponse<ApiResponse> {
  const errors = zodError.flatten();
  const fieldErrors: Record<string, unknown> = {};

  for (const [field, messages] of Object.entries(errors.fieldErrors)) {
    fieldErrors[field] = messages;
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Validation error',
      error: 'Invalid request data',
      details: fieldErrors,
    },
    { status: 400 }
  );
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(
  message: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return errorResponse(message, 401);
}

/**
 * Forbidden response
 */
export function forbiddenResponse(
  message: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return errorResponse(message, 403);
}

/**
 * Not found response
 */
export function notFoundResponse(
  message: string = 'Resource not found'
): NextResponse<ApiResponse> {
  return errorResponse(message, 404);
}

/**
 * Conflict response
 */
export function conflictResponse(
  message: string = 'Resource already exists'
): NextResponse<ApiResponse> {
  return errorResponse(message, 409);
}

/**
 * Internal server error response
 */
export function internalErrorResponse(
  error?: unknown
): NextResponse<ApiResponse> {
  console.error('Internal server error:', error);
  return errorResponse('Internal server error', 500);
}

/**
 * Bad request response
 */
export function badRequestResponse(
  message: string = 'Bad request'
): NextResponse<ApiResponse> {
  return errorResponse(message, 400);
}
