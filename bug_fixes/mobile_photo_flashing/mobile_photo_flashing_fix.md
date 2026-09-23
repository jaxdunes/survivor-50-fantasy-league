# Implementation Plan - Fix Mobile Player Photo Flashing Bug

Investigate and resolve the issue where survivor player photos flash/flicker when viewed on mobile screens on the Draft Board (`draft.html`).

## Root Cause Analysis

Based on empirical browser trace and codebase analysis:
1. **High-Frequency React Component Re-renders**: The draft timer (`setInterval` updating `elapsedSeconds` every 1000ms) causes the entire `DraftBoard` component to re-render every second. Because `PlayerCard` is re-evaluated on every tick, React reconciles all player card DOM trees continuously.
2. **Mobile WebKit Compositor Repaint Conflict**: On mobile viewports (iOS Safari and Mobile WebKit), circular images with `rounded-full` (`border-radius: 50%`), `object-cover`, `border-3 border-white`, and `shadow-lg` inside absolute containers overlap with fixed-position background animations (`body.theme-tribal::after` running `fireFlicker` CSS keyframe animation). Every screen repaint invalidates the image composite layer, causing a visible white/transparent flash.
3. **Lack of Hardware Acceleration & Asynchronous Decoding**: The `<img>` tags lack explicit GPU compositing properties (`transform: translateZ(0)`, `backface-visibility: hidden`) and `decoding="async"`, allowing WebKit to trigger image decode cycles on main-thread repaints.

---

## User Review Required

> [!IMPORTANT]
> **Proposed Technical Solution**:
> - **Memoize `PlayerCard` Component**: Wrap `PlayerCard` in `React.memo` so player cards do NOT re-render on 1-second timer ticks unless player assignment or team status actually changes.
> - **Apply CSS Layer Compositing**: Add a `.player-photo-avatar` CSS utility with `transform: translateZ(0)`, `-webkit-backface-visibility: hidden`, `backface-visibility: hidden`, `isolation: isolate`, and `decoding="async"` to force hardware acceleration on mobile graphics layers.
> - **Isolate Fixed Animation Composition**: Add `transform: translateZ(0)` and layer isolation to `body.theme-tribal::after` to prevent the fire flicker animation from triggering layout repaints on player cards.

---

## Proposed Changes

### Draft Board (`draft.html`)

#### [MODIFY] [draft.html](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html)

1. **Add GPU Hardware Acceleration CSS Class**:
   Add `.player-photo-avatar` rule to the `<style>` block in [draft.html](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html):
   ```css
   .player-photo-avatar {
       -webkit-backface-visibility: hidden;
       backface-visibility: hidden;
       transform: translateZ(0);
       isolation: isolate;
   }
   ```

2. **Update Image Rendering in `PlayerCard`**:
   Add `player-photo-avatar` class and `decoding: 'async'` attribute to `<img>` in `PlayerCard`:
   ```javascript
   h('img', {
       src: player.image,
       alt: player.name,
       decoding: 'async',
       className: 'absolute top-2 right-2 w-20 h-20 rounded-full border-3 border-white shadow-lg object-cover player-photo-avatar'
   })
   ```

3. **Wrap `PlayerCard` in `React.memo`**:
   Memoize `PlayerCard` using React's `React.memo` to prevent re-renders when `elapsedSeconds` or non-player state updates occur.

4. **Isolate Background Animation GPU Composition**:
   Promote `body.theme-tribal::after` to its own hardware compositing layer with `transform: translateZ(0)` and `will-change: transform, opacity`.

---

## Verification Plan

### Automated Verification
- Syntax and script validity checks on `draft.html`.

### Manual Verification
- Launch `http://localhost:8085/draft.html` in mobile viewport mode (390 x 844 px).
- Observe player cards during active draft timer ticks to confirm zero photo flashing/flickering.
- Verify smooth scrolling and hover behavior on mobile viewports.
