# Vastramay Environment Setup & Tooling Guide

This document describes how to configure, run, and troubleshoot the Vastramay local development environment.

---

## 1. Prerequisites

Before setting up the repository, ensure the host machine satisfies:
- **Operating System**: macOS, Linux, or Windows (WSL2 recommended on Windows).
- **Node.js**: `v18.0.0` or higher (Tested on `v20.x` LTS).
- **npm**: `v9.0.0` or higher.
- **Modern Browser**: Chrome, Edge, Safari, or Firefox with ES2022+ and CSS Grid support.

---

## 2. Installation Steps

```bash
# Step 1: Clone repository and enter workspace
git clone <repository_url> vastramay-3d
cd vastramay-3d

# Step 2: Install dependencies
npm install

# Step 3: Configure local environment variables
cp .env.example .env.local

# Step 4: Start local development server
npm run dev
```

The Vite dev server will start at `http://localhost:3000`.

---

## 3. Environment Variables Configuration

The application uses standard Vite client-side environment variables prefixed with `VITE_`.

| Variable | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `VITE_APP_NAME` | String | `"Vastramay Couture"` | Brand display name in titles and receipts |
| `VITE_APP_URL` | String | `"http://localhost:3000"` | Canonical base URL |
| `VITE_ENVIRONMENT` | String | `"development"` | Environment identifier (`development` / `production`) |
| `VITE_USE_MOCK_STORAGE` | Boolean | `true` | When true, enables `VersionedLocalStorageAdapter` |
| `VITE_STORAGE_PREFIX` | String | `"vastramay"` | Key prefix used for browser storage namespacing |
| `VITE_API_BASE_URL` | String | *(Optional)* | Reserved for future Phase 13+ live API connection |

> **Security Note**: Never commit actual secrets, private tokens, or payment gateway private keys to `.env.example` or `.env.local`. Client-side environment variables in Vite are bundled into the public browser script.

---

## 4. Local Port & Network Configuration

The dev server port is configured in [`vite.config.ts`](file:///Users/jarvis/MySites/vastramay-3d/vite.config.ts):
```typescript
server: {
  port: 3000,
  open: true,
  host: true // Exposes dev server to local network (useful for testing on physical mobile phones)
}
```

If port 3000 is occupied by another process, Vite will attempt the next available port (e.g. 3001) or can be forced with:
```bash
npm run dev -- --port 3005
```

---

## 5. Common Troubleshooting Scenarios

### Port Conflict
**Symptom**: `Port 3000 is in use, trying another one...`
**Resolution**: Check active background processes or terminate the existing process occupying port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Corrupted Node Modules or Cache
**Symptom**: Unexplained TypeScript or bundling errors after switching branches.
**Resolution**: Clean Vite cache and re-install:
```bash
rm -rf node_modules/.vite dist
npm install
```

### Stale LocalStorage Data
**Symptom**: UI reflects old demo products or modified stock quantities from earlier testing.
**Resolution**: Open `/admin/settings` and click **Reset All Demo Data**, or run `localStorage.clear()` in the browser developer console.
