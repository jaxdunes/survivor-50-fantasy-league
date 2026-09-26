# Product Requirements Document (PRD): Local Dev Firebase Environment Isolation Guard

**Version**: 1.0  
**Status**: Specified for Implementation  
**Location**: `bug_fixes/dev_environment_database_guard/prd.md`  
**Target Files**: `js/config.js`, `index.html`, `draft.html`  
**Git Branch**: `bugfix/dev-environment-database-guard`

---

## 1. Executive Summary & Core Objective

### Problem:
Currently, both local development (`http://localhost:8085`) and the live production website share the exact same Firebase Realtime Database project credentials (`survivorfantasy-cc908`) and database paths (`leagues/jackson-ryan-league/...`). Any test scoring events, eliminations, or mock data created locally on `localhost` write directly to production database nodes, corrupting live fantasy league data for real users.

### Solution:
Implement an **Automatic Environment Guard** in [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js) that detects local development hostnames (`localhost`, `127.0.0.1`). When running locally, all Firebase `database.ref(path)` reads and writes are automatically prefixed with a `dev_testing/` namespace wrapper, preventing local test actions from ever touching production data nodes.

---

## 2. Core Functional Requirements

### Requirement 1: Hostname Environment Detection
- Detect local development environment automatically:
  ```javascript
  const IS_DEV_ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  ```

### Requirement 2: Automatic Firebase Path Namespacing (`database.ref`)
- Intercept and wrap `database.ref(path)` in [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js):
  - **On `localhost` / `127.0.0.1`**: Automatically prepend `dev_testing/` to every database reference path (e.g. `database.ref('leagues/jackson-ryan-league')` resolves to `database.ref('dev_testing/leagues/jackson-ryan-league')`).
  - **On Production Domain (GitHub Pages / Custom Domain)**: `database.ref(path)` passes straight through unchanged to live production paths (`leagues/...`).

### Requirement 3: Dev Mode Visual Indicator Banner
- Display a small, non-intrusive sticky status bar at the top of the viewport when running in local dev mode (`IS_DEV_ENV = true`):
  - Text: `🧪 LOCAL DEV MODE: Firebase writes isolated to 'dev_testing/' namespace`
  - Style: Dark slate background with emerald/cyan accent badge.

---

## 3. Architecture & Technical Flow

```
                               ┌─────────────────────────────┐
                               │     Client Invokes          │
                               │  database.ref('leagues/..') │
                               └──────────────┬──────────────┘
                                              │
                                     IS_DEV_ENV Check
                                       /             \
                                      /               \
                             (true - localhost)     (false - prod)
                                    /                   \
                                   v                     v
                 ┌──────────────────────────┐   ┌──────────────────────────┐
                 │ Prepend 'dev_testing/'   │   │ Direct Production Path   │
                 │ dev_testing/leagues/...  │   │ leagues/...              │
                 └──────────────────────────┘   └──────────────────────────┘
```

---

## 4. Verification Plan

1. **Local Dev Path Inspection**:
   - Run site on `http://localhost:8085`.
   - Submit a test score or elimination on `index.html`.
   - Inspect Firebase console or logs to verify write occurred under `dev_testing/leagues/jackson-ryan-league/...`.
2. **Production Path Safety Verification**:
   - Verify that root production nodes (`leagues/jackson-ryan-league/...`) are untouched.
3. **Local Persistence Verification**:
   - Refresh local page: verify local test scores render cleanly from `dev_testing/` namespace.
