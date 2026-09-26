# Walkthrough: Same-Episode Elimination Scoring & Category Specificity Bug Fix

## Feature / Bug Overview
This bug fix addresses a flaw where contestants eliminated in Episode 1 could not receive multiple Episode 1 scoring events (such as the primary `"Voted Out"` event followed by the `"First Voted Out"` -10 point penalty event) because saving the first event immediately locked out the contestant across all episode views. Additionally, auxiliary penalty categories like `"First Voted Out"` were incorrectly triggering elimination state writes.

---

## Key Changes Implemented

### 1. Primary Elimination Category Restriction (`index.html`)
- Updated the `isElimination` boolean in score submission logic:
  - Restricted elimination trigger writes to primary elimination categories (`"voted-out"`, `"medevac"`, `"expelled"`, `"voted out"`).
  - Explicitly excluded auxiliary penalty categories (`"first-voted-out"` / `"first voted out"`).

```javascript
const isElimination = (
    categoryId === 'voted-out' || 
    categoryId === 'medevac' || 
    categoryId === 'expelled' || 
    (catName.includes('voted out') && !catName.includes('first voted out'))
) && categoryId !== 'first-voted-out';
```

---

### 2. Episode-Aware Player Selection Eligibility Grid (`index.html`)
- Derived `selectedEpNum` from `lastSelectedEpisode`.
- Updated player button status and bulk tribe selection logic so player eligibility is relative to the selected episode:
  - **Same-Episode Rule**: If `playerElimEp === selectedEpNum`, the player displays a red `💀 EP E OUT` badge, BUT remains **fully active and selectable** when Episode E is selected in the dropdown.
  - **Subsequent-Episode Rule**: A player is disabled/grayed out ONLY if `playerElimEp < selectedEpNum` (eliminated in a prior episode).

```javascript
const selectedEpNum = parseInt(lastSelectedEpisode) || 1;
const playerElimEp = eliminationOrder[player.id] ? parseInt(eliminationOrder[player.id]) : null;
const isEliminatedForSelectedEp = playerElimEp !== null && playerElimEp < selectedEpNum;
const isEliminatedThisEp = playerElimEp !== null && playerElimEp === selectedEpNum;
```

---

## Summary of Modified Files

- [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html): Updated `isElimination` check, `toggleTribeSelected`, and player selection button grid.
- [`bug_fixes/same_episode_eliminated_scoring/prd.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/bug_fixes/same_episode_eliminated_scoring/prd.md): Product requirements document for this bug fix.
- [`bug_fixes/same_episode_eliminated_scoring/implementation_plan.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/bug_fixes/same_episode_eliminated_scoring/implementation_plan.md): Technical implementation plan.
