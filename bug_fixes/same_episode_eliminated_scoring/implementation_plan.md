# Implementation Plan: Same-Episode Elimination Scoring & Category Specificity Bug Fix

Update `index.html` to ensure eliminated contestants remain selectable when scoring the episode in which they were voted out, and restrict `eliminationOrder` triggers to primary elimination categories.

---

## Proposed Changes

### 1. Score Submission Logic (`index.html`)

#### [MODIFY] [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)
- Update `isElimination` boolean calculation inside score submission handler (around line 1857):
  ```javascript
  const isElimination = (categoryId === 'voted-out' || categoryId === 'medevac' || categoryId === 'expelled' || (catName.includes('voted out') && !catName.includes('first voted out'))) && categoryId !== 'first-voted-out';
  ```
- Exclude `first-voted-out` / "First Voted Out" from setting `eliminationOrder`.

---

### 2. "Add Points" Player Eligibility Grid (`index.html`)

#### [MODIFY] [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)
- Derive `selectedEpNum = parseInt(lastSelectedEpisode) || 1`.
- Update player selection grid in `playersByTribe` mapping:
  - Filter `tPlayers` into `eligibleTribePlayers`:
    ```javascript
    const eligibleTribePlayers = tPlayers.filter(p => {
        const pElimEp = eliminationOrder[p.id] ? parseInt(eliminationOrder[p.id]) : null;
        return pElimEp === null || pElimEp >= selectedEpNum;
    });
    ```
  - Contestants eliminated BEFORE `selectedEpNum` (`pElimEp < selectedEpNum`) are **completely omitted** from the Add Points screen.
  - Contestants eliminated IN `selectedEpNum` (`pElimEp === selectedEpNum`) render with a `💀 EP E OUT` badge, but remain active & selectable for multiple point entries in Episode E.
  - Update `toggleTribeSelected` to target `eligibleTribePlayers`.

---

## Verification Plan

### Automated & Manual Browser Verification
1. **Category Trigger Verification**:
   - Assign "First Voted Out" penalty (-10 pts) to a player. Verify `eliminationOrder` remains unchanged.
   - Assign "Voted Out" event to a player in Episode 1. Verify `eliminationOrder[player.id] = 1`.
2. **Same-Episode Eligibility Verification**:
   - Select Episode 1 in the "Add Points" modal.
   - Verify the contestant voted out in Episode 1 remains **active, visible, and selectable**.
   - Assign a second scoring event (e.g., "First Voted Out" or confessionals) to that player. Verify the event saves cleanly.
3. **Subsequent-Episode Complete Omission Verification**:
   - Select Episode 2 in the "Add Points" modal.
   - Verify the contestant voted out in Episode 1 is **completely hidden/omitted** from the grid and does not appear on screen.
