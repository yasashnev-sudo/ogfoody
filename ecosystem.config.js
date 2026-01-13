module.exports = {
  apps: [
    {
      name: 'ogfoody',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ogfoody',
      instances: 1,
      exec_mode: 'fork',
      
      // Environment
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Auto restart settings
      watch: false,
      max_memory_restart: '1G',
      
      // Restart settings
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Kill timeout
      kill_timeout: 5000,
      listen_timeout: 5000,
      
      // Advanced features
      time: true,
      
      // Cron restart (optional - restart every day at 4 AM)
      cron_restart: '0 4 * * *',
    }
  ],
  
  deploy: {
    production: {
      user: 'root',
      host: '5.129.194.168',
      ref: 'origin/main',
      repo: 'https://github.com/yasashnev-sudo/ogfoody.git',
      path: '/var/www/ogfoody',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': 'mkdir -p /var/www/ogfoody/logs',
    }
  }
}


