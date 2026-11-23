# Renaissance Gallery - Backend

Layanan backend REST API untuk katalog digital karya seni era Renaissance yang dibangun menggunakan framework NestJS dengan arsitektur MVC (Model-View-Controller). 

Backend ini mengelola data karya seni (Artwork) dengan operasi CRUD lengkap, validasi data menggunakan DTO dan `class-validator`, penanganan error dengan exception bawaan NestJS (`NotFoundException`, `ConflictException`), serta penyimpanan data sementara menggunakan array di memori.
