# Dokumentasi Fungsi Backend - Renaissance Gallery

Dokumentasi ini merangkum seluruh fungsi, arsitektur, dan logika kerja backend yang dibangun menggunakan NestJS dengan struktur MVC untuk aplikasi Renaissance Gallery.

---

## 1. Arsitektur dan Komponen Utama

Backend ini mengimplementasikan pola arsitektur MVC (Model-View-Controller):
- **Model**: Direpresentasikan oleh Entity `Artwork` dan Data Transfer Object (`CreateArtworkDto` dan `UpdateArtworkDto`).
- **Controller**: `ArtworksController` yang menerima request HTTP, memetakan routing, dan mendelegasikan tugas ke Service melalui Dependency Injection.
- **Service**: `ArtworksService` yang mengelola logika bisnis, manipulasi array in-memory, dan validasi aturan domain (seperti duplikasi data dan keberadaan resource).

---

## 2. Dokumentasi Fungsi Controller (`ArtworksController`)

Lokasi: `backend/src/artworks/artworks.controller.ts`

Controller ini menangani seluruh endpoint HTTP untuk resource `/artworks` dengan menyuntikkan `ArtworksService` melalui konstruktor:

### a. `create(@Body() createArtworkDto: CreateArtworkDto)`
- **HTTP Method**: `POST /artworks`
- **Fungsi**: Menerima request body yang telah divalidasi oleh `ValidationPipe`, lalu meneruskannya ke `ArtworksService.create()`.
- **Status Response**: `201 Created` jika berhasil, `400 Bad Request` jika validasi DTO gagal, `409 Conflict` jika judul sudah ada.
- **Hasil Return**: Objek `Artwork` baru yang berhasil disimpan.

### b. `findAll()`
- **HTTP Method**: `GET /artworks`
- **Fungsi**: Memanggil `ArtworksService.findAll()` untuk mengambil seluruh data karya seni yang tersimpan.
- **Status Response**: `200 OK`.
- **Hasil Return**: Array of `Artwork`.

### c. `findOne(@Param('id') id: string)`
- **HTTP Method**: `GET /artworks/:id`
- **Fungsi**: Menerima parameter route `id` dan memanggil `ArtworksService.findOne(id)` untuk mencari data spesifik.
- **Status Response**: `200 OK` jika ditemukan, `404 Not Found` jika tidak ditemukan.
- **Hasil Return**: Objek `Artwork` yang sesuai.

### d. `update(@Param('id') id: string, @Body() updateArtworkDto: UpdateArtworkDto)`
- **HTTP Method**: `PATCH /artworks/:id`
- **Fungsi**: Menerima parameter `id` serta data parsial perubahan, lalu memanggil `ArtworksService.update(id, updateArtworkDto)`.
- **Status Response**: `200 OK` jika berhasil, `404 Not Found` jika ID tidak ditemukan, `409 Conflict` jika pembaruan judul menimbulkan duplikasi.
- **Hasil Return**: Objek `Artwork` yang telah diperbarui.

### e. `remove(@Param('id') id: string)`
- **HTTP Method**: `DELETE /artworks/:id`
- **Fungsi**: Menerima parameter `id` dan memanggil `ArtworksService.remove(id)` untuk menghapus karya seni.
- **Status Response**: `200 OK` jika berhasil, `404 Not Found` jika ID tidak ditemukan.
- **Hasil Return**: Objek pesan konfirmasi dan salinan data yang dihapus (`{ message, deletedArtwork }`).

---

## 3. Dokumentasi Fungsi Service (`ArtworksService`)

Lokasi: `backend/src/artworks/artworks.service.ts`

Service bertindak sebagai penyimpan state dan eksekutor logika bisnis:

### a. State In-Memory (`artworks`)
- Berupa array privat bertipe `Artwork[]` yang diinisialisasi dengan kumpulan lukisan Renaissance (seperti *Mona Lisa*, *The Birth of Venus*, *The School of Athens*, dsb.).
- Perubahan data (tambah, edit, hapus) langsung merefleksikan array ini selama runtime aktif.

### b. `create(createArtworkDto: CreateArtworkDto): Artwork`
- **Alur Kerja**:
  1. Memeriksa apakah judul karya seni yang diinput sudah ada di dalam array `artworks` (pencocokan case-insensitive).
  2. Jika sudah ada, melemparkan `ConflictException`.
  3. Jika belum ada, membentuk entitas `Artwork` baru dengan `id` berformat `art-<timestamp>`, nilai default `image` dan `isMasterpiece` jika tidak disertakan, serta data dari DTO.
  4. Menambahkan item baru ke awal array menggunakan `this.artworks.unshift(newArtwork)`.
  5. Mengembalikan data karya seni yang baru dibuat.

### c. `findAll(): Artwork[]`
- **Alur Kerja**:
  - Mengembalikan seluruh elemen dari array `this.artworks`.

### d. `findOne(id: string): Artwork`
- **Alur Kerja**:
  1. Melakukan pencarian menggunakan `this.artworks.find((item) => item.id === id)`.
  2. Jika data tidak ditemukan, melemparkan `NotFoundException` dengan pesan informasi ID terkait.
  3. Jika ditemukan, mengembalikan objek `Artwork`.

### e. `update(id: string, updateArtworkDto: UpdateArtworkDto): Artwork`
- **Alur Kerja**:
  1. Mencari indeks data menggunakan `findIndex()`. Jika bernilai `-1`, melemparkan `NotFoundException`.
  2. Jika `updateArtworkDto` menyertakan `title`, dilakukan verifikasi apakah judul baru tersebut sudah digunakan oleh karya seni lain dalam koleksi. Jika ya, melemparkan `ConflictException`.
  3. Menggabungkan data lama dengan data baru menggunakan spread operator (`...this.artworks[index], ...updateArtworkDto`).
  4. Mengembalikan data karya seni yang telah diperbarui.

### f. `remove(id: string): { message: string; deletedArtwork: Artwork }`
- **Alur Kerja**:
  1. Mencari indeks data menggunakan `findIndex()`. Jika bernilai `-1`, melemparkan `NotFoundException`.
  2. Menghapus item dari array menggunakan `this.artworks.splice(index, 1)`.
  3. Mengembalikan respons konfirmasi penghapusan beserta objek data yang dihapus.

---

## 4. Dokumentasi Struktur Data dan Validasi (Entity & DTO)

### a. Entity: `Artwork` (`src/artworks/entities/artwork.entity.ts`)
Merepresentasikan skema data karya seni dengan 8 field bervariasi:
- `id` (`string`): Pengenal unik data karya seni.
- `title` (`string`): Judul lukisan.
- `artist` (`string`): Nama seniman pembuat.
- `year` (`number`): Tahun pembuatan (bertipe angka).
- `period` (`string`): Periode seni Renaissance.
- `description` (`string`): Ulasan atau deskripsi karya seni.
- `image` (`string`): Tautan URL gambar karya seni.
- `isMasterpiece` (`boolean`): Penanda karya utama/mahakarya.

### b. DTO: `CreateArtworkDto` (`src/artworks/dto/create-artwork.dto.ts`)
Mengatur aturan validasi payload saat penambahan karya baru:
- `title`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(3)`
- `artist`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(2)`
- `year`: `@IsInt()`, `@Min(1200)`, `@Max(2100)`
- `period`: `@IsIn(['Renaissance Awal', 'Renaissance Tinggi', 'Manierisme', 'Renaissance Utara'])`
- `description`: `@IsString()`, `@IsNotEmpty()`, `@MinLength(10)`
- `image`: `@IsOptional()`, `@IsUrl()`
- `isMasterpiece`: `@IsOptional()`, `@IsBoolean()`

### c. DTO: `UpdateArtworkDto` (`src/artworks/dto/update-artwork.dto.ts`)
Mewarisi `PartialType(CreateArtworkDto)`, menjadikan seluruh aturan validasi pada `CreateArtworkDto` bersifat opsional sehingga client dapat memperbarui field tertentu saja secara fleksibel.

---

## 5. Dokumentasi Penanganan Exception

Backend menggunakan exception standar bawaan `@nestjs/common`:

1. **`NotFoundException`**
   - **Kondisi**: Terjadi saat memanggil `GET`, `PATCH`, atau `DELETE` dengan ID yang tidak tercatat di dalam array data.
   - **Status Code**: `404 Not Found`
   - **Pesan Contoh**: `Karya seni dengan ID 'art-999' tidak ditemukan`

2. **`ConflictException`**
   - **Kondisi**: Terjadi saat client mencoba membuat karya baru (`POST`) atau mengubah judul (`PATCH`) yang persis sama dengan judul lukisan yang sudah ada dalam galeri.
   - **Status Code**: `409 Conflict`
   - **Pesan Contoh**: `Karya seni dengan judul 'Mona Lisa' sudah ada dalam koleksi`

3. **`BadRequestException`**
   - **Kondisi**: Terjadi otomatis saat format input request body tidak memenuhi kriteria dekorator `class-validator` yang diproses oleh `ValidationPipe`.
   - **Status Code**: `400 Bad Request`
   - **Pesan Contoh**: Berisi array deskripsi error field yang tidak valid.

---

## 6. Dokumentasi Konfigurasi Global (`main.ts`)

Lokasi: `backend/src/main.ts`

- **`app.enableCors()`**: Mengizinkan resource sharing antar domain agar frontend yang berjalan di port terpisah (misalnya Vite di port 5173) dapat melakukan request API ke backend (port 3000) tanpa terblokir browser.
- **`app.useGlobalPipes(new ValidationPipe(...))`**: Mengaktifkan validasi global dengan konfigurasi:
  - `whitelist: true`: Menghapus properti di luar DTO.
  - `forbidNonWhitelisted: true`: Menolak request yang mengirimkan field yang tidak terdefinisi di DTO.
  - `transform: true`: Mengonversi tipe data payload secara otomatis sesuai tipe field pada DTO.
