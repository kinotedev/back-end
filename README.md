# 🚀 Kinote - Fullstack Next.js App with AI Career Path Coach

A production-ready fullstack application built with **Next.js 16 + TypeScript + MySQL + Prisma + OpenAI GPT-4 Mini** featuring task management, activity tracking, calendar integration, and AI-powered career path recommendations.

## ⚙️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19** + TypeScript
- **TailwindCSS** (styling)
- **Framer Motion** (animations)
- **Shadcn/ui** (UI components)

### Backend
- **Next.js API Routes**
- **Node.js 20+**
- **Express-like middleware system**

### Database & ORM
- **MySQL 8.0+**
- **Prisma ORM** (type-safe queries)

### Authentication & Security
- **JWT (JSON Web Tokens)** - 7-day expiration
- **bcryptjs** - password hashing (10 rounds)
- **Email verification** - 24-hour expiration
- **Password reset** - 1-hour expiration tokens
- **2FA support** - TOTP ready

### AI & APIs
- **OpenAI GPT-4 Mini**
- **Nodemailer** - email service
- **next-swagger-doc** - API documentation

### Utilities
- **Zod** - runtime type validation
- **date-fns** - date manipulation
- **jsonwebtoken** - JWT handling
- **dotenv** - environment configuration

## 📋 Features

### ✅ Authentication
- User registration with email verification
- Login with JWT tokens
- Password reset functionality
- Email verification emails
- HTTP-only secure cookies

### ✅ Task Management (Todo)
- Create, read, update, delete todos
- Priority levels (LOW, MEDIUM, HIGH, URGENT)
- Status tracking (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
- Due dates with calendar integration
- Filter by priority and status

### ✅ Activity Tracking
- Log daily activities with duration
- Categorize activities
- Upload activity evidence/proof
- Track activity history

### ✅ Streak Management
- Automatic streak calculation
- Current and longest streaks
- Daily activity tracking
- Streak notifications

### ✅ AI Features
- Career path recommendations (GPT-4 Mini)
- Activity analysis and insights
- Life balance suggestions
- Productivity recommendations

### ✅ API Documentation
- Interactive Swagger/OpenAPI UI
- Complete endpoint reference
- Request/response examples
- Authentication examples

## 🏁 Quick Start

### Prerequisites
- **Node.js 20+**
- **npm/yarn/pnpm**
- **MySQL 8.0+** (local or cloud)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kinote
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/kinote"
   OPENAI_API_KEY="sk-your-api-key"
   JWT_SECRET="your-super-secret-key-min-32-chars"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   ```

4. **Setup database:**
   ```bash
   npx prisma migrate dev
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

6. **Open browser:**
   - App: http://localhost:3000
   - API Docs: http://localhost:3000/api/docs/spec

## 📁 Project Structure

```
kinote/
├── app/
│   ├── (site)/                    # Frontend pages
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Landing page
│   │   ├── login/
│   │   ├── register/
│   │   ├── todo/
│   │   ├── calendar/
│   │   ├── streak/
│   │   └── ai/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   ├── verify-email/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   └── reset-password/route.ts
│   │   ├── user/
│   │   ├── todo/
│   │   ├── calendar/
│   │   ├── activity/
│   │   ├── streak/
│   │   ├── ai/
│   │   └── docs/                 # API documentation
│   │       └── spec/route.ts
│   └── globals.css
├── lib/
│   ├── prisma.ts                # Prisma client
│   ├── auth.ts                  # JWT utilities
│   ├── email.ts                 # Email service
│   ├── validators.ts            # Zod schemas
│   ├── api-response.ts          # Response helpers
│   ├── request-helpers.ts       # Request utilities
│   └── swagger.ts               # Swagger config
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Migration files
├── middleware.ts                # Authentication middleware
├── .env.example                 # Environment template
└── package.json
```

## 🔐 Security Best Practices Implemented

✅ **Password Security**
- Hashed with bcryptjs (10 rounds)
- Minimum 8 characters
- Must contain uppercase, lowercase, and numbers
- Never logged or exposed in API responses

✅ **Token Security**
- JWT tokens with 7-day expiration
- Verification tokens expire after 24 hours
- Reset tokens expire after 1 hour
- Tokens never stored in response body for sensitive operations

✅ **Email Verification**
- Required before login
- 24-hour token expiration
- Rate limiting (implement in production)
- Token invalidated after use

✅ **Password Reset**
- 1-hour token expiration
- One-time use tokens
- Email verification required
- New password validation

✅ **API Security**
- Authentication middleware for protected routes
- Input validation with Zod schemas
- Error messages don't leak sensitive info
- CORS configuration ready

✅ **Database Security**
- Prisma ORM (SQL injection prevention)
- No SQL queries in frontend
- Indexes on frequently queried fields

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `PUT /api/user/password` - Change password

### Todo
- `GET /api/todo` - List todos
- `POST /api/todo` - Create todo
- `PUT /api/todo/[id]` - Update todo
- `DELETE /api/todo/[id]` - Delete todo

### Activity
- `GET /api/activity` - List activities
- `POST /api/activity` - Log activity
- `DELETE /api/activity/[id]` - Delete activity

### Streak
- `GET /api/streak` - Get streak info
- `POST /api/streak/check-in` - Daily check-in

### AI
- `POST /api/ai/analyze-activity` - Analyze activities
- `POST /api/ai/career-path` - Get career recommendations
- `POST /api/ai/life-balance` - Get life balance analysis

## 🚀 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Database migrations
npm run prisma:migrate     # Create and run migration
npm run prisma:push       # Push schema to DB
npm run prisma:studio     # Open Prisma Studio
npm run prisma:generate   # Generate Prisma client
```

### Database Management

```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# View migrations
npx prisma migrate status

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Generate Prisma types
npx prisma generate

# Open database explorer
npx prisma studio
```

## 🔧 Configuration

### Environment Variables

Key variables in `.env.local`:

```env
# Database
DATABASE_URL=mysql://user:pass@host:port/db

# Application
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRATION=7d

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-specific-password

# AI
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4-mini
```

## 💻 Development Setup

1. Install Node.js 20+
2. Clone and install dependencies
3. Create `.env.local` with your settings
4. Run `npx prisma migrate dev` to setup database
5. Run `npm run dev` to start development server

## 🚀 Production Deployment

### Vercel (Recommended)
Easiest option with automatic deployments from GitHub.

### Railway
Great alternative with MySQL support.

### Self-hosted
Deploy to any server with Node.js and MySQL support.

## 📝 Contributing

Contributions welcome! Please fork, create a feature branch, and submit a pull request.

## 📄 License

UNLICENSED - Personal Project

## 🆘 Support

For issues and support, please use GitHub Issues.

---

**Kinote** - Build Better Habits, Achieve Better Careers 🚀

*Last Updated: November 11, 2025*
