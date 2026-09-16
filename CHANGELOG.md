# Catatan Rilis (Changelog) — Convx Web

Semua perubahan penting pada proyek **Convx Web** didokumentasikan dalam berkas ini. Format rilis mengacu pada prinsip [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan menganut [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [5.1.1] — 2026-09-16

### Ditambahkan (Added)
- **Format 18 Audio Streaming**: Integrasi client Android YouTube (`clientVersion: 20.10.38`) yang menyajikan Format 18 (kontainer MP4 dengan audio AAC-LC stereo) dengan parameter `ratebypass=yes`.
- **Dukungan HTTP Range Penuh**: Pemutaran audio kini mendukung rentang bita terbuka (`Range: bytes=0-`) dan navigasi durasi (*seeking*) ke posisi mana pun tanpa batasan kuota burst.
- **Pelestarian Header pada Redirect**: Penanganan *HTTP 302 Found* dari Google Video CDN dengan meneruskan header `Range` dan `User-Agent` secara otomatis.
- **Deteksi User-Agent Dinamis**: `AudioProxy` menyesuaikan User-Agent sesuai tipe stream (`c=ANDROID` atau `c=IOS`).

### Diubah (Changed)
- **Arsitektur Repositori Mandiri (Standalone Web)**: Mengangkat komponen web (`frontend/`, `backend/`, `server/`, `Dockerfile`, `docker-compose.yml`) langsung ke root repositori untuk kemudahan navigasi dan *deployment*.
- **Alur Kerja CI/CD**: Memperbarui alur kerja GitHub Actions (`docker-publish.yml`) agar membaca konteks root (`.`) dengan cache BuildKit multi-stage.

### Dihapus (Removed)
- **Pembersihan Kode Sumber Legacy Android**: Menghapus seluruh submodul Gradle Android lama (`app/`, `applecanvas/`, `kizzy/`, `kugou/`, `gradle/`, `innertube/`, dll.) sejumlah 1.434 berkas (-267.278 baris) yang tidak lagi digunakan oleh Convx Web.

### Diperbaiki (Fixed)
- **Error 502 Bad Gateway**: Menghilangkan kegagalan stream akibat ketidakcocokan alamat IP antara Cloudflare Relay dan penandatanganan URL Google Video CDN.
- **Audio Berulang di Detik 28–30**: Mengatasi bug perulangan audio ke 00:00 akibat pembatasan 1 MiB Google Video Server PO Token pada client iOS unauthenticated.

---

## [5.1.0] — 2026-09-14

### Ditambahkan (Added)
- **Node.js Gateway & Drizzle ORM**: Reverse proxy gateway pada porta `7554` dengan database SQLite untuk manajemen sesi autentikasi dan pengaturan pengguna.
- **Manajemen Cloudflare Relay**: Dukungan pendaftaran, pengujian kesehatan (*health test*), dan *toggle* Cloudflare Workers relay langsung melalui UI Pengaturan.
- **Onboarding Wizard**: Panduan konfigurasi awal bagi pengguna baru untuk inisialisasi akun admin dan koneksi relay.
- **Sinkronisasi Akun YouTube**: Dukungan impor *cookie* YouTube untuk pemutaran playlist pribadi dan lagu tersimpan.

### Diubah (Changed)
- **Backend Audio Proxy**: Pemisahan porta layanan internal Go (`7555`) dan gerbang publik Node.js (`7554`).

---

## [5.0.4] — 2026-09-10

### Ditambahkan (Added)
- **Rilis Perdana Convx Web**: Pemutar musik berbasis web modern dengan antarmuka Svelte 5 + Tailwind CSS (*Liquid Glass UI*).
- **Go REST API & Proxy Server**: Mesin pencari dan proksi audio berbasis InnerTube YouTube Music.
- **Dukungan Docker Multi-Stage**: Kontainerisasi gabungan frontend Vite, backend Go, dan gerbang Node.js.
- **Integrasi Lirik**: Pencarian dan sinkronisasi lirik lagu secara otomatis.

---

## [Rencana Mendatang (Upcoming)] — 5.1.2

- Integrasi dan adaptasi tata bahasa profesional berstandar EYD V.
- Halaman pengaturan khusus untuk personalisasi bahasa dan modul terpisah.
