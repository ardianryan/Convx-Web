# 🎵 Convx Web (Liquid Glass Player)

Convx Web is a standalone, high-performance web music streaming platform engineered for **speed, responsiveness, and minimal memory usage** (idle RAM < 30 MB).

Powered by a **Go** backend audio proxy & InnerTube engine, a **Node.js Gateway** with **Drizzle ORM / SQLite** for authentication, and a **Svelte 5 + Vite + Tailwind CSS** frontend featuring a signature **Liquid Glass** interface.

---

## ⚡ Key Features

- **Ultra Lightweight & Fast:** Single binary Go backend (~10 MB) paired with Svelte 5 runes for near-instant reactive rendering and minimal resource footprint.
- **Signature Liquid Glass UI:** Premium frosted glass aesthetics (`backdrop-blur`), smooth spring transitions, responsive navigation, and adaptive dark mode.
- **Uninterrupted Audio Streaming:** Native HTML5 `<audio>` engine powered by YouTube Format 18 (MP4 container with AAC-LC audio) with `ratebypass=yes`, supporting full HTTP Range requests (`206 Partial Content`) and instant scrubbing without playback interruptions.
- **Cloudflare Relay Management:** Built-in dashboard to deploy, test, and toggle Cloudflare Workers relays directly from the settings interface.
- **MediaSession API:** Native lockscreen controls, media key shortcuts, and dynamic track metadata synchronization.
- **Queue & Playlist Management:** Reactive player queue with drag-and-drop ordering, shuffle, repeat, and YouTube cookie synchronization for personal playlists.
- **Single Container Docker Deployment:** Multi-stage production image embedding frontend, backend, and gateway.

---

## 🔌 Port Configuration

- **Port `7554` (Default Public Gateway / Production):** Main reverse proxy gateway (Node.js + Drizzle ORM + embedded frontend).
- **Port `7555` (Internal Go Backend):** High-throughput Go REST API & AudioProxy server.
- **Port `5147` (Frontend Development):** Vite dev server with Hot Module Replacement (HMR) proxying `/api` to `7554`.

---

## 🐳 Quick Start with Docker

### 1. Run from GitHub Container Registry (GHCR):
```bash
docker run -d \
  --name convx-web \
  --restart unless-stopped \
  -p 7554:7554 \
  -v convx-data:/app/backend/data \
  ghcr.io/ardianryan/convx-web:latest
```
Open in your browser: `http://localhost:7554`

### 2. Run via Docker Compose:
```bash
docker compose up -d
```

---

## 🛠️ Local Development

### Prerequisites
- **Go 1.22+**
- **Node.js 20+**
- **npm 10+**

### Running Services Locally:

1. **Terminal 1: Go Backend Server (Port 7555)**
   ```bash
   cd backend
   go run .
   ```

2. **Terminal 2: Node.js Gateway (Port 7554)**
   ```bash
   cd server
   npm install
   node index.js
   ```

3. **Terminal 3: Svelte 5 Frontend (Port 5147)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5147` in your browser. API requests are automatically forwarded to `http://localhost:7554`.

### Building Production Bundle:
```bash
# 1. Build frontend into backend/dist
cd frontend && npm run build

# 2. Compile standalone Go binary
cd ../backend && CGO_ENABLED=0 go build -ldflags="-s -w" -o convx-web .
```

---

## 📄 License

Distributed under the [GPL-3.0 License](LICENSE). See `LICENSE` for more information.

