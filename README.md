# Renaissance Gallery - Fullstack App (NestJS + React)

Aplikasi katalog digital karya seni era Renaissance yang dibangun menggunakan arsitektur MVC pada backend NestJS dan frontend React. Proyek ini merupakan pemenuhan **Tugas Perkuliahan BAB 9: NestJS Dasar + Struktur MVC**, yang menghubungkan backend REST API ke antarmuka pengguna frontend.

---

## Daftar Isi
1. [Fitur Utama](#fitur-utama)
2. [Data Utama (Entity)](#data-utama-entity)
3. [Arsitektur MVC Backend](#arsitektur-mvc-backend)
4. [Validasi Data (DTO & ValidationPipe)](#validasi-data-dto--validationpipe)
5. [Penanganan Exception](#penanganan-exception)
6. [Daftar Endpoint API](#daftar-endpoint-api)
7. [Pengujian REST Client](#pengujian-rest-client)
8. [Integrasi Frontend & Backend](#integrasi-frontend--backend)
9. [Panduan Menjalankan Proyek](#panduan-menjalankan-proyek)
10. [Dokumentasi Fungsi Backend](./docs/README.md)

---

## Fitur Utama
- **Katalog Karya Seni**: Menampilkan daftar lukisan era Renaissance lengkap dengan metadata (seniman, tahun, periode, deskripsi, gambar, status masterpiece).
- **CRUD Penuh**:
  - Menambah karya seni baru (*Create*)
  - Menampilkan seluruh karya seni dan detail per item (*Read*)
  - Mengubah informasi karya seni yang ada (*Update*)
  - Menghapus karya seni dari koleksi (*Delete*)
- **Validasi Data Otomatis**: Menggunakan `class-validator` dan `ValidationPipe` global untuk memastikan integritas input.
- **Error Handling**: Penanganan kesalahan menggunakan exception standar NestJS (`NotFoundException`, `ConflictException`, dan `BadRequestException`).
- **Koneksi Frontend-Backend**: Operasi frontend React secara langsung terhubung ke backend NestJS via REST API dengan dukungan CORS.

---

## Data Utama (Entity)
Data utama yang dikelola adalah **Artwork** (`src/artworks/entities/artwork.entity.ts`). Entity ini memiliki struktur data dengan tipe yang bervariasi:

| Field | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `string` | Identifier unik karya seni (misal: `art-001` atau `art-1740000000000`) |
| `title` | `string` | Judul lukisan / karya seni |
| `artist` | `string` | Nama seniman pembuat karya |
| `year` | `number` | Tahun pembuatan karya seni |
| `period` | `string` | Periode seni (Renaissance Awal, Renaissance Tinggi, Manierisme, Renaissance Utara) |
| `description` | `string` | Deskripsi subjek atau latar belakang sejarah lukisan |
| `image` | `string` | URL gambar lukisan |
| `isMasterpiece` | `boolean` | Penanda apakah karya tergolong adikarya utama |

---

## Arsitektur MVC Backend
Struktur folder backend mengikuti pola MVC (Model-View-Controller) bawaan NestJS:
- **Model**: Direpresentasikan oleh Entity `Artwork` (`src/artworks/entities/artwork.entity.ts`) dan DTO (`src/artworks/dto/`).
- **Controller**: `ArtworksController` (`src/artworks/artworks.controller.ts`) menangani incoming request HTTP (GET, POST, PATCH, DELETE) dan meneruskannya ke Service.
- **Service**: `ArtworksService` (`src/artworks/artworks.service.ts`) menangani logika bisnis dan manipulasi data di dalam array memori. Dependency Injection digunakan untuk menyuntikkan Service ke Controller.

---

## Validasi Data (DTO & ValidationPipe)
Validasi input diterapkan pada DTO menggunakan `class-validator` dan diaktifkan secara global di `src/main.ts` melalui `ValidationPipe`:
- `@IsString()` & `@IsNotEmpty()`: Memastikan field berupa teks dan tidak kosong.
- `@MinLength(3)`: Judul karya minimal 3 karakter.
- `@MinLength(2)`: Nama seniman minimal 2 karakter.
- `@IsInt()`, `@Min(1200)`, `@Max(2100)`: Tahun harus integer dalam rentang tahun yang logis.
- `@IsIn([...])`: Periode harus masuk dalam daftar periode yang valid.
- `@IsUrl()` & `@IsOptional()`: Gambar opsional namun jika diisi harus URL valid.
- `@IsBoolean()` & `@IsOptional()`: Status masterpiece opsional bertipe boolean.

---

## Penanganan Exception
Backend menangani skenario error menggunakan exception bawaan NestJS:
1. **`NotFoundException` (404)**: Dilempar ketika client meminta, memperbarui, atau menghapus karya seni dengan ID yang tidak tercatat di server.
2. **`ConflictException` (409)**: Dilempar saat pembuatan atau pembaruan karya seni memiliki judul yang sudah terdaftar dalam koleksi (mencegah duplikasi).
3. **`BadRequestException` (400)**: Otomatis dihasilkan oleh `ValidationPipe` saat payload tidak memenuhi kriteria validasi DTO.

---

## Daftar Endpoint API

| Method | Endpoint | Deskripsi | Status Sukses |
| :--- | :--- | :--- | :--- |
| `GET` | `/artworks` | Mendapatkan semua karya seni | 200 OK |
| `GET` | `/artworks/:id` | Mendapatkan detail karya seni berdasarkan ID | 200 OK |
| `POST` | `/artworks` | Menambahkan karya seni baru | 201 Created |
| `PATCH` | `/artworks/:id` | Memperbarui karya seni sebagian | 200 OK |
| `DELETE` | `/artworks/:id` | Menghapus karya seni berdasarkan ID | 200 OK |

---

## Pengujian REST Client
File pengujian REST Client tersedia di `backend/artworks.http`. Pengujian dapat dijalankan langsung di VS Code menggunakan extension **REST Client**.

Contoh isi request dan response yang diuji:

### 1. GET All Artworks
```http
GET http://localhost:3000/artworks
```
**Response (200 OK)**:
```json
[
  {
    "id": "art-001",
    "title": "Mona Lisa",
    "artist": "Leonardo da Vinci",
    "year": 1503,
    "period": "Renaissance Tinggi",
    "description": "Potret setengah badan...",
    "image": "https://upload.wikimedia.org/...",
    "isMasterpiece": true
  }
]
```

### 2. POST Create Artwork
```http
POST http://localhost:3000/artworks
Content-Type: application/json

{
  "title": "The Last Judgment",
  "artist": "Michelangelo",
  "year": 1541,
  "period": "Renaissance Tinggi",
  "description": "Fresko mahakarya di dinding altar Kapel Sistina yang menggambarkan kedatangan kedua Kristus.",
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Michelangelo_-_The_Last_Judgment.jpg/800px-Michelangelo_-_The_Last_Judgment.jpg",
  "isMasterpiece": true
}
```
**Response (201 Created)**:
```json
{
  "id": "art-1740000000000",
  "title": "The Last Judgment",
  "artist": "Michelangelo",
  "year": 1541,
  "period": "Renaissance Tinggi",
  "description": "Fresko mahakarya di dinding altar Kapel Sistina yang menggambarkan kedatangan kedua Kristus.",
  "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Michelangelo_-_The_Last_Judgment.jpg/800px-Michelangelo_-_The_Last_Judgment.jpg",
  "isMasterpiece": true
}
```

### 3. POST Conflict Error (Duplikasi Judul)
```http
POST http://localhost:3000/artworks
Content-Type: application/json

{
  "title": "The Last Judgment",
  "artist": "Michelangelo",
  "year": 1541,
  "period": "Renaissance Tinggi",
  "description": "Duplikat untuk memicu ConflictException.",
  "isMasterpiece": true
}
```
**Response (409 Conflict)**:
```json
{
  "message": "Karya seni dengan judul 'The Last Judgment' sudah ada dalam koleksi",
  "error": "Conflict",
  "statusCode": 409
}
```

### 4. GET / PATCH / DELETE Not Found Error
```http
GET http://localhost:3000/artworks/art-999
```
**Response (404 Not Found)**:
```json
{
  "message": "Karya seni dengan ID 'art-999' tidak ditemukan",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Integrasi Frontend & Backend
Frontend React (`frontend/src/App.jsx`) terhubung langsung ke REST API NestJS:
- **Memuat Data**: Mengambil data karya seni melalui endpoint `GET /artworks` saat aplikasi pertama kali dimuat.
- **Menambah Data**: Form tambah karya memanggil `POST /artworks`, memperbarui daftar karya di layar secara reaktif.
- **Mengubah Data**: Tombol "Ubah" pada kartu karya seni membuka form edit untuk memanggil `PATCH /artworks/:id`.
- **Menghapus Data**: Tombol "Hapus" memicu pemanggilan `DELETE /artworks/:id` dan memperbarui state lokal.

---

## Panduan Menjalankan Proyek

### 1. Menjalankan Backend (NestJS)
Buka terminal dan jalankan:
```bash
cd backend
npm install
npm run start:dev
```
Backend akan aktif di `http://localhost:3000`.

### 2. Menjalankan Frontend (React + Vite)
Buka terminal baru dan jalankan:
```bash
cd frontend
npm install
npm run dev
```
Frontend akan aktif di `http://localhost:5173`.

---

## Dokumentasi Fungsi
Rincian penjelasan mendalam mengenai setiap fungsi Controller, logika bisnis Service, validasi DTO, dan arsitektur backend dapat dilihat di dokumen [Dokumentasi Fungsi Backend](./docs/README.md).