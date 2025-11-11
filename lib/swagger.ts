import { createSwaggerSpec } from 'next-swagger-doc';

export const swaggerConfig = {
  openapi: '3.0.0',
  info: {
    title: 'Kinote API Documentation',
    version: '1.0.0',
    description: 'Production-ready REST API for Kinote - Fullstack Next.js App with AI Career Path Coach',
    contact: {
      name: 'Kinote Support',
      email: 'support@kinote.app',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:3000',
      description: 'API Server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication endpoints',
    },
    {
      name: 'User',
      description: 'User profile management',
    },
    {
      name: 'Todo',
      description: 'Todo list management',
    },
    {
      name: 'Calendar',
      description: 'Calendar and scheduling',
    },
    {
      name: 'Activity',
      description: 'User activity tracking',
    },
    {
      name: 'Streak',
      description: 'Activity streak management',
    },
    {
      name: 'AI',
      description: 'AI-powered features',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Authorization header using the Bearer scheme',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'User ID' },
          email: { type: 'string', format: 'email', description: 'User email' },
          name: { type: 'string', nullable: true, description: 'User full name' },
          isEmailVerified: { type: 'boolean', description: 'Email verification status' },
          twoFactorEnabled: { type: 'boolean', description: '2FA enabled status' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Todo: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          completedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Activity: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string', nullable: true },
          category: { type: 'string' },
          duration: { type: 'integer', description: 'Duration in minutes' },
          date: { type: 'string', format: 'date-time' },
          evidence: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          error: { type: 'string' },
          details: { type: 'object', nullable: true },
        },
      },
      Success: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
          data: { type: 'object', nullable: true },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export function getApiDocs() {
  return createSwaggerSpec({
    ...swaggerConfig,
  });
}
