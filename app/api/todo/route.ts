import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/request-helpers';
import {
  successResponse,
  internalErrorResponse,
  unauthorizedResponse,
} from '@/lib/api-response';

/**
 * GET /api/todo
 * 
 * Get all todos for authenticated user
 * 
 * @swagger
 * /api/todo:
 *   get:
 *     tags:
 *       - Todo
 *     summary: Get all todos
 *     description: Retrieve all todos for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of todos
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    // Get user ID from middleware
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return unauthorizedResponse('User not authenticated');
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '10');

    // Build where clause
    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }
    
    if (priority) {
      where.priority = priority;
    }

    // Get todos
    const todos = await prisma.todo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    // Get total count
    const total = await prisma.todo.count({ where });

    return successResponse(
      {
        todos,
        pagination: {
          skip,
          take,
          total,
          hasMore: skip + take < total,
        },
      },
      'Todos retrieved successfully'
    );
  } catch (error) {
    console.error('Get todos error:', error);
    return internalErrorResponse(error);
  }
}
