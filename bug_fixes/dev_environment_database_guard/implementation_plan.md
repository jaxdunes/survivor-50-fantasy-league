# Implementation Plan: Local Dev Firebase Environment Isolation Guard

Wrap `database.ref` inside `js/config.js` to automatically isolate all Firebase Realtime Database read/write calls to a `dev_testing/` namespace during local development.

---

## Proposed Changes

### 1. Firebase Reference Interceptor (`js/config.js`)

#### [MODIFY] [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js)
- Add hostname detection:
  ```javascript
  const IS_DEV_ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  ```
- Wrap `database.ref` method immediately after database initialization:
  ```javascript
  if (IS_DEV_ENV && database && typeof database.ref === 'function') {
      const origRef = database.ref.bind(database);
      database.ref = function(path) {
          if (path === undefined || path === null || path === '') return origRef('dev_testing');
          const strPath = String(path);
          const cleanPath = strPath.startsWith('/') ? strPath.slice(1) : strPath;
          if (cleanPath.startsWith('dev_testing')) {
              return origRef(cleanPath);
          }
          return origRef(`dev_testing/${cleanPath}`);
      };
      console.log('🧪 LOCAL DEV ENVIRONMENT: Firebase database.ref wrapped under "dev_testing/" namespace.');
  }
  ```

---

### 2. Dev Mode Visual Indicator Banner (`index.html` & `draft.html`)

#### [MODIFY] [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js)
- Add an automatic DOM banner injection when `IS_DEV_ENV` is true:
  ```javascript
  if (IS_DEV_ENV && typeof document !== 'undefined') {
      window.addEventListener('DOMContentLoaded', () => {
          const banner = document.createElement('div');
          banner.id = 'dev-env-indicator';
          banner.style.cssText = 'position:fixed;bottom:10px;right:10px;z-index:99999;background:#0f172a;color:#38bdf8;padding:6px 12px;border-radius:20px;font-family:monospace;font-size:11px;font-weight:bold;border:1px solid #0284c7;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);pointer-events:none;';
          banner.innerHTML = '🧪 DEV MODE: Data isolated to <code>dev_testing/</code>';
          document.body.appendChild(banner);
      });
  }
  ```

---

## Verification Plan

1. **Local Test Submission**:
   - Open `http://localhost:8085/index.html?league=jackson-ryan-league&season=season-51`.
   - Submit a test score or elimination event.
   - Confirm in browser console and network log that database writes target `dev_testing/leagues/...`.
2. **Production Domain Simulation**:
   - Verify logic with simulated non-localhost hostname to ensure production builds bypass `dev_testing/` wrapping.
