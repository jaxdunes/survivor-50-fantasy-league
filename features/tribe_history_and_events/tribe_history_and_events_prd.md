# Product Requirements Document (PRD): Dynamic Tribe History & Episode Event Timeline on Player Cards

**Version**: 1.0 (Specification for Review)  
**Status**: Pending Review  
**Location**: `features/tribe_history_and_events/tribe_history_and_events_prd.md`  
**Target Files**: `seasons/season-50.json`, `seasons/season-51.json`, `draft.html`, `index.html`, `js/config.js`  
**Git Branch**: `feature/tribe-history-and-events`

---

## 1. Overview & Core Objectives

In *Survivor*, contestants frequently swap tribes during tribe scrambles, mutinies, or when combining into the unified **Merge Tribe**. 

### Current Data Model Limitations:
Currently, the season JSON files (`season-50.json`, `season-51.json`) only store static scalar strings (`"tribe": "Toka"`, `"startingTribe": "Toka"`). This model does **not** track episode-by-episode tribe transitions or historical swaps.

### Core Objectives:
1. **Extend Contestant Data Model**:
   - Add a structured `tribeHistory` array to contestant objects to record starting tribes, mid-season tribe swaps, and merge tribe transitions by episode.
2. **Display Tribe Progression on Player Cards**:
   - Render a visual tribe progression timeline (e.g. `☀️ Toka ➔ 🟣 Savu ➔ 🟢 Coracol (Merge)`) on `PlayerCard` components (`draft.html`) and Leaderboard player detail modals (`index.html`).
3. **Episode-by-Episode Scoring & Event Timeline**:
   - Display a chronological timeline on each Player Card combining **Scoring Events** (e.g., *Won Immunity*, *Found Idol*) and **Tribe Events** (e.g., *Tribe Swap to Savu*, *Made Merge Tribe*), grouped under the exact episode in which they occurred.

---

## 2. Extended Data Model Schema

### 2.1 Contestant Schema (`tribeHistory`)

Every contestant object in `seasons/season-50.json` and `seasons/season-51.json` will be updated to include a `tribeHistory` array:

```json
{
  "id": 1,
  "name": "Aaliyah Puglia",
  "tribe": "Savu",
  "startingTribe": "Toka",
  "tribeHistory": [
    {
      "episode": 1,
      "tribe": "Toka",
      "type": "starting",
      "label": "Starting Tribe"
    },
    {
      "episode": 5,
      "tribe": "Savu",
      "type": "swap",
      "label": "Tribe Swap"
    },
    {
      "episode": 8,
      "tribe": "Coracol",
      "type": "merge",
      "label": "Merge Tribe"
    }
  ]
}
```

### 2.2 Helper Utility Functions (`js/config.js` or inline helpers)

- `getPlayerTribeAtEpisode(player, episodeNumber)`:
  - Iterates through `player.tribeHistory` up to `episodeNumber` and returns the player's active tribe for that specific episode.
- `getPlayerTribeProgression(player)`:
  - Returns an ordered list of unique tribe transitions for rendering visual badges on player cards.

---

## 3. UI Specifications for Player Cards (`draft.html` & `index.html`)

### 3.1 Tribe Progression Badge Row
On the header or subtitle of each `PlayerCard`:
- **Single Tribe (Unswapped)**: Shows starting tribe badge (e.g., `☀️ Toka`).
- **Swapped / Merged**: Shows a horizontal badge sequence connected by directional arrows:
  `☀️ Toka` ➔ `🟣 Savu` ➔ `🟢 Coracol (Merge)`

### 3.2 Episode-by-Episode Event & Scoring Timeline
Under each Player Card's main bio info, a dedicated **Episode History & Timeline** section will render:

```
─────────────────────────────────────────────────────────────
📜 EPISODE HISTORY & TIMELINE
─────────────────────────────────────────────────────────────
Episode 1:
  • ☀️ Assigned to Starting Tribe: Toka
  • 🏆 Won Tribal Immunity (+5 pts)
  • 🗣️ Confessional (+1 pt)

Episode 5:
  • 🔄 Tribe Swap: Transferred from Toka ➔ Savu Tribe

Episode 8:
  • 🏝️ Reached Merge: Joined Coracol Merge Tribe
  • 🛡️ Won Individual Immunity (+15 pts)
```

---

## 4. Implementation Plan Summary

1. **Update Data Files**:
   - Update `seasons/season-50.json` and `seasons/season-51.json` to include initial `tribeHistory` arrays.
2. **Update Helper Functions**:
   - Create helper functions to resolve historical tribe by episode and extract tribe swap events.
3. **Enhance `PlayerCard` in `draft.html` & `index.html`**:
   - Add Tribe Progression arrow badges to player card headers.
   - Add the Episode Event Timeline section to player card detail views.
4. **Empirical Verification**:
   - Run browser verification across `draft.html` and `index.html` to confirm tribe swap events and scoring events appear correctly under respective episodes.

---

## 5. Review & Approval

Please review this PRD and let me know if you approve this specification or if you'd like any modifications before we proceed with implementation!
