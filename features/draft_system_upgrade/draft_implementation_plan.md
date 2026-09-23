# Implementation Plan - Survivor Fantasy League Draft System Upgrade

Implement the full draft system specified in [`features/draft_system_upgrade/draft_prd.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/features/draft_system_upgrade/draft_prd.md), introducing a real-time state machine (`Closed`, `Open`, `Finalized`), a live `DraftOrderBar` with elapsed pick timer (`⏱️ 0:00`), interactive Draft Settings drawer, safety warning reset modal, backfill automation engine, and `↩️ BACKFILLED` badges across draft rosters and leaderboards.

---

## User Review Required

> [!IMPORTANT]
> - **No Commissioner Dependency**: Turn enforcing and draft management are available to all league members.
> - **Draft Terminology**: Draft pause action uses **"Close Draft"** per PRD design guidelines.
> - **Safety Safeguard**: Editing settings mid-draft (≥1 pick) requires confirmation to **Reset & Edit** which clears picks and resets draft state to `Closed`.

---

## Proposed Changes

### Component 1: Firebase Schema Expansion & API Layer

#### [MODIFY] [`js/api.js`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/js/api.js)

- Extend `SurvivorAPI` to support reading and writing `draftState`:
  ```json
  {
    "status": "closed",
    "style": "snake",
    "orderType": "random",
    "backfillEnabled": true,
    "currentRound": 1,
    "currentPick": 1,
    "lastPickTimestamp": 1727040000000,
    "onTheClockTeamId": "ryan",
    "orderSequence": ["ryan", "jordan", "scott", "hayley", "ashlynn"],
    "budgets": {},
    "backfilledPlayers": {}
  }
  ```
- Add methods: `getDraftState(leagueId, seasonId)`, `updateDraftState(leagueId, seasonId, newState)`, `resetDraft(leagueId, seasonId)`, `autoBackfill(leagueId, seasonId, eliminatedPlayerId)`.

---

### Component 2: Draft Board Page (`draft.html`)

#### [MODIFY] [`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html)

1. **State Machine & Control Buttons**:
   - Header primary action buttons:
     - `Closed`: **"🔥 Begin Draft"** button.
     - `Open`: **"🔴 Close Draft"** & **"✅ Finalize Draft"** buttons.
     - `Finalized`: **"🔒 Draft Finalized"** status badge.
2. **"The Voting Booth" Draft Order Box & Live Pick Timer**:
   - Titled **"🗳️ THE VOTING BOOTH"**, appearing above player cards when draft is `Open`.
   - Displays current Round & Pick (e.g., `Round 1 • Pick 3 (Overall #3)`).
   - Shows live digital timer `⏱️ MM:SS` counting up from `lastPickTimestamp`. Timer resets to `0:00` automatically on every pick.
   - Renders sequence of teams with glowing amber border and a **burning torch icon (🔥)** beside the **On-The-Clock Manager**.
3. **Turn-Based Player Assignment**:
   - When draft is `Open`, player cards show an active **"Draft Player"** or **"Assign"** button only for the team currently on the clock (or for any team if manually selected).
   - Assigning a player updates `playerTeams`, advances `currentPick`, recalculates `onTheClockTeamId` based on `style` (Linear vs Snake), and sets `lastPickTimestamp = Date.now()`.
4. **Draft Settings Drawer / Modal**:
   - Opened via **⚙️ Cog Icon** in the navigation header.
   - **Draft Order**:
     - `Random` radio option with description: *"Managers are placed in a completely random draft order."*
     - `Based on Previous` reverse standings radio option with tie-breaker description: *"Draft order goes from lowest to highest points from previous season. Ties broken by total individual immunities won by players on that manager's roster. New managers placed randomly behind returning managers."* (Disabled if season count <= 1).
   - **Draft Style**:
     - `Linear`, `Snake`, `Auction` (with budget tracker modal), `Derby / Picker's Choice 💡` recommendation card.
   - **Backfill Setting**:
     - Toggle switch: `Automatically Backfill Eliminated Players` (Default: ON).
5. **Safety Warning Reset Modal**:
   - Prompted when opening settings mid-draft (`status === 'open'` and `picksCount > 0`).
   - Options: `🚫 Cancel & Resume Draft` vs `🔄 Reset & Edit`.
   - Reset action wipes `playerTeams` for the season, resets pick pointer to `Round 1, Pick 1`, sets status to `closed`, and opens settings.
6. **Backfill Visual Indicator**:
   - Displays `↩️ BACKFILLED` badge on player cards and team rosters for players flagged in `draftState.backfilledPlayers`.

---

### Component 3: Leaderboard & Score Submission (`index.html`)

#### [MODIFY] [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)

1. **Auto-Backfill Trigger on Score Submission**:
   - In `handleSaveScore`, when an elimination category is submitted (`isElimination === true`):
     - Check if `draftState.status === 'finalized'` and `draftState.backfillEnabled === true`.
     - Identify the team owning the eliminated contestant.
     - Select the remaining unassigned player with the **lowest Cast ID**.
     - Auto-assign that player to the team and mark ID in `draftState.backfilledPlayers`.
2. **Backfill Roster Badging**:
   - Render `↩️ BACKFILLED` badge next to backfilled players on expanded leaderboard rosters.

---

## Verification Plan

### Automated & Unit Checks
- Code syntax inspection and console error monitoring.

### Manual & Interactive Verification
- **State Flow**: Test `Closed` ➔ `Open` ➔ `Finalized` and `Close Draft` toggle.
- **Pick Timer**: Verify `⏱️ 0:00` pick timer starts, counts up in seconds/minutes, and resets to `0:00` on pick.
- **Safety Reset**: Draft 1 player, click Settings Cog, confirm Warning Modal, click Reset & Edit, verify picks cleared and draft reset to `Closed`.
- **Backfill Engine**: Finalize draft, submit elimination score in `index.html`, verify unassigned player with lowest Cast ID is assigned to team and displays `↩️ BACKFILLED` badge on both `draft.html` and `index.html`.
