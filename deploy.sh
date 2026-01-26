#!/bin/bash
# Script de despliegue para ThunderSC en Fedora
# Ubicación esperada: /var/www/thundersc/

echo "🚀 Iniciando despliegue de ThunderSC..."

# 1. Actualizar código desde Git
echo "📥 Haciendo git pull..."
git pull

# 2. Construir el Frontend
echo "🏗️ Construyendo el cliente..."
cd client
npm install
npm run build

# 3. Configurar el Backend (API)
echo "⚙️ Configurando la API..."
cd ../api
npm install
npx prisma generate

# 4. Reiniciar el servicio con PM2
echo "🔄 Reiniciando el servicio con PM2..."
cd ..
pm2 startOrRestart ecosystem.config.js --env production

echo "✅ Despliegue completado con éxito."
chmod +x deploy.sh
