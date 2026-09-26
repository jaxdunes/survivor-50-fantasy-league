# Implementation Plan - Season 51 Starting Tribe Assignment & Tribe Sorting

Assign all 21 castaways of *Survivor 51: Open Era* to their official starting tribes (**Toka**, **Savu**, and **Exile Island**) based on Wikipedia season data, and update tribe card badges and filtering controls in `draft.html` and `index.html`.

---

## User Review Required

> [!IMPORTANT]
> - **Branch Created**: Active feature branch [`feature/season-51-starting-tribes`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league).
> - **PRD Document**: Saved at [`features/season_51_starting_tribes/season_51_starting_tribes_prd.md`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/features/season_51_starting_tribes/season_51_starting_tribes_prd.md).

---

## Proposed Changes

### 1. Dataset (`seasons/season-51.json`)

#### [MODIFY] [`seasons/season-51.json`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/seasons/season-51.json)
- Update `tribe` and `startingTribe` for each contestant:
  - **Toka** (10 members): Aaliyah Puglia, An “Thien An” Nguyen, Angelica “Jelly” Loblack, Brady Booker, Danny “Kilby” Kilby, Devin Way, Jenna Doore, Maggie Nestor, Mike Pinsky, Patt Cannaday.
  - **Savu** (10 members): Alexis Levine, Ana Sani, Carter Krull, Cristian Chavez, Eric Macksoud, Kristin Flickinger, Linnea Capobianco, Ori Jean-Charles, Rob Antonson, Sharonda Cox.
  - **Exile Island** (1 member): Lewis Kelly.

---

### 2. UI & Filter Components (`draft.html` & `index.html`)

#### [MODIFY] [`draft.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/draft.html) & [`index.html`](file:///Users/ryantaylor/Desktop/survivor-50-fantasy-league/index.html)
- Update `getTribeColor` and `getTribeBadgeColor` helper functions to support Toka (yellow gradient/badge), Savu (purple gradient/badge), and Exile Island (slate gradient/badge).
- Update Tribe Filter dropdown in `draft.html` dynamically based on `activeSeasonId`:
  - Season 51: `All Tribes`, `☀️ Toka`, `🟣 Savu`, `🏝️ Exile Island`.
  - Season 50: `All Tribes`, `🔥 Cila`, `🌊 Kalo`, `⚡ Vatu`.

---

## Verification Plan

### Manual Verification
1. **Dataset Integrity**: Verify `seasons/season-51.json` valid JSON structure.
2. **Draftboard Filtering**:
   - Open `draft.html` for Season 51.
   - Filter by `Toka`: verify exactly 10 contestants display.
   - Filter by `Savu`: verify exactly 10 contestants display.
   - Filter by `Exile Island`: verify Lewis Kelly displays.
3. **Card Badges & Aesthetics**: Verify contestant card headers show Toka yellow gradient and Savu purple gradient.
