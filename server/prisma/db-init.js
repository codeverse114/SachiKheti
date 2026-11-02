import { execSync } from 'child_process';
import './prepare.js';

console.log('🚀 Starting database initialization & synchronization...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  if (process.env.DATABASE_URL) {
    console.log('📦 Pushing Prisma schema to target database...');
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    console.log('🌱 Checking / running initial seeds...');
    execSync('node prisma/seed.js', { stdio: 'inherit' });
  }
  console.log('✅ Database ready.');
} catch (error) {
  console.error('⚠️ Database setup note:', error.message);
}

