#!/bin/bash
# ==============================================================================
# SachiKheti Automated Deployment Script for Single AWS EC2 Instance
# ==============================================================================

set -e

echo "🚀 Starting SachiKheti deployment on AWS EC2..."

PROJECT_DIR="/var/www/sachikheti"
cd $PROJECT_DIR

# 1. Update source code (if using git)
# git pull origin main

# 2. Install server dependencies & prepare Prisma
echo "📦 Installing server dependencies..."
cd $PROJECT_DIR/server
npm install --production=false

# 3. Apply AWS RDS PostgreSQL schema
echo "🗄️ Syncing Prisma schema with AWS RDS..."
# If connecting to RDS, use schema.postgresql.prisma:
if [ -f "prisma/schema.postgresql.prisma" ]; then
  cp prisma/schema.postgresql.prisma prisma/schema.prisma
fi
npx prisma generate
npx prisma db push
node prisma/seed.js

# 4. Install client dependencies & build frontend bundle
echo "🎨 Building frontend production bundle..."
cd $PROJECT_DIR/client
npm install
npm run build

# 5. Restart PM2 background process
echo "🔄 Reloading Node.js backend with PM2..."
cd $PROJECT_DIR
mkdir -p logs
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

# 6. Test and reload Nginx
echo "🌐 Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "✅ SachiKheti is successfully deployed and running!"
