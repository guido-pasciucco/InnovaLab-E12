#!/bin/sh
set -e

echo "🚀 Iniciando despliegue de Laravel en Render..."

# Crear archivo SQLite si no existe
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "📦 Creando archivo database.sqlite..."
    touch /var/www/html/database/database.sqlite
    chmod 777 /var/www/html/database/database.sqlite
fi

# Correr migraciones y poblar la base de datos (Seeders)
echo "🗄️ Ejecutando migraciones y seeders..."
php artisan migrate --force
php artisan db:seed --force

# Optimizar caché
echo "⚡ Optimizando caché de Laravel..."
php artisan config:cache
php artisan route:cache

# Determinar el puerto asignado por Render (por defecto 8000)
PORT=${PORT:-8000}

echo "🌐 Servidor escuchando en el puerto $PORT..."
exec php artisan serve --host=0.0.0.0 --port=$PORT
