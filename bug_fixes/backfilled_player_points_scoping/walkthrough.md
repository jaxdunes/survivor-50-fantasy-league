# Walkthrough: Backfilled Player Points Episode Scoping Fix

## Feature / Bug Overview
When a drafted contestant is eliminated (e.g. in Episode 1), the post-draft **Auto-Backfill Engine** assigns an unassigned contestant to replace them. Previously, the system added **ALL** of the backfilled contestant's points to the fantasy team's score, including points earned in episodes *prior to* when the backfill occurred.

This bug fix updates the score engine so fantasy teams **only receive points earned by backfilled contestants from the episode they were backfilled onward**. Points earned prior to being backfilled are excluded from team totals.

---

## Key Changes Implemented

### 1. Backfill Metadata Engine (`index.html`)
- Updated the post-draft Auto-Backfill Engine during score submission to record the episode number when a contestant is backfilled:
  ```javascript
  ds.backfilledPlayers = ds.backfilledPlayers || {};
  ds.backfilledPlayers[backfillP.id] = {
      episode: parseInt(episode),
      replacedPlayerId: playerId,
      timestamp: Date.now()
  };
  ```

---

### 2. Backfill Episode Helper (`index.html`)
- Created `getBackfillEpisode(playerId, draftState)` helper to resolve the backfill episode for any player, with backwards compatibility for legacy numeric/boolean entries:
  ```javascript
  const getBackfillEpisode = (playerId, dState) => {
      const ds = dState || (typeof draftState !== 'undefined' ? draftState : null);
      if (!ds || !ds.backfilledPlayers) return null;
      const bf = ds.backfilledPlayers[playerId] || ds.backfilledPlayers[String(playerId)];
      if (!bf) return null;
      if (typeof bf === 'number') return bf;
      if (typeof bf === 'object' && bf !== null && bf.episode !== undefined) return parseInt(bf.episode);
      return 1;
  };
  ```

---

### 3. Team Score & Trajectory Calculations (`index.html`)
- Updated `getTeamScore(teamId)` and `TeamScoreGraph` trajectory calculations to check `bfEp = getBackfillEpisode(player.id, draftState)`.
- For backfilled contestants, points earned in episodes `epNum <= bfEp` (prior to joining the team) are excluded from the team's cumulative total score.
- Updated `getPlayerScore(playerId)` and `getPlayerBreakdown(playerId)` to annotate pre-backfill breakdown entries (e.g. `(Earned prior to backfill - 0 pts for team)`).
- Updated player header badges on expanded roster cards to display `↩️ BACKFILLED (EP E)`.

---

## Summary of Modified Files

- [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html): Added `getBackfillEpisode` helper, updated `getTeamScore`, `TeamScoreGraph`, `getPlayerScore`, `getPlayerBreakdown`, and auto-backfill write metadata.
- [`bug_fixes/backfilled_player_points_scoping/prd.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/bug_fixes/backfilled_player_points_scoping/prd.md): Product requirements document.
- [`bug_fixes/backfilled_player_points_scoping/implementation_plan.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/bug_fixes/backfilled_player_points_scoping/implementation_plan.md): Technical implementation plan.
