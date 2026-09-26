# Product Requirements Document (PRD): Backfilled Player Points Episode Scoping Fix

**Version**: 1.0  
**Status**: Specified for Implementation  
**Location**: `bug_fixes/backfilled_player_points_scoping/prd.md`  
**Target Files**: `index.html`, `draft.html`, `js/config.js`  
**Git Branch**: `bugfix/backfilled-player-points-scoping`

---

## 1. Problem Statement & Root Cause

### Problem Overview:
In fantasy *Survivor*, when a drafted contestant is eliminated (e.g. in Episode 1), the post-draft **Auto-Backfill Engine** assigns an unassigned contestant (e.g., Lewis Kelly) to the affected fantasy team to replace the eliminated player.

### Current Defect Behavior:
Currently, when calculating team scores (`getTeamScore` in `index.html` and `draft.html`), the fantasy team receives **ALL** points earned by the backfilled player, including points earned in episodes **prior to** when the backfill occurred (e.g., Episode 1 points earned while the backfilled player was unassigned).

### Expected Correct Behavior:
A fantasy team owner should **ONLY** receive points earned by a backfilled contestant **from the episode they were backfilled onward**. Points earned by the contestant prior to being backfilled belong to no fantasy team and MUST NOT be added to the team's total score.

---

## 2. Technical Specifications & Business Rules

### 1. Backfill Metadata Tracking (`draftState.backfilledPlayers`)
When the Auto-Backfill Engine replaces an eliminated contestant during score submission (in Episode `E_elim`):
- Store the episode number in `draftState.backfilledPlayers[backfilledPlayerId]`:
  ```json
  "backfilledPlayers": {
    "14": {
      "episode": 1,
      "replacedPlayerId": 5,
      "timestamp": 1727334000000
    }
  }
  ```
- Support numeric primitives for lightweight tracking (`"14": 1`).
- Provide fallback compatibility for legacy boolean entries (`"14": true` defaults to backfill episode 1).

### 2. Team Score Calculation Rule (`getTeamScore`)
When calculating a fantasy team's total score:
- For a standard (drafted) player: Include points for all episodes (`ep 1..N`).
- For a **backfilled player**:
  - Determine `backfillEpisode` (`E_backfill`).
  - **Include points ONLY for episodes where `episodeNumber > E_backfill`** (i.e. episodes occurring after the backfill episode).
  - Points earned in `episodeNumber <= E_backfill` (before being added to the team) are **excluded** from the fantasy team's total.

#### Example Scenario:
1. **Episode 1**: Player 14 (Lewis Kelly) is unassigned and earns **+5 pts**.
2. **Episode 1**: Team "Jackson"'s player is eliminated in Episode 1. Player 14 is backfilled onto Team "Jackson" after Episode 1 (`backfillEpisode = 1`).
3. **Episode 2**: Player 14 earns **+10 pts** on Team "Jackson".
4. **Scoring Outcome**:
   - Team "Jackson" receives **+10 pts** from Player 14 for Episode 2.
   - Team "Jackson" receives **0 pts** from Player 14 for Episode 1 (because Ep 1 <= backfillEpisode 1).

### 3. Leaderboard Trajectory Graph (`TeamScoreGraph`)
- In `TeamScoreGraph` (`index.html`), backfilled players' cumulative points must only accumulate into the team's weekly trajectory for episodes `ep > E_backfill`.

### 4. Player Breakdown & Visual Badging
- On expanded team roster cards (`index.html` & `draft.html`):
  - Display `↩️ BACKFILLED (EP E)` badge indicating when the player joined the team.
  - Distinguish points earned prior to backfill in score breakdown lists (e.g. `(Pre-backfill: 0 pts for team)`).

---

## 3. Component & UI Specifications

### 3.1 Firebase Auto-Backfill Update (`index.html` & `draft.html`)
```javascript
ds.backfilledPlayers = ds.backfilledPlayers || {};
ds.backfilledPlayers[backfillP.id] = {
    episode: parseInt(episode),
    replacedPlayerId: playerId,
    timestamp: Date.now()
};
```

### 3.2 Eligibility Helper Function (`js/config.js` or `index.html`)
```javascript
function isScoreEligibleForTeam(playerId, episodeNum, draftState) {
    if (!draftState || !draftState.backfilledPlayers) return true;
    const bfData = draftState.backfilledPlayers[playerId];
    if (!bfData) return true; // Standard drafted player
    
    const backfillEp = typeof bfData === 'number' ? bfData : (typeof bfData === 'object' && bfData.episode ? parseInt(bfData.episode) : 1);
    return parseInt(episodeNum) > backfillEp;
}
```

---

## 4. Verification & Testing Plan

1. **Auto-Backfill Data Verification**:
   - Finalize draft. Submit elimination score for Episode 1.
   - Verify `draftState.backfilledPlayers[backfillPlayerId]` records `{ episode: 1, ... }`.
2. **Pre-Backfill Point Exclusion Test**:
   - Add a scoring event (+5 pts) for Player 14 in Episode 1.
   - Backfill Player 14 onto Team "Jackson" after Episode 1.
   - Verify Team "Jackson"'s score DOES NOT increase by 5 points for Episode 1.
3. **Post-Backfill Point Inclusion Test**:
   - Add a scoring event (+10 pts) for Player 14 in Episode 2.
   - Verify Team "Jackson"'s score INCREASES by 10 points for Episode 2.
4. **Trajectory & Roster Display Test**:
   - Verify `TeamScoreGraph` trajectory line only reflects Episode 2+ points for Player 14.
