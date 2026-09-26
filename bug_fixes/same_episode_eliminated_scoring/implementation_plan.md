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
- Update player card button filtering in `playersByTribe` mapping (around line 1689 & line 1713):
  - Change active tribe player filter:
    ```javascript
    const activeTribePlayers = tPlayers.filter(p => !eliminationOrder[p.id] || parseInt(eliminationOrder[p.id]) >= selectedEpNum);
    ```
  - Change player disabled check:
    ```javascript
    const playerElimEp = eliminationOrder[player.id] ? parseInt(eliminationOrder[player.id]) : null;
    const isEliminatedForSelectedEp = playerElimEp !== null && playerElimEp < selectedEpNum;
    const isEliminatedThisEp = playerElimEp !== null && playerElimEp === selectedEpNum;
    ```
  - Set button `disabled: isEliminatedForSelectedEp`.
  - Update `toggleTribeSelected` to target players where `!eliminationOrder[p.id] || parseInt(eliminationOrder[p.id]) >= selectedEpNum`.
  - Add visual indicator badge `💀 Voted Out Ep E` for players eliminated in the selected episode while keeping them active and selectable.

---

## Verification Plan

### Automated & Manual Browser Verification
1. **Category Trigger Verification**:
   - Assign "First Voted Out" penalty (-10 pts) to a player. Verify `eliminationOrder` remains unchanged.
   - Assign "Voted Out" event to a player in Episode 1. Verify `eliminationOrder[player.id] = 1`.
2. **Episode 1 Scoring Multi-Event Verification**:
   - Select Episode 1 in the "Add Points" modal.
   - Verify the contestant voted out in Episode 1 remains **active and selectable**.
   - Assign a second scoring event (e.g., "First Voted Out" or confessionals) to that player. Verify the event saves cleanly.
3. **Episode 2 Subsequent-Episode Lockout Verification**:
   - Select Episode 2 in the "Add Points" modal.
   - Verify the contestant voted out in Episode 1 is now **disabled / filtered out**.
