#!/bin/sh
set -e

echo "🚀 Iniciando despliegue de Laravel en Render..."

# Asegurar base de datos SQLite si está seleccionada y no existe
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    if [ ! -f /var/www/html/database/database.sqlite ]; then
        echo "📦 Creando archivo database.sqlite..."
        touch /var/www/html/database/database.sqlite
        chmod 777 /var/www/html/database/database.sqlite
    fi
fi

# Generar APP_KEY si no está definida
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generando APP_KEY..."
    php artisan key:generate --force
fi

# Correr migraciones y seeders
echo "🗄️ Ejecutando migraciones..."
php artisan migrate --force

# Cachar configuración y rutas para producción
echo "⚡ Optimizando caché de Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Determinar puerto (Render define $PORT)
PORT=${PORT:-10000}

echo "🌐 Servidor escuchando en el puerto $PORT..."
exec php artisan serve --host=0.0.0.0 --port=$PORT
