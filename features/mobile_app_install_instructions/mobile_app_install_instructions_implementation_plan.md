# Implementation Plan: Mobile App Installation Guide & Shareable Link

**Target Feature**: Mobile App Installation Guide & Shareable Link (App Name: "Fantasy Survivor", Repo Scope: "survivor-fantasy-league")  
**Location**: `features/mobile_app_install_instructions/mobile_app_install_instructions_implementation_plan.md`  
**Git Branch**: `feature/mobile-app-install-instructions`

---

## Proposed Changes

### Phase 0: Default App Title & Scope Configuration
Update default app title to **"Fantasy Survivor"** and URL scope to `/survivor-fantasy-league/`:

1. **`index.html`**:
   - Update `<meta name="apple-mobile-web-app-title" content="Fantasy Survivor">`
   - Update `<title>Fantasy Survivor League</title>`
   - Update `shareUrl`: `https://jaxdunes.github.io/survivor-fantasy-league/install.html`
   - Update step 2 URL: `jaxdunes.github.io/survivor-fantasy-league`
2. **`install.html`**:
   - Update `<meta name="apple-mobile-web-app-title" content="Fantasy Survivor">`
   - Update `<title>Install Fantasy Survivor App</title>`
   - Update `shareUrl`: `https://jaxdunes.github.io/survivor-fantasy-league/install.html`
   - Update step 2 URL: `jaxdunes.github.io/survivor-fantasy-league`
3. **`manifest.json`**:
   - Update `"name": "Fantasy Survivor"`
   - Update `"short_name": "Fantasy Survivor"`
   - Update `"start_url": "/survivor-fantasy-league/"`
   - Update `"scope": "/survivor-fantasy-league/"`

---

### Phase 1: Side Menu Button & Install Modal (`index.html`)

#### 1. Add `showInstallModal` React State
- In `index.html` `App` component, declare:
  ```javascript
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  ```

#### 2. Auto-Open on Query/Hash Parameter
- In a `useEffect` hook, check `window.location.search` or `window.location.hash`:
  ```javascript
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('install') === 'true' || window.location.hash === '#install') {
          setShowInstallModal(true);
      }
  }, []);
  ```

#### 3. Add Button to Leagues Side Menu Footer
- In the `aside` footer panel of `index.html`:
  ```javascript
  h('button', {
      onClick: () => setShowInstallModal(true),
      className: 'w-full py-2.5 px-3 mb-3 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 rounded-xl text-xs font-bold text-orange-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm group'
  },
      h('span', { className: 'text-base group-hover:scale-110 transition-transform' }, '📱'),
      h('span', {}, 'Want This As A Mobile App?')
  )
  ```

#### 4. Add `InstallAppModal` Component
- Create a clean modal component displaying the 5 steps:
  1. Open Safari (must be Safari!)
  2. Go to: `jaxdunes.github.io/survivor-fantasy-league`
  3. Tap Share button (`⬆️`) $\rightarrow$ "Add to Home Screen" $\rightarrow$ Default name is "Fantasy Survivor", click "Add"
  4. Open the app from your home screen
  5. Go to Notifications $\rightarrow$ Enable Notifications $\rightarrow$ Allow
- Include a `"Copy Shareable Link"` button that copies `https://jaxdunes.github.io/survivor-fantasy-league/install.html` to clipboard.

---

### Phase 2: Update Standalone Page (`install.html`)

Update `install.html` to match the exact 5-step sequence with styled Tailwind cards, tip boxes, default title "Fantasy Survivor", and a `"Copy Shareable Link"` button targeting `https://jaxdunes.github.io/survivor-fantasy-league/install.html`.

---

## Verification Plan

### Automated & Manual Verification Steps

1. **App Title & Scope Check**:
   - Inspect `apple-mobile-web-app-title` in `index.html` and `start_url`/`scope` in `manifest.json`.
   - Confirm pre-filled value is `"Fantasy Survivor"` and `/survivor-fantasy-league/`.

2. **Side Menu Button Test**:
   - Open `index.html` in browser.
   - Click floating `Leagues` side menu button.
   - Confirm `"Want This As A Mobile App?"` button appears at the bottom of the drawer.

3. **Modal Test**:
   - Click `"Want This As A Mobile App?"`.
   - Verify modal opens with dark backdrop and 5 step cards.
   - Click `"Copy Shareable Link"` and verify toast states link copied (`https://jaxdunes.github.io/survivor-fantasy-league/install.html`).

4. **Standalone Page Test**:
   - Open `install.html` directly in browser (`http://localhost:8085/install.html`).
   - Confirm all 5 steps render clearly.

5. **Auto-Open Parameter Test**:
   - Navigate to `http://localhost:8085/index.html?install=true`.
   - Confirm modal opens automatically.
