#!/bin/sh
set -e

echo "🚀 Iniciando despliegue de Laravel en Render..."

# Si se usa SQLite por fallback, asegurar archivo
if [ "$DB_CONNECTION" = "sqlite" ]; then
    mkdir -p /var/www/html/database
    touch /var/www/html/database/database.sqlite
    chmod -R 777 /var/www/html/database
fi

# Correr migraciones y seeders automáticamente en PostgreSQL
echo "🗄️ Ejecutando migraciones y seeders..."
php artisan migrate --force
php artisan db:seed --force

# Optimizar caché
echo "⚡ Optimizando caché de Laravel..."
php artisan config:cache
php artisan route:cache

PORT=${PORT:-8000}
echo "🌐 Servidor escuchando en el puerto $PORT..."
exec php artisan serve --host=0.0.0.0 --port=$PORT
