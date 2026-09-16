# Catatan Rilis (Changelog) — Convx Web

Semua perubahan penting pada platform **Convx Web** didokumentasikan dalam berkas ini. Penomoran versi mengacu pada prinsip [Semantic Versioning](https://semver.org/spec/v2.0.0.html) dan disesuaikan dengan rilis resmi Convx Web di GitHub Releases.

---

## [1.0.1] — 2026-09-16

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

## [1.0.0] — 2026-09-12

### Ditambahkan (Added)
- **Rilis Perdana Resmi Convx Web**: Platform streaming musik berkinerja tinggi berbasis peramban web modern (*Official Web Platform*).
- **Antarmuka Liquid Glass (Svelte 5)**: Menggunakan Svelte 5 + Tailwind CSS + Lucide Icons yang responsif untuk desktop dan perangkat seluler.
- **Go Backend Audio Engine**: Peladen Go HTTP REST API & AudioProxy berkecepatan tinggi (`http://localhost:7555`) untuk pemutaran audio lancar tanpa jeda.
- **Node.js Gateway & Drizzle ORM**: Gerbang perantara (`http://localhost:7554`) dengan basis data SQLite untuk manajemen autentikasi sesi pengguna dan konfigurasi multi-relay.
- **Manajemen Cloudflare Relay**: Dukungan pendaftaran, pengujian kesehatan (*health test*), dan *toggle* Cloudflare Workers relay langsung melalui antarmuka Pengaturan.
- **Onboarding Wizard**: Panduan konfigurasi interaktif untuk pengguna baru pada saat instalasi awal.
- **Sinkronisasi YouTube**: Dukungan sinkronisasi *cookie* untuk mengakses playlist pribadi dan riwayat lagu pengguna.
- **Dukungan Kontainerisasi Docker**: Rilis citra Docker terotomatisasi ke GitHub Container Registry (`ghcr.io/ardianryan/convx-web:latest`).

---

## [Rencana Mendatang (Upcoming)] — 1.0.2 / 1.1.0

- Integrasi dan adaptasi tata bahasa profesional berstandar EYD V.
- Pemisahan halaman/bagian pengaturan untuk personalisasi bahasa.
