#!/bin/bash

echo "🚀 Setting up Realtime Chat App..."

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Check if Redis is running
if ! command -v redis-cli &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis first."
    exit 1
fi

# Test MySQL connection
echo "🔍 Testing MySQL connection..."
mysql -u root -p -e "SELECT 1;" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to MySQL. Please check your MySQL installation and credentials."
    exit 1
fi

# Test Redis connection
echo "🔍 Testing Redis connection..."
redis-cli ping > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Cannot connect to Redis. Please start Redis server first."
    exit 1
fi

# Create database
echo "📊 Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS realtimeapp;"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "📊 Running database migrations..."
npx prisma migrate dev --name init

echo "✅ Setup completed successfully!"
echo ""
echo "🎉 You can now run the application with:"
echo "   npm run dev"
echo ""
echo "📋 Make sure to update your .env file with the correct database credentials."
