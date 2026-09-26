# Implementation Plan - Season 51 Starting Tribe Assignment & Tribe Sorting

Assign all 21 castaways of *Survivor 51: Open Era* to their official starting tribes (**Toka**, **Savu**, and **Exile Island**) based on Wikipedia season data, and update tribe card badges and filtering controls in `draft.html` and `index.html`.

---

## User Review Required

> [!IMPORTANT]
> - **Branch Created**: Active feature branch [`feature/season-51-starting-tribes`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league).
> - **PRD Document**: Saved at [`features/season_51_starting_tribes/season_51_starting_tribes_prd.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/features/season_51_starting_tribes/season_51_starting_tribes_prd.md).

---

## Proposed Changes

### 1. Dataset (`seasons/season-51.json`)

#### [MODIFY] [`seasons/season-51.json`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/seasons/season-51.json)
- Update `tribe` and `startingTribe` for each contestant:
  - **Toka** (10 members): Aaliyah Puglia, An “Thien An” Nguyen, Angelica “Jelly” Loblack, Brady Booker, Danny “Kilby” Kilby, Devin Way, Jenna Doore, Maggie Nestor, Mike Pinsky, Patt Cannaday.
  - **Savu** (10 members): Alexis Levine, Ana Sani, Carter Krull, Cristian Chavez, Eric Macksoud, Kristin Flickinger, Linnea Capobianco, Ori Jean-Charles, Rob Antonson, Sharonda Cox.
  - **Exile Island** (1 member): Lewis Kelly.

---

### 2. UI & Filter Components (`draft.html` & `index.html`)

#### [MODIFY] [`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html) & [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)
- Update `getTribeColor` and `getTribeBadgeColor` helper functions to support Toka (yellow gradient/badge), Savu (purple gradient/badge), and Exile Island (slate gradient/badge).
- Update Tribe Filter dropdown in `draft.html` dynamically based on `activeSeasonId`:
  - Season 51: `All Tribes`, `☀️ Toka`, `🟣 Savu`, `🏝️ Exile Island`.
  - Season 50: `All Tribes`, `🔥 Cila`, `🌊 Kalo`, `⚡ Vatu`.

---

## Verification Plan

### Manual Verification
1. **Dataset Integrity**: Verify `seasons/season-51.json` valid JSON structure.
2. **Draftboard Filtering**:
   - Open `draft.html` for Season 51.
   - Filter by `Toka`: verify exactly 10 contestants display.
   - Filter by `Savu`: verify exactly 10 contestants display.
   - Filter by `Exile Island`: verify Lewis Kelly displays.
3. **Card Badges & Aesthetics**: Verify contestant card headers show Toka yellow gradient and Savu purple gradient.

---

## Session Bug Log & Troubleshooting History

### Bug 1: Incorrect Tribes in Dropdown & Dark Unreadable Option Text
- **Symptom**: In `draft.html`, the tribe filter dropdown hardcoded Season 50 tribes (`Cila`, `Kalo`, `Vatu`) when viewing Season 51. Additionally, text inside `<option>` dropdown elements was dark and unreadable due to conflicting background utility styles.
- **What Was Tried**:
  - Inspected `draft.html` dropdown rendering logic.
  - Checked active season state resolution from URL params (`?season=season-51`).
- **Fix**:
  - Refactored `draft.html` tribe dropdown to dynamically render active tribes based on `activeSeasonId` (`Toka`, `Savu`, `Exile Island` for Season 51; `Cila`, `Kalo`, `Vatu` for Season 50).
  - Explicitly styled option text with clean contrast colors (`text-gray-900 bg-white`).

### Bug 2: Missing Tribe Badges on Season 51 Player Cards & Points Addition Interface
- **Symptom**: Season 51 contestants displayed `Unassigned` on player cards and in the multi-player points addition grid in `index.html` and `draft.html`.
- **What Was Tried**:
  - Inspected `seasons/season-51.json` schema and player definitions.
  - Checked `playersByTribe` grouping logic in `index.html`.
- **Fix**:
  - Assigned all 21 castaways to official starting tribes (`Toka`, `Savu`, `Exile Island`) and initialized structured `tribeHistory` arrays in `seasons/season-51.json`.
  - Updated player card and badge helper functions (`getTribeBadgeColor`, `getTribeIcon`) to render Toka (`☀️ Toka`), Savu (`🟣 Savu`), and Exile Island (`🏝️ Exile Island`).

### Bug 3: Leaderboard Team Card Expansion Blanking the Page
- **Symptom**: On the Leaderboard (`index.html`), clicking to expand any person's team card (`#1 Jackson`, `#2 Ray`, etc.) caused all page elements to disappear, leaving an empty screen.
- **What Was Tried**:
  - Identified missing function `getPlayerTribeProgression` during render (`ReferenceError: getPlayerTribeProgression is not defined`).
  - Checked `playerById[playerId]` references that threw `ReferenceError` when `playerById` was undefined.
  - Wrapped `<ScoringPage>` in a React `ErrorBoundary` component and added a global `window.onerror` fallback banner.
  - Inspected child array spreading (`...map(...)`) in `h(type, props, ...children)` React element calls.
- **Fix**:
  - Exported `window.getPlayerTribeProgression` and `window.getPlayerEventsTimeline` to global `window` scope in `js/config.js`.
  - Added a defensive `getPlayerTribeProgression` helper in `index.html` inside `ScoringPage`.
  - Replaced variadic array child spreading (`...map(...)`) with direct array child passing (`leaderboard.map(...)`, `episodeStates.map(...)`, `Object.entries(playersByTribe).map(...)`).
  - Wrapped `player.name` in a keyed child span `h('span', { key: 'name' }, player.name)` inside player header badge arrays to satisfy React list key requirements.

