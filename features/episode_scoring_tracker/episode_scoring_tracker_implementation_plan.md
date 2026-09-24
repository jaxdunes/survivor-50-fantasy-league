# Implementation Plan - Episode Auto-Memory & Compact 3-State "Episodes Scored" Leaderboard Tracker

Implement two key user experience improvements to the scoring workflow and leaderboard:
1. **Top-Level Episode Selection & Auto-Memory**:
   - Move the **Episode Select** dropdown to the **very top** of the `Add Points` form box.
   - Remember the last selected episode in `localStorage` so the episode field auto-fills on subsequent entries and retains its value post-submission.
2. **Compact 3-State "Episodes Scored" Tracker**: Add a visual status toolbar on the leaderboard displaying mini-badges (`E1 ✓`, `E2 ⚪`, `E3 ✗`) for Episodes 1–14 with three dynamic states:
   - 🟢 **Scored / Completed (`✓`)**: Green mini-badge with check mark when a player is voted out in that episode.
   - 🔘 **Being Scored / In Progress (`⚪`)**: Slate gray mini-badge with circle mark when points have been allocated under that episode but no player has been voted out yet.
   - 🔴 **Unscored / Not Started (`✗`)**: Website-themed dark/amber mini-badge with X mark when 0 points and 0 eliminations exist.

---

## User Feedback Incorporated

> [!NOTE]
> **Compact UI Design**: Based on user feedback ("I would like the episode tracker to be smaller... a minor part of the screen"), the component was redesigned from a large card into a sleek, non-intrusive horizontal toolbar (`py-3 px-4`, ~40px height) that provides at-a-glance visibility without dominating screen real estate.

---

## Proposed & Executed Changes

### Scorekeeping & Leaderboard (`index.html`)

#### [MODIFY] [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)
- **Add Points Modal Form Layout**:
  - Re-ordered modal form elements so `#episode-select` is rendered as the first form field at the very top of the modal.
- **Episode Selection Auto-Memory**:
  - Loaded `localStorage.getItem('survivor_last_selected_episode')` when opening the `Add Points` modal.
  - Saved the selected episode to `localStorage` on dropdown change.
  - Post-submission: Retained `#episode-select` value instead of resetting it to `''`.
- **Compact 3-State "Episodes Scored" Tracker Component**:
  - Rendered `EpisodesScoredTracker` directly above the Leaderboard section on `index.html`.
  - Structured as a sleek horizontal toolbar with micro-pills (`E1 ✓`, `E2 ⚪`, `E3 ✗`).
  - Interactive click: Clicking any mini-badge opens `Add Points` modal with that episode pre-selected at the top.

---

## Verification Plan

### Manual Verification
1. **Compact Bar Layout**: Confirm tracker renders as a subtle horizontal toolbar above the Leaderboard.
2. **Add Points Form Layout**: Confirm `#episode-select` is rendered at the top of the form above `#player-select`.
3. **Episode Auto-Memory**: Select `Episode 3` and submit a score: confirm `#episode-select` remains set to `Episode 3`.
4. **3-State Tracker Verification**:
   - **Completed (`✓`)**: Mark a player voted out in Episode 1: verify E1 turns green with `✓`.
   - **Being Scored (`⚪`)**: Log points in Episode 3 without a voted-out player: verify E3 turns gray with `⚪`.
   - **Unscored (`✗`)**: Episodes with 0 points and 0 eliminations stay themed dark/amber `E# ✗`.
