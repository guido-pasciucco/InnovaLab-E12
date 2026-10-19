#!/bin/sh
set -e

echo "🚀 Iniciando despliegue de Laravel en Render..."

# Crear directorio y archivo SQLite asegurando permisos de carpeta completos
mkdir -p /var/www/html/database
if [ ! -f /var/www/html/database/database.sqlite ]; then
    echo "📦 Creando archivo database.sqlite..."
    touch /var/www/html/database/database.sqlite
fi

# Otorgar permisos de lectura y escritura a toda la carpeta database y storage
chmod -R 777 /var/www/html/database
chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

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
