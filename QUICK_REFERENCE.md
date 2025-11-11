# ⚡ Quick Reference Guide

Fast lookup for common tasks and patterns in Kinote development.

## 🚀 Getting Started (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Setup database
npx prisma migrate dev

# 4. Start development
npm run dev

# 5. Open browser
# http://localhost:3000
```

## 📋 Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Build for production
npm start                   # Start production server

# Code Quality
npm run lint                # Check code style
npm run format              # Format code
npm run type-check          # Check TypeScript

# Database
npm run prisma:migrate      # Create migration
npm run prisma:push         # Push schema
npm run prisma:studio       # Open database GUI

# Testing
npm test                    # Run tests
npm run test:watch          # Watch mode
```

## 🔐 Authentication Pattern

### Create Protected Endpoint

```typescript
// app/api/user/profile/route.ts
import { NextRequest } from 'next/server';
import { getUserIdFromRequest } from '@/lib/request-helpers';
import { unauthorizedResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return unauthorizedResponse();

  // Your logic here
}
```

### Call Protected Endpoint

```typescript
// From frontend
const response = await fetch('/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## ✅ Input Validation Pattern

```typescript
// 1. Define schema in validators.ts
export const mySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// 2. Use in endpoint
import { mySchema } from '@/lib/validators';

const parsed = mySchema.safeParse(req.body);
if (!parsed.success) {
  return validationErrorResponse(parsed.error);
}

const { name, email } = parsed.data;
```

## 📧 Email Pattern

```typescript
// 1. Create email function in lib/email.ts
export async function sendCustomEmail(
  email: string,
  data: any
): Promise<boolean> {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      to: email,
      subject: 'Your Subject',
      html: `<p>Your HTML</p>`,
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
}

// 2. Use in endpoint
const emailSent = await sendCustomEmail(email, data);
if (!emailSent) {
  console.warn('Email failed but continuing');
}
```

## 🗄️ Database Pattern

### Query Examples

```typescript
// Read
const user = await prisma.user.findUnique({
  where: { email }
});

// Create
const todo = await prisma.todo.create({
  data: {
    userId,
    title,
    priority: 'MEDIUM',
  }
});

// Update
await prisma.todo.update({
  where: { id },
  data: { status: 'COMPLETED' }
});

// Delete
await prisma.todo.delete({
  where: { id }
});

// List with filter
const todos = await prisma.todo.findMany({
  where: {
    userId,
    status: 'PENDING',
    priority: 'HIGH',
  },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
});

// Count
const total = await prisma.todo.count({
  where: { userId }
});
```

## 🔑 JWT Pattern

```typescript
// Generate token
import { generateToken } from '@/lib/auth';
const token = generateToken(userId);

// Verify token (automatic in middleware)
import { verifyToken } from '@/lib/auth';
const decoded = verifyToken(token);
```

## 🛡️ Error Response Pattern

```typescript
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
} from '@/lib/api-response';

// Success
return successResponse(data, 'Message', 201);

// Not found
return notFoundResponse('Item not found');

// Conflict (duplicate)
return conflictResponse('Email already exists');

// Unauthorized
return unauthorizedResponse('Invalid token');

// Generic error
return errorResponse('Error message', 400);
```

## 📝 API Documentation

### Add Endpoint to Swagger

```typescript
/**
 * POST /api/endpoint
 * 
 * Description
 * 
 * @swagger
 * /api/endpoint:
 *   post:
 *     tags:
 *       - Category
 *     summary: Short description
 *     description: Long description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field: { type: string }
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 */
export async function POST(req: Request) {
  // Implementation
}
```

## 🔍 Testing API

### With cURL

```bash
# GET request
curl http://localhost:3000/api/endpoint

# POST request
curl -X POST http://localhost:3000/api/endpoint \
  -H "Content-Type: application/json" \
  -d '{"field": "value"}'

# With authentication
curl http://localhost:3000/api/endpoint \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### With Postman

1. Import: `http://localhost:3000/api/docs/spec`
2. Set token in variables
3. Use in headers: `Authorization: Bearer {{token}}`

## 🗂️ File Structure Quick Tips

```
lib/                          # Utilities
├── auth.ts                   # JWT functions
├── email.ts                  # Email service
├── validators.ts             # Zod schemas
├── api-response.ts           # Response helpers
├── request-helpers.ts        # Request utilities
├── prisma.ts                 # Prisma client
└── swagger.ts                # Swagger config

app/api/                       # API routes
├── auth/
│   ├── register/route.ts      # POST /api/auth/register
│   ├── login/route.ts         # POST /api/auth/login
│   └── verify-email/route.ts  # POST /api/auth/verify-email
├── todo/
│   └── route.ts               # GET/POST /api/todo
└── docs/
    └── spec/route.ts          # GET /api/docs/spec

prisma/
└── schema.prisma              # Database schema
```

## 🚨 Debugging

### Enable Debug Logging

```typescript
// In endpoints
console.log('Debug info:', data);

// Check what middleware sees
const userId = getUserIdFromRequest(req);
console.log('User ID from header:', userId);
```

### Database Issues

```bash
# Check schema
npx prisma validate

# See migrations
npx prisma migrate status

# Open database GUI
npm run prisma:studio

# Reset (DELETE ALL DATA!)
npx prisma migrate reset
```

### Type Errors

```bash
# Regenerate types
npx prisma generate

# Type check
npm run type-check

# Full rebuild
rm -rf .next && npm run build
```

## 🔐 Security Checklist

- [ ] Never commit `.env.local`
- [ ] Never log passwords or tokens
- [ ] Always validate input with Zod
- [ ] Always sanitize output
- [ ] Check `NODE_ENV` before logging
- [ ] Use email verification before login
- [ ] Rate limit auth endpoints
- [ ] Verify JWT token expiration

## 📚 Common Issues

### "Cannot find module" Error
```bash
npx prisma generate
npm install
```

### Port 3000 Already in Use
```bash
PORT=3001 npm run dev
```

### Database Connection Failed
```bash
# Check MySQL is running
# Check DATABASE_URL format
# Test connection: mysql -u user -p -h host dbname
```

### Prisma Errors
```bash
npx prisma migrate reset  # Dangerous! Deletes data
npx prisma db push        # Push schema without migration
```

## 🔗 Documentation Links

- **README.md** - Project overview
- **docs/SETUP.md** - Development setup
- **docs/SECURITY.md** - Security guide
- **docs/DEPLOYMENT.md** - Deployment guide
- **docs/CODE_QUALITY.md** - Code standards
- **DEVELOPMENT_SUMMARY.md** - Full summary

## 📞 Getting Help

```bash
# Check logs
npm run dev   # Read console output

# Check types
npm run type-check

# Lint code
npm run lint

# Test endpoint
curl http://localhost:3000/api/docs/spec
```

## ⏱️ Time Estimates

- Setup project: 5 minutes
- Run tests: 1 minute
- Build production: 2-3 minutes
- Deploy to Vercel: 10-20 seconds
- Database migration: 30 seconds

## 🎯 Workflow

```
1. Create branch: git checkout -b feature/name
2. Make changes: Edit files
3. Validate: npm run lint && npm run type-check
4. Test: npm run dev && test endpoints
5. Format: npm run format
6. Commit: git commit -m "message"
7. Push: git push origin feature/name
8. Create PR: On GitHub
```

---

**Tip**: Bookmark this page for quick reference!

For more details, see full documentation in `/docs` folder.
