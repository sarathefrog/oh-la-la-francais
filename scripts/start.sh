#!/bin/sh

# Exit on any error
set -e

echo "🚀 Starting Oh La La Français application..."

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
while [ ! -f /app/prisma/dev.db ]; do
  echo "Database not ready, waiting..."
  sleep 2
done

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Pushing database schema..."
npx prisma db push

# Start the application
echo "🎯 Starting application..."
if [ "$SERVICE_TYPE" = "bot" ]; then
  echo "🤖 Starting Telegram Bot..."
  node src/telegramBot-clean.js
else
  echo "🌐 Starting Web Application..."
  node src/dashboard-api.js
fi

