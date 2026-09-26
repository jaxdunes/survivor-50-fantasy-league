# Season 51 Starting Tribes & Multi-Select Scoring Walkthrough

## Feature Overview
The **Season 51 Starting Tribes** feature assigns all 21 castaways of *Survivor 51: Open Era* to their official starting tribes (**Toka**, **Savu**, and **Exile Island**), introduces dynamic season-aware tribe filtering, displays tribe swap & progression timelines on player cards, upgrades the points addition interface for tribe-wide batch selection, and resolves a critical Leaderboard rendering bug.

---

## Key Accomplishments

### 1. Official Season 51 Castaway Tribe Assignments
Updated [`seasons/season-51.json`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/seasons/season-51.json) to assign starting tribes and structured `tribeHistory` entries for all 21 castaways:

- **☀️ Toka Tribe (10 members)**:
  - Aaliyah Puglia, An “Thien An” Nguyen, Angelica “Jelly” Loblack, Brady Booker, Danny “Kilby” Kilby, Devin Way, Jenna Doore, Maggie Nestor, Mike Pinsky, Patt Cannaday.
- **🟣 Savu Tribe (10 members)**:
  - Alexis Levine, Ana Sani, Carter Krull, Cristian Chavez, Eric Macksoud, Kristin Flickinger, Linnea Capobianco, Ori Jean-Charles, Rob Antonson, Sharonda Cox.
- **🏝️ Exile Island (1 member)**:
  - Lewis Kelly.

```json
{
  "id": 1,
  "name": "Aaliyah Puglia",
  "startingTribe": "Toka",
  "tribe": "Toka",
  "tribeHistory": [
    { "episode": 1, "tribe": "Toka", "type": "starting", "label": "Starting Tribe: Toka" }
  ]
}
```

---

### 2. Dynamic Season-Aware Tribe Filtering (`draft.html`)
- Refactored the Tribe Filter dropdown in [`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html) to dynamically populate tribe options based on the active season:
  - **Season 51**: `All Tribes`, `☀️ Toka`, `🟣 Savu`, `🏝️ Exile Island`.
  - **Season 50**: `All Tribes`, `🔥 Cila`, `🌊 Kalo`, `⚡ Vatu`.
- Fixed text contrast CSS on `<option>` items (`text-gray-900 bg-white`) to eliminate dark/unreadable text inside native dropdown menus.

---

### 3. Tribe Badges & Progression Timelines (`index.html` & `draft.html`)
- Added custom visual themes for Season 51 tribes:
  - **Toka**: Warm amber/yellow gradient with sun icon `☀️`.
  - **Savu**: Deep purple gradient with purple orb icon `🟣`.
  - **Exile Island**: Slate/dark grey gradient with island icon `🏝️`.
- Displayed full tribe swap histories directly on contestant cards and scoring breakdown timelines (e.g. `☀️ Toka ➔ 🟣 Savu ➔ 🏝️ MERGE`).

---

### 4. Always-Active Multi-Player & Tribe Selection UI (`index.html`)
- Redesigned the "Add Points" scoring panel in [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html) so that remaining active players are always displayed in tribe-grouped boxes.
- Added one-click **Select Tribe** action buttons on each tribe section header to instantly toggle all active contestants on that tribe.
- Removed the old "Apply to multiple players" toggle checkbox in favor of an intuitive, always-visible grid view.

---

### 5. Leaderboard Expansion Bug Fix & React Error Boundary
- Fixed a visual bug on the Leaderboard where expanding team cards caused page contents to unmount.
- **Root Cause**:
  - Missing `getPlayerTribeProgression` reference inside `index.html` threw an uncaught `ReferenceError`.
  - Variadic child array spreading (`...map(...)`) inside `h(type, props, ...children)` triggered React fiber reconciliation failures on state changes.
- **Fix Applied**:
  - Exported `window.getPlayerTribeProgression` and `window.getPlayerEventsTimeline` in [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js).
  - Added a defensive `getPlayerTribeProgression` helper in [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html).
  - Replaced variadic `...map(...)` child spreading with direct array children and wrapped player name children in keyed spans (`h('span', { key: 'name' }, player.name)`).
  - Wrapped `<ScoringPage>` in a React `ErrorBoundary` component with a fallback error UI.

---

## Verification & Screenshots

| Page | Feature Verified | Result |
| :--- | :--- | :--- |
| **Draft Board (`draft.html`)** | Season 51 tribe filter dropdown (`Toka`, `Savu`, `Exile Island`) & player card badges | **PASS** |
| **Leaderboard (`index.html`)** | Team card expansion displaying player rosters, tribe badges, and scoring breakdowns without blanking | **PASS** |
| **Add Points Screen (`index.html`)** | Multi-player tribe selection grid & batch tribe toggle buttons | **PASS** |

---

## Summary of Modified Files

- [`seasons/season-51.json`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/seasons/season-51.json): Added starting tribes and tribe histories for 21 castaways.
- [`js/config.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/config.js): Exported global tribe progression timeline helpers.
- [`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html): Dynamic season tribe filter dropdown and card styling.
- [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html): Scoring UI redesign, tribe badges, error boundary, and leaderboard expansion fix.
- [`features/season_51_starting_tribes/season_51_starting_tribes_implementation_plan.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/features/season_51_starting_tribes/season_51_starting_tribes_implementation_plan.md): Recorded session bug log and troubleshooting history.
