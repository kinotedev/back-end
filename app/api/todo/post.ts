import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createTodoSchema } from '@/lib/validators';
import { getUserIdFromRequest } from '@/lib/request-helpers';
import {
  successResponse,
  validationErrorResponse,
  internalErrorResponse,
  unauthorizedResponse,
} from '@/lib/api-response';

/**
 * POST /api/todo
 * 
 * Create a new todo
 * 
 * @swagger
 * /api/todo:
 *   post:
 *     tags:
 *       - Todo
 *     summary: Create a new todo
 *     description: Create a new todo item for authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Complete project
 *               description:
 *                 type: string
 *                 example: Finish the Kinote project
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *                 default: MEDIUM
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  try {
    // Get user ID from middleware
    const userId = getUserIdFromRequest(req);

    if (!userId) {
      return unauthorizedResponse('User not authenticated');
    }

    // Parse request body
    const body = await req.json();

    // Validate input
    const parsed = createTodoSchema.safeParse(body);

    if (!parsed.success) {
      return validationErrorResponse(parsed.error);
    }

    const { title, description, priority, dueDate } = parsed.data;

    // Create todo
    const todo = await prisma.todo.create({
      data: {
        userId,
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    return successResponse(
      { todo },
      'Todo created successfully',
      201
    );
  } catch (error) {
    console.error('Create todo error:', error);
    return internalErrorResponse(error);
  }
}
