# Demo Aplikasi Realtime Chat

## Langkah-langkah untuk menjalankan demo:

### 1. Persiapan Database
Pastikan MySQL sudah berjalan, kemudian buat database:
```sql
CREATE DATABASE nextjs_realtime;
```

### 2. Persiapan Redis  
Pastikan Redis sudah berjalan di port 6379:
```bash
redis-server
```

### 3. Setup Environment
File `.env` sudah dikonfigurasi untuk database `nextjs_realtime`:
```env
DATABASE_URL="mysql://root:@localhost:3306/nextjs_realtime"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Migrasi Database ✅ SELESAI
Database sudah berhasil dimigrate dengan tabel-tabel:
- `users` - Menyimpan data pengguna
- `rooms` - Menyimpan data chat room  
- `messages` - Menyimpan pesan chat
- `room_members` - Menyimpan relasi user-room
- `_prisma_migrations` - Track migrasi Prisma

### 5. Data Sample ✅ TERSEDIA
Database sudah dilengkapi dengan data sample:
- 3 Users: john_doe, jane_smith, bob_wilson
- 3 Rooms: General Chat, Tech Discussion, Random
- 5 Sample messages untuk testing

### 6. Jalankan Aplikasi ✅ RUNNING
```bash
npm run dev
```
Server berjalan di: http://localhost:3000

### 7. Test Aplikasi

1. Buka http://localhost:3000 di browser
2. Masukkan username dan email untuk login
3. Buat room baru atau join room yang ada
4. Mulai chatting!

### 8. Test Realtime Features

Untuk menguji fitur realtime:
1. Buka aplikasi di dua tab browser berbeda
2. Login dengan user yang berbeda di setiap tab
3. Join room yang sama
4. Kirim pesan dari satu tab dan lihat pesan muncul di tab lainnya secara realtime
5. Test typing indicator dengan mengetik di satu tab

### Status Setup: ✅ SUKSES

- ✅ **Database**: nextjs_realtime sudah dibuat dan dimigrate
- ✅ **Tabel**: Semua tabel (users, rooms, messages, room_members) sudah dibuat
- ✅ **Sample Data**: Data testing sudah diinsert
- ✅ **Prisma Client**: Sudah di-generate
- ✅ **Build**: Aplikasi berhasil di-build tanpa error
- ✅ **Server**: Development server berjalan di localhost:3000

### Fitur yang dapat diuji:

- ✅ **Realtime messaging**: Pesan langsung muncul di semua client
- ✅ **Multiple rooms**: Buat dan join berbagai room chat
- ✅ **Typing indicators**: Lihat ketika user lain sedang mengetik
- ✅ **User presence**: Notifikasi ketika user join/leave room
- ✅ **Message persistence**: Pesan tersimpan di database MySQL
- ✅ **Message caching**: Pesan di-cache di Redis untuk performa
- ✅ **Responsive design**: UI yang responsive di berbagai device

### Struktur Database:

```sql
-- Tabel users
+----------+--------------+------+-----+---------------------+-------+
| Field    | Type         | Null | Key | Default             | Extra |
+----------+--------------+------+-----+---------------------+-------+
| id       | varchar(191) | NO   | PRI | NULL                |       |
| username | varchar(191) | NO   | UNI | NULL                |       |
| email    | varchar(191) | NO   | UNI | NULL                |       |
| createdAt| datetime(3)  | NO   |     | CURRENT_TIMESTAMP(3)|       |
| updatedAt| datetime(3)  | NO   |     | NULL                |       |
+----------+--------------+------+-----+---------------------+-------+

-- Sample users tersedia: john_doe, jane_smith, bob_wilson
```

### Troubleshooting (Sudah Diperbaiki):

1. ✅ **Error koneksi database**: Fixed - URL database sudah benar
2. ✅ **Error migrasi**: Fixed - Database direset dan dimigrate ulang
3. ✅ **Error Prisma client**: Fixed - Client sudah di-generate
4. ✅ **Build error**: Fixed - Aplikasi berhasil di-build

**Aplikasi siap digunakan! 🚀**

Buka http://localhost:3000 dan mulai chatting!
