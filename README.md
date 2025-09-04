# Realtime Chat App

Aplikasi chat realtime sederhana yang dibangun menggunakan Next.js 15, Socket.IO, Redis, Prisma, dan MySQL.

## Fitur

- ✅ Realtime messaging dengan Socket.IO
- ✅ Persistensi data dengan MySQL via Prisma
- ✅ Caching dengan Redis
- ✅ Multiple chat rooms
- ✅ Typing indicators
- ✅ User authentication sederhana
- ✅ Responsive design dengan Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 15, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Socket.IO
- **Database:** MySQL dengan Prisma ORM
- **Cache:** Redis
- **Realtime:** Socket.IO

## Prerequisites

Pastikan Anda sudah menginstall:
- Node.js (v18 atau lebih baru)
- MySQL
- Redis
- npm atau yarn

## Installation

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Ubah file `.env` sesuai dengan konfigurasi database dan Redis Anda:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   REDIS_URL="redis://localhost:6379"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Setup database:
   ```bash
   # Buat database MySQL terlebih dahulu
   mysql -u root -p -e "CREATE DATABASE realtimeapp;"
   
   # Jalankan migrasi Prisma
   npx prisma migrate dev --name init
   ```

5. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

## Running the Application

1. Pastikan MySQL dan Redis sudah berjalan
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser

## Database Schema

Aplikasi ini menggunakan 4 model utama:

- **User**: Menyimpan informasi pengguna
- **Room**: Menyimpan informasi chat room
- **Message**: Menyimpan pesan chat
- **RoomMember**: Menyimpan relasi antara user dan room

## API Endpoints

- `GET /api/rooms` - Mendapatkan daftar room
- `POST /api/rooms` - Membuat room baru
- `GET /api/rooms/[roomId]` - Mendapatkan pesan dalam room
- `POST /api/rooms/[roomId]` - Join room
- `GET /api/users` - Mendapatkan daftar user
- `POST /api/users` - Membuat user baru

## Socket.IO Events

### Client to Server:
- `join-room` - Join chat room
- `send-message` - Kirim pesan
- `typing` - Indikator sedang mengetik

### Server to Client:
- `new-message` - Pesan baru diterima
- `user-joined` - User join room
- `user-left` - User keluar room
- `user-typing` - User sedang mengetik

## Development

Untuk development, Anda bisa menggunakan Prisma Studio untuk melihat data:
```bash
npx prisma studio
```

## Production

Untuk deployment production:

1. Build aplikasi:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## Troubleshooting

1. **Database connection error**: Pastikan MySQL berjalan dan URL database benar
2. **Redis connection error**: Pastikan Redis berjalan di port 6379
3. **Socket.IO tidak terhubung**: Periksa apakah server Socket.IO sudah diinisialisasi dengan benar

## License

MIT License
