// PM2 Configuration for SachiKheti Express Server on AWS EC2
// Run with: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: 'sachikheti-api',
      script: './server/src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '800M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
