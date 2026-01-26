module.exports = {
  apps: [
    {
      name: 'thunder-api',
      script: './api/server.js',
      cwd: '/var/www/thundersc',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        SOCKET_PORT: 4000,
        PORT: 4000 // Aseguramos que el backend use el puerto 4000 para el proxy de Nginx
      }
    }
  ]
};
