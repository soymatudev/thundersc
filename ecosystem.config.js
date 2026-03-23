module.exports = {
  apps: [
    {
      name: "thunder-api",
      script: "./api/server.js",
      instances: 1, // Utiliza todos los núcleos disponibles para la API HTTP
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: 4000
      }
    },
    {
      name: "thunder-sensors",
      script: "./api/sensor-server.js",
      instances: 1, // Obligatorio: Solo 1 instancia para el servidor TCP de sensores
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        SENSOR_BRIDGE_PORT: 1085
      }
    }
  ]
};
