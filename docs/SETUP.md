# 💻 Development Setup Guide

Complete guide to setup Kinote for local development.

## Prerequisites

### Required
- **Node.js 20+** - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MySQL 8.0+** - [Download](https://www.mysql.com/downloads/)

### Optional
- **Visual Studio Code** - Recommended editor
- **Postman/Insomnia** - API testing
- **Prisma Studio** - Database GUI
- **Docker** - For containerized MySQL

## Quick Start (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/kinote.git
cd kinote
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="mysql://root:root@localhost:3306/kinote"
JWT_SECRET="dev-secret-key-min-32-characters-long"
OPENAI_API_KEY="sk-your-test-key"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE kinote;"

# Run migrations
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

## Detailed Setup

### Step 1: Install Node.js

#### macOS
```bash
# Using Homebrew
brew install node@20

# Verify
node --version  # v20.x.x
npm --version   # 10.x.x
```

#### Windows
1. Download from https://nodejs.org/
2. Run installer
3. Restart terminal
4. Verify: `node --version`

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install MySQL

#### macOS
```bash
# Using Homebrew
brew install mysql@8.0
brew services start mysql@8.0

# Verify
mysql --version
```

#### Windows
1. Download MySQL Community Server
2. Run MSI installer
3. Choose default configuration
4. Run MySQL 8.0 Command Line Client

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mysql-server-8.0
sudo mysql_secure_installation
sudo systemctl start mysql
```

#### Verify Installation

```bash
mysql -u root -p
```

Enter password, should see `mysql>` prompt.

### Step 3: Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE kinote CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user (optional)
CREATE USER 'kinote'@'localhost' IDENTIFIED BY 'kinote_password';
GRANT ALL PRIVILEGES ON kinote.* TO 'kinote'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

### Step 4: Clone Repository

```bash
# Clone
git clone https://github.com/yourusername/kinote.git
cd kinote

# Or if you have SSH setup
git clone git@github.com:yourusername/kinote.git
cd kinote
```

### Step 5: Install Dependencies

```bash
npm install

# Or with specific Node version
nvm use 20
npm install
```

### Step 6: Configure Environment

```bash
# Copy example
cp .env.example .env.local

# Edit with your editor
nano .env.local  # Linux/Mac
# or
code .env.local  # VS Code
```

**Required Variables:**

```env
# Database
DATABASE_URL="mysql://root:root@localhost:3306/kinote"

# or if using kinote user
DATABASE_URL="mysql://kinote:kinote_password@localhost:3306/kinote"

# JWT
JWT_SECRET="your-dev-secret-key-min-32-characters-very-secure"
JWT_EXPIRATION="7d"

# Application
NODE_ENV="development"
API_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"

# Email (Gmail recommended for testing)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"

# OpenAI
OPENAI_API_KEY="sk-your-test-api-key"
OPENAI_MODEL="gpt-4-mini"
```

### Step 7: Setup Database Schema

```bash
# Run migrations
npx prisma migrate dev

# This will:
# 1. Create all tables
# 2. Generate Prisma client
# 3. Seed database (if seed.ts exists)

# Or just push schema
npx prisma db push
```

### Step 8: Start Development Server

```bash
npm run dev

# Output:
# ▲ Next.js 16.0.1
# - Local:        http://localhost:3000
# - Environments: .env.local

# ✓ Ready in 1.23s
```

### Step 9: Verify Everything Works

1. **Frontend**: http://localhost:3000
2. **API Test**: `curl http://localhost:3000/api/auth/register -X POST`
3. **Swagger Docs**: http://localhost:3000/api/docs/spec

## Development Tools & Tips

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "prisma.prisma",
    "dbml.dbml",
    "zainco.dbml-erd",
    "eamodio.gitlens",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss"
  ]
}
```

Install: Extensions → Workspace Recommended

### Useful Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build               # Build for production
npm run start               # Start production server

# Linting & Formatting
npm run lint                # Run ESLint
npm run format              # Format with Prettier
npm run type-check          # TypeScript type checking

# Database
npm run prisma:migrate      # Create and run migration
npm run prisma:push         # Push schema without migration
npm run prisma:studio       # Open Prisma Studio (GUI)
npm run prisma:generate     # Generate Prisma client

# Testing
npm test                    # Run tests (when added)
npm run test:watch          # Watch mode testing
```

### Prisma Studio (Database GUI)

```bash
npm run prisma:studio

# Opens http://localhost:5555
# View/edit database records visually
```

### API Testing with cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "fullName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Verify Email (get token from email)
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_FROM_EMAIL"
  }'
```

### Testing with Postman

1. Import collection from Swagger: http://localhost:3000/api/docs/spec
2. Set environment variables:
   - `base_url`: http://localhost:3000
   - `token`: (paste JWT token)
3. Run requests

### Debugging

#### Debug in VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

Press F5 to start debugging.

#### Console Logging

```typescript
// Development logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}

// Always log errors
console.error('Error:', error);
```

## Common Issues & Solutions

### "Cannot find module" Error

```bash
# Regenerate Prisma client
npx prisma generate

# Or full reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Failed

```bash
# Test MySQL connection
mysql -u root -p -h 127.0.0.1

# Check DATABASE_URL format
# Should be: mysql://user:pass@host:port/database

# Start MySQL (if not running)
# macOS: brew services start mysql@8.0
# Windows: Start MySQL 8.0 service
# Linux: sudo systemctl start mysql
```

### Port 3000 Already in Use

```bash
# Use different port
PORT=3001 npm run dev

# Or kill existing process
# macOS/Linux:
lsof -i :3000
kill -9 <PID>

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Email Not Sending in Development

1. **Gmail**: Use app-specific password
   - Visit: https://myaccount.google.com/apppasswords
   - Generate password for "Mail" and "Windows Computer"
   - Use as `SMTP_PASS`

2. **Test without sending**:
   - Set `SMTP_USER` to empty string
   - Logs will show email content

3. **Use Mailtrap** (free testing):
   - https://mailtrap.io
   - Copy SMTP credentials to `.env.local`

### Prisma Migration Issues

```bash
# Reset database (deletes all data!)
npx prisma migrate reset

# If stuck in migration
npx prisma migrate resolve --rolled-back

# View migration status
npx prisma migrate status
```

### TypeScript Errors

```bash
# Type checking
npm run type-check

# Fix TypeScript errors
# Most editors auto-fix with Ctrl+. or Cmd+.

# Force regenerate types
npx prisma generate
npx tsc --noEmit
```

## Production Build

Before deploying, test production build locally:

```bash
# Build
npm run build

# Start production server
npm start

# Should be ready at http://localhost:3000
```

## Documentation

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Zod**: https://zod.dev
- **TailwindCSS**: https://tailwindcss.com/docs

## Getting Help

1. **Check existing issues**: GitHub Issues
2. **Stack Overflow**: Tag with `next.js` `prisma` `mysql`
3. **Community Discord**: Next.js Community
4. **Documentation**: See links above

---

**You're all set! Happy coding! 🚀**

**Next Step**: Read [API_REFERENCE.md](./api/API_REFERENCE.md) to understand endpoints
