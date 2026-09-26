# Implementation Plan: Backfilled Player Points Episode Scoping Fix

Update `index.html`, `draft.html`, and `js/config.js` to ensure backfilled contestants only contribute points to their assigned fantasy team from the episode they were backfilled onward.

---

## Proposed Changes

### 1. Backfill Metadata Engine (`index.html`)

#### [MODIFY] [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)
- Update Auto-Backfill Engine inside score submission handler (around line 1900):
  ```javascript
  ds.backfilledPlayers = ds.backfilledPlayers || {};
  ds.backfilledPlayers[backfillP.id] = {
      episode: parseInt(episode),
      replacedPlayerId: playerId,
      timestamp: Date.now()
  };
  ```

---

### 2. Team Score Calculation (`index.html` & `draft.html`)

#### [MODIFY] [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html) & [`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html)
- Create `getBackfillEpisode(playerId, draftState)` helper to resolve `backfillEp`:
  ```javascript
  const getBackfillEpisode = (playerId, draftState) => {
      if (!draftState || !draftState.backfilledPlayers) return null;
      const bf = draftState.backfilledPlayers[playerId];
      if (!bf) return null;
      if (typeof bf === 'number') return bf;
      if (typeof bf === 'object' && bf.episode) return parseInt(bf.episode);
      return 1; // Default fallback for legacy boolean true
  };
  ```
- Update `getTeamScore(teamId)` in `index.html`:
  - When calculating points for `player`:
    ```javascript
    const bfEp = getBackfillEpisode(player.id, draftState);
    Object.keys(playerScores).forEach(ep => {
        const epNum = parseInt(ep);
        // Exclude scores if earned prior to or in backfill episode
        if (bfEp !== null && epNum <= bfEp) return;
        
        const episodeScores = playerScores[ep] || {};
        Object.values(episodeScores).forEach(score => {
            total += (score.points || 0);
        });
    });
    ```
- Update `TeamScoreGraph` trajectory calculations in `index.html` to exclude pre-backfill points per episode.
- Update `getPlayerScore(playerId)` and expanded roster breakdown items to clearly distinguish points contributed to the fantasy team vs pre-backfill points.

---

## Verification Plan

### Manual Browser Verification
1. **Auto-Backfill Data Verification**:
   - Finalize draft on `draft.html`.
   - On `index.html`, select Episode 1 and submit elimination for a drafted player.
   - Verify `draftState.backfilledPlayers` records `{ episode: 1, ... }`.
2. **Pre-Backfill Point Exclusion Test**:
   - Assign points (+5 pts) to an unassigned player in Episode 1.
   - Trigger backfill for that player in Episode 1.
   - Verify team score DOES NOT include the 5 points from Episode 1.
3. **Post-Backfill Point Inclusion Test**:
   - Select Episode 2 and assign points (+10 pts) to the backfilled player.
   - Verify team score INCREASES by 10 points for Episode 2.
