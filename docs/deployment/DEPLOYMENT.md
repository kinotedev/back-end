# 🚀 Deployment Guide

Complete guide for deploying Kinote to production.

## Quick Links

- **[Vercel Deployment](#vercel-recommended)** (Easiest)
- **[Railway Deployment](#railway)**
- **[Self-hosted](#self-hosted)**

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications with automatic deployments from GitHub.

### Prerequisites
- GitHub account with repository
- Vercel account (free tier available)
- MySQL database (PlanetScale recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/kinote.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Visit https://vercel.com/new
2. Select "Import Git Repository"
3. Connect your GitHub account
4. Select the kinote repository
5. Click "Import"

### Step 3: Configure Environment Variables

In Vercel dashboard:

1. Go to **Settings → Environment Variables**
2. Add all variables from `.env.example`:

```env
DATABASE_URL=mysql://user:pass@host/kinote
OPENAI_API_KEY=sk-your-api-key
JWT_SECRET=your-secret-key-min-32-chars
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 4: Deploy Database

Use PlanetScale (recommended for Vercel):

1. Visit https://planetscale.com
2. Create a new database
3. Get the connection string
4. Add to Vercel environment variables as `DATABASE_URL`

### Step 5: Run Migrations

After first deployment:

1. Connect to Vercel using CLI: `vercel env pull`
2. Run migrations: `npx prisma migrate deploy`
3. Or push schema: `npx prisma db push`

### Step 6: Verify Deployment

- Visit your Vercel domain
- Test API: `https://your-domain.vercel.app/api/auth/register`
- Check Swagger docs: `https://your-domain.vercel.app/api/docs/spec`

## Railway

Railway is a modern deployment platform with great MySQL support.

### Prerequisites
- Railway account
- GitHub repository

### Step 1: Connect Railway to GitHub

1. Visit https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize Railway and select kinote repository

### Step 2: Add MySQL Database

1. In Railway dashboard, click "Add Service"
2. Select "MySQL"
3. Railway will create a database automatically

### Step 3: Configure Environment Variables

In Railway project:

1. Go to Variables tab
2. Click "Add Variable"
3. Add from `.env.example`:

```env
DATABASE_URL=
OPENAI_API_KEY=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

Railway automatically creates `DATABASE_URL` for MySQL service.

### Step 4: Deploy

1. Railway auto-deploys on push to main branch
2. Watch deployment in Railway dashboard
3. Once complete, get the generated domain

### Step 5: Run Migrations

In Railway terminal:

```bash
npx prisma migrate deploy
```

Or using Railway CLI locally:

```bash
railway run npx prisma migrate deploy
```

## Self-Hosted

Deploy to your own server with Node.js and MySQL.

### Prerequisites
- VPS/Server (DigitalOcean, AWS, Linode, etc.)
- Node.js 20+
- MySQL 8.0+
- nginx (for reverse proxy)
- PM2 (for process management)

### Step 1: Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### Step 2: Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/yourusername/kinote.git
cd kinote
sudo chown -R $USER:$USER .
```

### Step 3: Install Dependencies

```bash
npm install --production
npm run build
```

### Step 4: Setup Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE kinote;
CREATE USER 'kinote'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON kinote.* TO 'kinote'@'localhost';
FLUSH PRIVILEGES;
```

### Step 5: Configure Environment

```bash
cp .env.example .env.production
nano .env.production
```

Update with your settings:

```env
NODE_ENV=production
DATABASE_URL=mysql://kinote:strong_password@localhost:3306/kinote
JWT_SECRET=your-super-secret-key-32-chars
# ... other variables
```

### Step 6: Run Migrations

```bash
NODE_ENV=production npx prisma migrate deploy
```

### Step 7: Setup PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'kinote',
      script: 'npm start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Step 8: Setup nginx

Create `/etc/nginx/sites-available/kinote`:

```nginx
upstream kinote {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://kinote;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/kinote /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Certbot automatically configures nginx for SSL.

## Docker Deployment

### Build Docker Image

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t kinote .
docker run -d -p 3000:3000 --env-file .env.production kinote
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://kinote:password@mysql:3306/kinote
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: kinote
      MYSQL_USER: kinote
      MYSQL_PASSWORD: password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Run:

```bash
docker-compose up -d
```

## Post-Deployment Checklist

- [ ] Database migrations ran successfully
- [ ] API responds at `/api/health` or `/api/auth/register`
- [ ] Swagger docs accessible at `/api/docs/spec`
- [ ] Email sending works (test with registration)
- [ ] JWT tokens generated and verified
- [ ] CORS configured for frontend domain
- [ ] SSL certificate installed
- [ ] Monitoring/logs setup (PM2, CloudWatch, etc.)
- [ ] Backup strategy for database
- [ ] Rate limiting configured
- [ ] Environment variables not hardcoded

## Monitoring & Maintenance

### Health Checks

Add health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date() });
}
```

Configure in deployment platform:

- **Vercel**: Health Checks → Add `/api/health`
- **Railway**: Healthcheck → `/api/health`
- **Self-hosted**: nginx upstream healthcheck

### Logs

- **Vercel**: View in Vercel dashboard
- **Railway**: View in Railway dashboard
- **PM2**: `pm2 logs kinote`
- **Docker**: `docker logs <container-id>`

### Database Backups

```bash
# Weekly MySQL backup
mysqldump -u kinote -p kinote > /backups/kinote-$(date +%Y%m%d).sql

# Automated with cron
0 2 * * 0 mysqldump -u kinote -p kinote > /backups/kinote-$(date +\%Y\%m\%d).sql
```

### Performance Optimization

1. Enable database query caching
2. Use Prisma query optimization
3. Implement API rate limiting
4. Cache static assets with CDN
5. Monitor API response times

## Troubleshooting

### "Cannot find module" errors
```bash
# Regenerate Prisma client
npx prisma generate

# Rebuild
npm run build
```

### Database connection fails
```bash
# Test connection
mysql -u kinote -p -h localhost kinote

# Check DATABASE_URL format
# Should be: mysql://user:pass@host:port/database
```

### Email not sending in production
- Verify SMTP credentials
- Check firewall allows SMTP port
- For Gmail: Use app-specific passwords
- Test with: `telnet smtp.gmail.com 587`

### Out of memory on deploy
- Increase server memory
- Use production builds only
- Enable node clustering in PM2

## Cost Optimization

### Reduce Database Size
```bash
# Archive old records
DELETE FROM Activity WHERE date < DATE_SUB(NOW(), INTERVAL 1 YEAR);

# Optimize tables
OPTIMIZE TABLE User, Todo, Activity;
```

### Reduce API Calls
- Implement client-side caching
- Use pagination for large datasets
- Batch API requests

### CDN for Static Assets
- Use Vercel's built-in CDN
- Or add Cloudflare for self-hosted

---

**Next Steps:**
1. Choose deployment platform
2. Follow setup instructions
3. Configure environment variables
4. Run database migrations
5. Test all endpoints
6. Setup monitoring
7. Configure custom domain & SSL

