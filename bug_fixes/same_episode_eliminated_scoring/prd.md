# Product Requirements Document (PRD): Same-Episode Scoring & Elimination Category Bug Fix

**Version**: 1.0  
**Status**: Specified for Implementation  
**Location**: `bug_fixes/same_episode_eliminated_scoring/prd.md`  
**Target Files**: `index.html`, `draft.html`, `js/config.js`  
**Git Branch**: `bugfix/same-episode-eliminated-scoring`

---

## 1. Problem Statement & Root Cause

### Problem Overview
In *Survivor*, when a contestant is voted out first in Episode 1, they often receive **multiple scoring events** during that same episode:
1. **Primary Elimination Event**: `"Voted Out"` (records elimination in `eliminationOrder`).
2. **First Boot Penalty Event**: `"First Voted Out"` (-10 point bonus/penalty).
3. **Episode Performance Events**: Confessionals, challenge wins, idol plays, etc.

### Current Defect Behavior
1. **False Elimination Trigger**: Currently in `index.html`, receiving either `"Voted Out"` or `"First Voted Out"` triggers `isElimination = true`, which prematurely writes the player into `eliminationOrder`.
2. **Immediate Lockout in Same Episode**: Once a player is marked as eliminated in `eliminationOrder` (e.g. `eliminationOrder[player.id] = 1`), the "Add Points" screen immediately marks the player as `isEliminated = true` and disables their selection button across all screens.
3. **Consequence**: An administrator cannot assign the second scoring event (e.g., adding "-10 points for First Voted Out" or additional confessionals) because the contestant's button becomes permanently disabled the moment the first elimination event is saved.

---

## 2. Feature Objectives & Requirements

### Requirement 1: Specificity of Elimination Trigger
- **Primary Elimination Category Only**: `isElimination` MUST only be triggered by primary elimination categories: `"voted-out"`, `"medevac"`, `"expelled"`, or category names containing `"voted out"` (excluding `"first voted out"`).
- **Exclude Auxiliary Penalties**: Scoring categories like `"first-voted-out"` ("First Voted Out") are point penalty modifiers, NOT primary elimination triggers, and MUST NOT set `eliminationOrder`.

### Requirement 2: Episode-Aware Player Eligibility Filtering
Player selection eligibility on the "Add Points" screen MUST be evaluated relative to the currently selected episode (`selectedEpisode`):

- **Rule A (Same-Episode Availability)**:
  - If a player was eliminated in **Episode E** (`eliminationOrder[playerId] === E`), they **MUST REMAIN ACTIVE AND SELECTABLE** when **Episode E** is selected in the "Choose Episode" dropdown.
  - This allows admins to add multiple scoring events for that contestant during the episode in which they were voted out.

- **Rule B (Subsequent-Episode Complete Omission)**:
  - If an episode is selected that occurs after a player's elimination (`eliminationOrder[playerId] < selectedEpisode`), that player **MUST NOT BE SHOWN AT ALL** on the "Add Points" screen. Only eligible players for the selected episode are displayed.

#### Eligibility & Visibility Matrix Example:
| Selected Episode | Player A (Eliminated Ep 1) | Player B (Eliminated Ep 2) | Player C (Active) |
| :--- | :--- | :--- | :--- |
| **Episode 1** | **Active & Visible (`💀 EP 1 OUT`)** | Active & Visible | Active & Visible |
| **Episode 2** | *Hidden (Omitted from view)* | **Active & Visible (`💀 EP 2 OUT`)** | Active & Visible |
| **Episode 3** | *Hidden (Omitted from view)* | *Hidden (Omitted from view)* | Active & Visible |

---

## 3. Component & UI Specifications (`index.html`)

### 3.1 "Add Points" Player Selection Grid
- **Dynamic Eligibility & Filtering Logic**:
  ```javascript
  const selectedEpNum = parseInt(lastSelectedEpisode) || 1;
  const eligibleTribePlayers = tPlayers.filter(player => {
      const playerElimEp = eliminationOrder[player.id] ? parseInt(eliminationOrder[player.id]) : null;
      return playerElimEp === null || playerElimEp >= selectedEpNum;
  });
  ```
- **Rendering & Badging**:
  - Only players in `eligibleTribePlayers` are rendered in the grid.
  - If `playerElimEp === selectedEpNum`, render a `💀 EP E OUT` badge on their button, keeping the button active & clickable for any additional Episode E point entries.
  - Players eliminated before `selectedEpNum` are omitted completely.

### 3.2 Tribe Bulk Selection (`toggleTribeSelected`)
- Bulk selecting a tribe for Episode E targets `eligibleTribePlayers` (`!eliminationOrder[p.id] || parseInt(eliminationOrder[p.id]) >= selectedEpNum`).

---

## 4. Verification Plan

1. **Category Trigger Test**:
   - Assign "First Voted Out" penalty (-10 pts) to a player. Verify `eliminationOrder` is NOT mutated.
   - Assign "Voted Out" event to a player in Episode 1. Verify `eliminationOrder[player.id] = 1` is written.
2. **Same-Episode Eligibility Test**:
   - Select Episode 1 in the "Add Points" modal.
   - Verify the contestant voted out in Episode 1 remains **active, visible, and selectable**.
   - Assign a second scoring event (e.g. "First Voted Out" or confessionals) to that player. Verify the event saves successfully.
3. **Subsequent-Episode Omission Test**:
   - Select Episode 2 in the "Add Points" modal.
   - Verify the contestant voted out in Episode 1 is **completely hidden/omitted** from the grid and does not appear on screen.
