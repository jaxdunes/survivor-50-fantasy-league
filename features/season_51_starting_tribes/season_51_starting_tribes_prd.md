# Product Requirements Document (PRD): Season 51 Starting Tribe Assignment & Tribe Sorting

**Version**: 1.0 (Specification for Review)  
**Status**: Pending Review  
**Location**: `features/season_51_starting_tribes/season_51_starting_tribes_prd.md`  
**Target Files**: `seasons/season-51.json`, `draft.html`, `index.html`  
**Git Branch**: `feature/season-51-starting-tribes`

---

## 1. Overview & Objectives

The **Season 51 Starting Tribe Assignment & Tribe Sorting** feature assigns all 21 castaways of *Survivor 51: Open Era* to their official starting tribes based on official CBS / Wikipedia season data.

### Core Objectives:
1. **Assign Starting Tribes in Dataset**: Update `seasons/season-51.json` so every contestant has their official starting tribe (`Toka`, `Savu`, or `Exile Island`) mapped to `tribe` and `startingTribe`.
2. **Update Tribe Filtering & Visual Badges**:
   - Update `draft.html` and `index.html` tribe filters dynamically based on the active season.
   - For Season 51, support **Toka** (Yellow 🟡 / ☀️), **Savu** (Purple 🟣 / ⚡), and **Exile Island** (🏝️).
   - Render theme-appropriate color gradients and current tribe badges directly on `PlayerCard` (in `draft.html`) and inline on team roster entries (in `index.html`).

---

## 2. Official Season 51 Starting Tribe Mapping

Survivor 51 features **two starting tribes** of 10 contestants, plus 1 contestant starting on Exile Island:

### A. Toka Tribe (Yellow 🟡 / ☀️) — 10 Castaways
| ID | Contestant Name | Starting Tribe | Age | Occupation | Hometown |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Aaliyah Puglia | **Toka** | 24 | Chef | Providence, RI |
| **3** | An “Thien An” Nguyen | **Toka** | 24 | Medical Student | Fort Worth, TX |
| **5** | Angelica “Jelly” Loblack | **Toka** | 29 | Sociology Professor | Bloomington, IN |
| **6** | Brady Booker | **Toka** | 27 | Professional Wrestler | Knoxville, TN |
| **9** | Danny “Kilby” Kilby | **Toka** | 30 | Game Designer | London, ON |
| **10** | Devin Way | **Toka** | 33 | Actor | Los Angeles, CA |
| **12** | Jenna Doore | **Toka** | 30 | Wedding Photographer | Toledo, OH |
| **16** | Maggie Nestor | **Toka** | 40 | Farmer | Charles Town, WV |
| **17** | Mike Pinsky | **Toka** | 32 | Baseball Executive | New York City, NY |
| **19** | Patt Cannaday | **Toka** | 33 | Federal Prosecutor | Washington, DC |

---

### B. Savu Tribe (Purple 🟣 / ⚡) — 10 Castaways
| ID | Contestant Name | Starting Tribe | Age | Occupation | Hometown |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **2** | Alexis Levine | **Savu** | 34 | Criminal Defense Attorney | Atlanta, GA |
| **4** | Ana Sani | **Savu** | 34 | Voice Actress | Toronto, ON |
| **7** | Carter Krull | **Savu** | 24 | Livestock Farmer | Sioux Falls, SD |
| **8** | Cristian Chavez | **Savu** | 26 | Head of HR | Salt Lake City, UT |
| **11** | Eric Macksoud | **Savu** | 34 | Mental Health Counselor | Windsor Locks, CT |
| **13** | Kristin Flickinger | **Savu** | 49 | Crisis Management | Santa Barbara, CA |
| **15** | Linnea Capobianco | **Savu** | 25 | Entrepreneur | Jersey City, NJ |
| **18** | Ori Jean-Charles | **Savu** | 27 | Personal Trainer | Spring Valley, NY |
| **20** | Rob Antonson | **Savu** | 34 | Airline Gate Agent | Cumberland, RI |
| **21** | Sharonda Cox | **Savu** | 34 | OBGYN Resident | Richmond, KY |

---

### C. Exile Island (🏝️) — 1 Castaway
| ID | Contestant Name | Starting Location | Age | Occupation | Hometown |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **14** | Lewis Kelly | **Exile Island** | 28 | Farmer | Puerto Rico / Ireland |

*(Note: Lewis Kelly starts on Exile Island and joins the Toka tribe following their first immunity challenge loss).*

---

## 3. UI Specifications & Tribe Styling

### 3.1 Tribe Badges & Card Gradients
- **Toka Tribe**:
  - Gradient: `from-amber-500 to-yellow-600`
  - Badge: `bg-amber-100 text-amber-900 border border-amber-300` (`☀️ Toka`)
- **Savu Tribe**:
  - Gradient: `from-purple-600 to-indigo-700`
  - Badge: `bg-purple-100 text-purple-900 border border-purple-300` (`🟣 Savu`)
- **Exile Island**:
  - Gradient: `from-slate-700 to-stone-800`
  - Badge: `bg-slate-200 text-slate-900 border border-slate-400` (`🏝️ Exile`)

### 3.2 Dynamic Draftboard Tribe Filter
- In `draft.html`:
  - Dynamically derive tribe dropdown filter options exclusively from the active season's contestant data (`availableTribes`).
  - For **Season 51**: Only display `All Tribes`, `☀️ Toka`, `🟣 Savu`, and `🏝️ Exile Island`.
  - For **Season 50**: Only display `All Tribes`, `🔥 Cila`, `🌊 Kalo`, and `⚡ Vatu`.

### 3.3 Permanent Tribe-Grouped Player Selection Interface ("Add Points")
- **Permanent Tribe-Grouped Button Grid**:
  - The "Add Points" modal on `index.html` permanently displays all active contestants organized in their respective tribe boxes (`☀️ Toka`, `🟣 Savu`, `🏝️ Exile Island` or `🔥 Cila`, `🌊 Kalo`, `⚡ Vatu`).
  - The single-player dropdown and the "Apply to multiple players" toggle checkbox are removed in favor of this unified, box-based selection system.
- **Tribe Bulk Selection Button**:
  - Clicking a Tribe header button (e.g., `Select Toka Tribe`) toggles/activates all active (non-eliminated) players on that tribe.
- **Individual Player Name Buttons**:
  - Each contestant's name is rendered as a distinct button box. Clicking a button toggles their selection state on or off, allowing the user to select one player, a custom group, or full tribes seamlessly.
- **Batch Points Submission**:
  - Submitting the scoring event records points, category, and optional notes for all selected players across chosen fantasy leagues simultaneously.

---

## 4. Verification & Testing Plan

1. **Dataset Verification**:
   - Inspect `seasons/season-51.json` to confirm all 21 contestants have non-unassigned `tribe` and `startingTribe` values.
2. **Draftboard Render & Filter Verification**:
   - Open `draft.html` for Season 51.
   - Confirm contestant cards display yellow Toka, purple Savu, and stone Exile Island badges.
   - Select `Toka` in tribe dropdown: confirm only 10 Toka members display.
   - Select `Savu`: confirm 10 Savu members display.
   - Select `Exile Island`: confirm Lewis Kelly displays.
