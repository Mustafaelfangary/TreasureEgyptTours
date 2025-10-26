module.exports = {
  apps: [
    {
      name: 'Dahabiyat-Nile-Cruise',
      script: 'npm',
      args: 'start',
      cwd: '/var/Dahabiyat-Nile-Cruise',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Logging
      log_file: '/var/log/pm2/dahabiyat-nile-cruise.log',
      out_file: '/var/log/pm2/dahabiyat-nile-cruise-out.log',
      error_file: '/var/log/pm2/dahabiyat-nile-cruise-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Process management
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 5,
      min_uptime: '10s',
      
      // Monitoring
      watch: false,
      ignore_watch: ['node_modules', '.next', 'logs'],
      
      // Auto restart on file changes (disable in production)
      watch: false,
      
      // Source map support
      source_map_support: true,
      
      // Kill timeout
      kill_timeout: 5000
    }
  ]
};
