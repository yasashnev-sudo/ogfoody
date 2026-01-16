// Загружаем переменные окружения из .env.production
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.production');
  const env = { NODE_ENV: 'production', PORT: 3000 };
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          // Убираем кавычки если есть
          env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      }
    });
  } else {
    console.warn('⚠️ .env.production not found, using default env vars');
  }
  
  return env;
}

module.exports = {
  apps: [
    {
      name: 'ogfoody',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/ogfoody',
      instances: 1,
      exec_mode: 'fork',
      
      // Environment - загружаем из .env.production
      env: loadEnvFile(),
      
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


