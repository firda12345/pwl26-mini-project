# 📚 Mini Project REST API - Sistem Peminjaman Buku (ETS PWL)

Project backend REST API yang dibangun menggunakan **Node.js**, **Express.js**, **Prisma ORM**, dan **MySQL**. Sistem ini menerapkan mekanisme **Database Transaction (`prisma.$transaction`)** untuk menjamin integritas dan konsistensi data antara pengurangan stok buku dan pencatatan riwayat peminjaman secara atomik.

---

## 👨‍💻 Identitas
* **Nama:** Mustafida
* **NIM:** F1D02410126
* **Mata Kuliah:** Pemrograman Web Lanjut 

---

## 🎥 Live Coding & Demo 
Dokumentasi video penjelasan kode, pengujian endpoint di Postman, serta pembuktian transaksi & *rollback* database dapat diakses melalui tautan berikut:
* **Link Video Demo ETS:** [Klik di sini untuk menonton Video Live Coding & Demo](https://youtu.be/PUEDL-4wILw)

---

## 🚀 Fitur Utama & Arsitektur
1. **Manajemen Buku (`Books API`)**:
   * Menambahkan data buku baru beserta validasi format waktu ISO 8601 (`publishedDate`).
   * Menampilkan daftar seluruh buku dan detail ketersediaan stok.
2. **Sistem Peminjaman Buku (`Borrowings API`)**:
   * **Validasi Input Ketat:** Menggunakan *middleware* validator sebelum data diproses oleh controller.
   * **Transaksi Database Atomik (`prisma.$transaction`):** Memastikan proses pengecekan stok, pengurangan stok di tabel `books`, dan pembuatan data di tabel `borrowings` berjalan sebagai satu kesatuan.
   * **Penanganan Konflik Stok (`409 Conflict`):** Menggagalkan peminjaman secara aman apabila jumlah buku yang diminta melebihi sisa stok di database.
   * **Mekanisme *Rollback* Otomatis:** Apabila terjadi kesalahan sistem di tengah transaksi, seluruh perubahan database dibatalkan secara otomatis sehingga data tetap konsisten.


---

## 🛠️ Persyaratan & Instalasi

### **Prasyarat**
* **Node.js** (v18 atau lebih baru)
* **XAMPP / MySQL Server** (berjalan di port `3306`)
* **Postman** (untuk pengujian API)

### **Langkah Menjalankan Project**
1. **Masuk ke direktori project:**
   ```bash
   cd F1D02410126_MiniProject_REST_API
   ```
2. **Instal seluruh *dependencies*:**
   ```bash
   npm install
   ```
3. **Konfigurasi file `.env`:**
   Salin file `.env.example` menjadi `.env`, lalu sesuaikan koneksi database lokalmu:
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/etspwl_db"
   PORT=3000
   ```
4. **Jalankan migrasi skema database Prisma:**
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Jalankan server:**
   ```bash
   npm run dev
   ```
   Server akan berjalan aktif pada `http://localhost:3000`.

---

## 🧪 Dokumentasi Pengujian Endpoint (Postman)

### **1. Menambahkan Buku Baru (`POST /api/books`)**
**Request Body (JSON):**
```json
{
  "title": "Pemrograman Web Lanjut",
  "author": "Tim Dosen",
  "year": 2026,
  "price": 75000,
  "stock": 5,
  "publishedDate": "2026-11-18T00:00:00.000Z"
}
```

### **2. Skenario Peminjaman Berhasil (`POST /api/borrowings`)**
**Request Body (JSON):**
```json
{
  "bookId": 1,
  "borrowerName": "Mustafida",
  "quantity": 2
}
```
* **Hasil:** Status `201 Created`, riwayat peminjaman tersimpan di tabel `borrowings`, dan stok buku berkurang secara otomatis di tabel `books`.

### **3. Skenario Gagal Stok Tidak Mencukupi (`POST /api/borrowings`)**
**Request Body (JSON):**
```json
{
  "bookId": 1,
  "borrowerName": "Mustafida",
  "quantity": 10
}
```
* **Hasil:** Status `409 Conflict` dengan pesan error bahwa stok tidak mencukupi, dan data di database tetap aman.

---

## 📸 Screenshots Hasil Pengujian & Database
*(Hasil tangkapan layar Postman dan phpMyAdmin)*


### **1. Skenario 1: Transaksi Peminjaman Berhasil (`201 Created`)**
![Borrowing Success](screenshots/201%20Created.png)

### **2. Skenario 2: Gagal Peminjaman - Stok Kurang (`409 Conflict`)**
![Insufficient Stock](screenshots/409%20Conflict.png)

### **3. Skenario 3: Simulasi Error & Bukti Rollback Database**
![Transaction Rollback](screenshots/500%20Internal%20Server%20Error.png)