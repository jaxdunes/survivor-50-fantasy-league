# Walkthrough - Mobile Player Photo Flashing Fix

Investigated and resolved the mobile player photo flashing bug on the Draft Board ([`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html)).

## Changes Made

### Draft Board (`draft.html`)

- **Memoized `PlayerCard` Component**: Wrapped `PlayerCard` in `React.memo` so timer ticks (`setInterval` updating `elapsedSeconds` every 1000ms) no longer force all player cards to re-render.
- **Added GPU Layer Hardware Acceleration**: Added `.player-photo-avatar` CSS utility containing `transform: translateZ(0)`, `-webkit-backface-visibility: hidden`, `backface-visibility: hidden`, and `isolation: isolate`.
- **Async Image Decoding**: Added `decoding="async"` to player avatar images (`<img>`).
- **Isolated Fixed Background Animation Compositing**: Added `will-change: transform, opacity` and `transform: translateZ(0)` to `body.theme-tribal::after` to prevent the fire flicker animation layer from triggering repaints on player cards.

---

## Verification Results

### Automated & Visual Verification
Tested `http://localhost:8085/draft.html` on a mobile viewport (390 x 844 px):
- **Player Card Stability**: Player photos render cleanly without any flickering or flashing on timer ticks or background animations.
- **Console & Performance**: Firebase connection active with zero errors or performance warnings during updates.

![Mobile Draft Board Screenshot](file:///Users/ryantaylor/.gemini/antigravity-ide/brain/212f2ee1-cab2-451a-907f-1b7db8546cb2/player_cards_view1_1790206020531.png)

![Mobile Draft Verification Video](file:///Users/ryantaylor/.gemini/antigravity-ide/brain/212f2ee1-cab2-451a-907f-1b7db8546cb2/verify_mobile_draft_photos_fix_1790205976028.webp)
