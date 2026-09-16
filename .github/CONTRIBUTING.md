# 🤝 Contributing to Convx Web

Thank you for your interest in contributing to **Convx Web**! This guide explains our architecture, workflow, and standards for submitting changes.

---

## 🛠️ Project Architecture

Convx Web is organized into three clean layers:

* **`frontend/`** — The Single Source of Truth for the UI. Built with **Svelte 5 (runes)**, **Vite**, and **Tailwind CSS**. Features our custom Liquid Glass design system.
* **`backend/`** — High-performance REST API and audio proxy written in **Go**. Handles InnerTube YouTube Music communication, Format 18 stream resolution, and low-latency audio chunk proxying.
* **`server/`** — Production Node.js gateway powered by **Express** and **Drizzle ORM / SQLite**. Manages user authentication, session security, and Cloudflare Workers relay deployment.

---

## 🖥️ Local Development Setup

### Prerequisites
- **Go 1.22+**
- **Node.js 20+**
- **npm 10+**

### Quick Start:
```bash
# 1. Run Go backend (Port 7555)
cd backend && go run .

# 2. Run Node.js Gateway (Port 7554)
cd server && npm install && node index.js

# 3. Run Svelte 5 Frontend (Port 5147)
cd frontend && npm install && npm run dev
```

---

## 🌿 Branches & Commits

- **Branch Naming**: `feature/short-description` or `fix/short-description`.
- **Commit House Style**: Use conventional commit prefixes (`feat:`, `fix:`, `refactor:`, `perf:`, `docs:`, `chore:`) followed by a concise, imperative description in English.

---

## 🚀 Pull Requests

1. Fork the repository and branch off `main`.
2. Keep changes focused and atomic — avoid mixing unrelated refactors or formatting changes.
3. Test your changes thoroughly:
   - Run `npm run build` in `frontend/` to verify Vite compilation.
   - Run `go build ./...` in `backend/` to verify Go types and compilation.
4. Open a PR against `main` with a clear explanation of *what* was changed and *why*. Include before/after screenshots or screen recordings for UI modifications.

---

## 🐞 Reporting Issues

If you encounter a bug, please open a GitHub Issue with:
- Steps to reproduce the issue.
- Expected vs. actual behavior.
- Browser name, version, and operating system.
- Relevant browser console logs or backend terminal output.

