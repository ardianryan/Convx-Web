# Changelog — Convx Web

All notable changes to the **Convx Web** platform are documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) aligned with official releases on GitHub.

---

## [1.0.2] — 2026-09-16

### Added
- **Complete Playlist Engine**: Full end-to-end playlist management with SQLite database persistence and Drizzle ORM (`playlists` and `playlist_tracks` tables with cascade deletion).
- **Apple Music-Style Playlist UI**: Dedicated Playlist Grid and Detail View with 6 color gradient presets, 4-track mosaic thumbnails, total duration calculation, and Play All / Shuffle All controls.
- **Universal "Add to Playlist" Action**: Added `+` button on all track cards across Search, Radio, and Home with Cupertino modal to add tracks to existing playlists or create new ones on the fly.
- **YouTube & YouTube Music Playlist Import**: Instant URL/ID parsing via InnerTube engine supporting modern `lockupViewModel`, `playlistVideoRenderer`, and `musicResponsiveListItemRenderer` formats with 1-click "Simpan ke Perpustakaan" import.

### Fixed
- **Queue Store Method Call**: Fixed invalid `queue.add()` call in `TrackList.svelte` to use reactive `addToQueue()` with checkmark visual feedback.
- **Library Navigation**: Replaced placeholder redirect from "Daftar Putar" to the dedicated Playlists view, with an independent "Antrean Putar" row.

---

## [1.0.1] — 2026-09-16

### Added
- **Format 18 Audio Engine**: Integrated YouTube Android client (`clientVersion: 20.10.38`) serving Format 18 (MP4 container with stereo AAC-LC audio) with `ratebypass=yes`.
- **Full HTTP Range & Seeking**: Enabled full open byte range support (`Range: bytes=0-`) and instantaneous scrubbing to any track timestamp without burst limits.
- **Header Forwarding on Redirects**: Seamless handling of Google Video CDN *HTTP 302 Found* redirects with automated preservation of `Range` and `User-Agent` headers.
- **Dynamic User-Agent Switching**: Real-time User-Agent selection in `AudioProxy` matching stream parameters (`c=ANDROID` vs `c=IOS`).

### Changed
- **Standalone Repository Architecture**: Promoted all web platform modules (`frontend/`, `backend/`, `server/`, `Dockerfile`, `docker-compose.yml`) directly to the repository root for streamlined development and deployment.
- **CI/CD Pipeline Optimization**: Updated GitHub Actions workflow (`docker-publish.yml`) to build from the root context (`.`) utilizing multi-stage BuildKit caching.

### Removed
- **Legacy Android Codebase Clean-up**: Completely removed 1,434 obsolete Android Gradle submodule files (-267,278 lines of code) to keep the repository lightweight and focused exclusively on web architecture.

### Fixed
- **502 Bad Gateway Errors**: Eliminated stream proxy failures caused by IP address mismatches between Cloudflare Relay and Google Video CDN URL signatures.
- **0:28 Playback Loop**: Resolved the issue where audio looped back to 00:00 after ~28 seconds due to unauthenticated iOS client GVS PO Token burst quota constraints.

---

## [1.0.0] — 2026-09-12

### Added
- **Official Web Platform Launch**: Initial release of Convx Web, a high-performance web music streaming platform.
- **Liquid Glass Interface (Svelte 5)**: State-of-the-art frosted glass UI built with Svelte 5 runes, Tailwind CSS, and Lucide Icons, optimized for desktop and mobile browsers.
- **Go Audio Backend**: High-throughput Go REST API and AudioProxy server (`http://localhost:7555`) with InnerTube YouTube Music integration.
- **Node.js Gateway & Drizzle ORM**: Reverse proxy gateway (`http://localhost:7554`) powered by Express and SQLite database for session authentication and multi-relay management.
- **Cloudflare Relay Management**: Integrated dashboard to deploy, test, and toggle Cloudflare Workers relays directly from the settings panel.
- **Onboarding Wizard**: Guided first-run setup flow for admin account initialization and Cloudflare credentials configuration.
- **YouTube Account Sync**: Cookie import capability enabling access to personal playlists and saved tracks.
- **Automated Docker Publishing**: GitHub Actions workflow delivering automated multi-stage builds to GitHub Container Registry (`ghcr.io/ardianryan/convx-web:latest`).

---

## [Upcoming] — 1.0.2 / 1.1.0

- Professional grammar standardization and language refinement.
- Dedicated language and personalization settings modules.
