# Walkthrough: Local Dev Firebase Environment Isolation Guard

## Overview
This feature introduces an automated **Environment Guard** in [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js) that isolates all Firebase Realtime Database read/write operations performed during local development (`localhost` / `127.0.0.1`) under a separate `dev_testing/` namespace. This guarantees that test data, mock scores, and test eliminations created while developing locally **never corrupt live production data**.

---

## Key Changes Implemented

### 1. Automated `database.ref` Namespace Interceptor (`js/config.js`)
- Added hostname environment detection:
  ```javascript
  const IS_DEV_ENV = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  ```
- Wrapped `database.ref(path)` inside `initFirebase()`:
  - **Local Development**: Prepend `dev_testing/` to every database reference path (e.g. `database.ref('leagues/jackson-ryan-league')` targets `dev_testing/leagues/jackson-ryan-league`).
  - **Production Deployment**: Passes straight through to production root paths (`leagues/...`).

```javascript
function wrapDatabaseInstance(db) {
    if (!db || db._isDevWrapped) return db;
    if (IS_DEV_ENV && typeof db.ref === 'function') {
        const origRef = db.ref.bind(db);
        db.ref = function(path) {
            if (path === undefined || path === null || path === '') return origRef('dev_testing');
            const strPath = String(path);
            const cleanPath = strPath.startsWith('/') ? strPath.slice(1) : strPath;
            if (cleanPath.startsWith('dev_testing')) return origRef(cleanPath);
            return origRef(`dev_testing/${cleanPath}`);
        };
        db._isDevWrapped = true;
    }
    return db;
}
```

---

### 2. Dev Mode Visual Status Badge (`js/config.js`)
- Automatically injects a subtle status badge in the bottom-right corner when running locally:
  - Text: `🧪 DEV MODE | Firebase Path: dev_testing/`

---

## Verification Summary

| Check | Environment | Expected Behavior | Status |
| :--- | :--- | :--- | :--- |
| **Local Write Path** | `localhost` | Writes target `dev_testing/leagues/...` | **PASS** |
| **Production Write Path** | Production Domain | Writes target `leagues/...` | **PASS** |
| **Dev Mode Indicator** | `localhost` | Bottom-right status badge renders | **PASS** |

---

## Files Modified

- [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js): Added `IS_DEV_ENV` check, `database.ref` wrapper function, and DOM indicator badge.
- [`bug_fixes/dev_environment_database_guard/prd.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/bug_fixes/dev_environment_database_guard/prd.md): Product requirements document.
- [`bug_fixes/dev_environment_database_guard/implementation_plan.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/bug_fixes/dev_environment_database_guard/implementation_plan.md): Technical implementation plan.
