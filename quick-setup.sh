#!/bin/bash

# Quick Setup Script untuk Realtime Chat App
# Jalankan script ini untuk setup database dan migrasi

echo "🚀 Starting Realtime Chat App Setup..."

# Check jika MySQL berjalan
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL tidak ditemukan. Pastikan MySQL sudah terinstall."
    exit 1
fi

# Check jika Redis berjalan  
if ! command -v redis-cli &> /dev/null; then
    echo "❌ Redis tidak ditemukan. Pastikan Redis sudah terinstall."
    exit 1
fi

echo "✅ MySQL dan Redis ditemukan"

# Buat database jika belum ada
echo "📁 Creating database nextjs_realtime..."
mysql -u root -e "CREATE DATABASE IF NOT EXISTS nextjs_realtime;" || {
    echo "❌ Gagal membuat database. Periksa kredensial MySQL."
    exit 1
}

echo "✅ Database nextjs_realtime siap"

# Reset dan migrate database
echo "🔄 Resetting and migrating database..."
npx prisma migrate reset --force
npx prisma migrate dev --name init

# Generate Prisma client
echo "⚙️ Generating Prisma client..."
npx prisma generate

# Insert sample data
echo "📋 Inserting sample data..."
mysql -u root nextjs_realtime < sample_data.sql

# Verify data
echo "🔍 Verifying setup..."
USER_COUNT=$(mysql -u root -N -e "USE nextjs_realtime; SELECT COUNT(*) FROM users;")
ROOM_COUNT=$(mysql -u root -N -e "USE nextjs_realtime; SELECT COUNT(*) FROM rooms;")
MESSAGE_COUNT=$(mysql -u root -N -e "USE nextjs_realtime; SELECT COUNT(*) FROM messages;")

echo "✅ Setup completed successfully!"
echo "📊 Database Summary:"
echo "   - Users: $USER_COUNT"
echo "   - Rooms: $ROOM_COUNT" 
echo "   - Messages: $MESSAGE_COUNT"
echo ""
echo "🎉 Ready to start development!"
echo "   Run: npm run dev"
echo "   Open: http://localhost:3000"
