# Implementation Plan - Tribal Council Theme for Points Adding Screen

Fix the text legibility bug and implement Tribal Council theming for the Points Adding Screen (`Add Points` modal) and related scoring modals when Torchlight/Tribal Council Mode is toggled ON.

## User Review Required

> [!IMPORTANT]
> **Issue Identified:** When Tribal Council Theme is toggled on, global styles turn heading and label text into light cream/amber colors (`#eeded1`, `#fef3c7`). However, the `.modal-content` card retains a light/white background (`#ffffff`), causing text to become virtually unreadable due to severe low contrast.

No breaking changes or API schema modifications are required. The changes purely improve CSS theming, contrast, and component styling for the Add Points and Rules modals when Tribal Council mode is enabled.

## Proposed Changes

### Leaderboard & Points UI (`index.html`)

#### [MODIFY] [index.html](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)

- **Modal Backdrop & Container Styling (`body.theme-tribal .modal-content` & `modal-backdrop`):**
  - Add dark blur backdrop for modal overlays in Tribal Council mode.
  - Style `.modal-content` in Tribal Council mode with an atmospheric dark wood/torchlight background (`rgba(26, 18, 13, 0.96)`), warm amber border (`rgba(217, 119, 6, 0.4)`), and torch glow shadow (`box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2)`).

- **Form Input & Select Legibility (`body.theme-tribal .modal-content input`, `select`, `option`):**
  - Style all form inputs (`#player-select`, `#episode-select`, `#category-select`, `#points-input`, `#note-input`, search input) with warm dark input backgrounds (`rgba(40, 28, 20, 0.85)`), crisp amber text (`#fef3c7`), and dark option dropdown styling (`#1a120d`).
  - Add glowing warm orange focus rings and readable placeholder styling (`#a18a7a`).

- **Multi-League Selection Container & Chips:**
  - Style the multi-league selection container with warm dark amber background (`rgba(45, 30, 20, 0.85)`).
  - Provide high-contrast styling for both selected league badges (orange/amber gradient with white text) and unselected league chips (dark wood fill with warm text).

- **Category Search Results Dropdown:**
  - Style the category search result container with a dark wood background and subtle warm border.
  - Fix category item button states and point badges for high readability against dark backgrounds.

- **Scoring Rules Modal (`showRules`):**
  - Ensure the rules search bar, rule category sections, and rule list items seamlessly reflect the Tribal Council theme with crisp text and distinct point badges.

## Verification Plan

### Manual & Visual Verification
1. Run local preview server (`python3 -m http.server 8085`).
2. Test **Classic Mode**:
   - Open Add Points modal. Confirm text contrast and styling remain clean in Classic Mode.
3. Test **Tribal Council Mode**:
   - Toggle Tribal Council Theme ON.
   - Open Add Points modal (`➕ ADD POINTS`).
   - Verify modal background is warm dark wood with torch glow.
   - Verify all labels, input fields, dropdown select options, category search results, and buttons are crisp and 100% legible.
4. Capture screenshots of fixed Add Points modal in Tribal Council Theme to verify visual excellence.
