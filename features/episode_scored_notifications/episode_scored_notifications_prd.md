# Product Requirements Document (PRD): Episode Scored Push Notifications

**Version**: 1.0  
**Status**: Draft Specification for Review  
**Location**: `features/episode_scored_notifications/episode_scored_notifications_prd.md`  
**Target Pages**: `index.html` (Points Entry & Leaderboard), `notifications.html` (User Preferences), `service-worker.js`, `index.js` (Firebase Cloud Functions)  
**Git Branch**: `feature/episode-scored-push-notifications`

---

## 1. Overview & Objectives

The **Episode Scored Push Notifications** feature automatically notifies league members via Web Push Notifications whenever an episode's scores have been finalized and published by a league administrator.

### Core Objectives:
1. **Real-time Member Engagement**: Immediately notify league participants when fantasy points and leaderboard rankings update following a newly scored episode.
2. **Spoiler-Safe Alerts**: Provide engaging, hype-building notification copy without revealing specific elimination spoilers (e.g. "Episode 3 scores are live! Check the standings.").
3. **User Preference & Granular Control**: Allow members to toggle `Episode Scored` push notifications on or off independently from chat and watch status alerts.
4. **Seamless Deep-Linking**: Clicking the push notification immediately directs users to `index.html` with their active league and season pre-loaded.

---

## 2. User Stories & Key Workflows

### 2.1 Admin Publishing Workflow
- **As a** League Admin / Scorekeeper  
- **When I** finish entering scores and eliminations for an episode in `index.html`  
- **I want to** mark the episode as "Scored & Published"  
- **So that** a push notification is automatically broadcast to all opted-in league members.

### 2.2 League Member Reception Workflow
- **As a** League Member  
- **When** an episode is marked as scored  
- **I want to** receive a push notification on my phone/desktop  
- **So that** I know immediately when to check my team's updated points and rank on the Leaderboard.

### 2.3 Notification Preference Workflow
- **As a** League Member  
- **When I** visit `notifications.html`  
- **I want to** see a dedicated toggle for "Episode Scores Published"  
- **So that** I can enable or disable these notifications at any time.

---

## 3. Data Schema & Contracts

### 3.1 Realtime Database Schema (`scoredEpisodes`)

A new node `scoredEpisodes` is stored per season under each league:

```json
{
  "leagues": {
    "{leagueId}": {
      "seasons": {
        "{seasonId}": {
          "scoredEpisodes": {
            "{episodeNum}": {
              "scoredAt": 1758873600000,
              "scoredBy": "admin_user_id",
              "status": "completed"
            }
          }
        }
      }
    }
  }
}
```

### 3.2 User Notification Preference Schema (`notificationPrefs`)

Extend user profile preferences under `users/{userId}/notificationPrefs`:

```json
{
  "users": {
    "{userId}": {
      "notificationPrefs": {
        "chatMessage": true,
        "episodeWatched": true,
        "episodeScored": true
      }
    }
  }
}
```

*Note: Default value for `episodeScored` is `true` if undefined.*

---

## 4. Technical Specifications & Architecture

### 4.1 Cloud Function Trigger (`index.js`)

Add a Firebase Cloud Function `sendEpisodeScoredNotification` that triggers on `onCreate` for `/leagues/{leagueId}/seasons/{seasonId}/scoredEpisodes/{episodeNum}`:

```mermaid
flowchart TD
    A[Admin Marks Episode Scored] -->|Write RTDB| B[/leagues/{leagueId}/seasons/{seasonId}/scoredEpisodes/{episodeNum}/]
    B -->|onCreate Event| C[Cloud Function: sendEpisodeScoredNotification]
    C --> D[Fetch League Members & User FCM Tokens]
    D --> E{User Preference Check: episodeScored !== false}
    E -- Yes --> F[Collect FCM Tokens]
    E -- No --> G[Skip User]
    F --> H[Send FCM Multicast Payload]
    H --> I[Web Push to Devices]
```

#### Push Payload Structure:
- **Title**: `🏆 Episode {episodeNum} Scores Published!`
- **Body**: `Scores for Episode {episodeNum} are in. Check out the updated leaderboard!`
- **Icon**: `icons/icon-192x192.png`
- **Badge**: `icons/icon-72x72.png`
- **Data**:
  ```json
  {
    "type": "episode-scored",
    "leagueId": "{leagueId}",
    "seasonId": "{seasonId}",
    "episode": "{episodeNum}"
  }
  ```

### 4.2 Service Worker Event Handling (`service-worker.js`)
- Handle `type === 'episode-scored'` push events.
- On `notificationclick`:
  - Search existing browser window clients for `index.html`.
  - If open, focus window and navigate to `index.html?league={leagueId}&season={seasonId}`.
  - If closed, open a new window to `index.html?league={leagueId}&season={seasonId}`.

### 4.3 UI Integrations

#### A. Admin Scoring Modal (`index.html`)
- In the `Add Points` modal form or tracker bar, add a **"Mark Episode {X} as Scored & Notify League"** button/checkbox.
- Executing this action writes to `/leagues/{leagueId}/seasons/{seasonId}/scoredEpisodes/{episodeNum}`.

#### B. Notifications Page (`notifications.html`)
- Add a new preference section card:
  - Title: `🏆 Episode Scores`
  - Toggle Label: `Notify me when episode scores are published`
  - Data Attribute: `data-pref="episodeScored"`

---

## 5. Non-Functional Requirements & Security

1. **Idempotency & Duplicate Prevention**:
   - The Cloud Function triggers on `onCreate` of the episode node. If an episode is updated later, `onCreate` will not re-fire, avoiding spamming users.
2. **Invalid Token Cleanup**:
   - Like existing functions in `index.js`, failed FCM token deliveries due to unregistered devices will automatically set `users/{userId}/fcmToken = null`.
3. **Environment Isolation**:
   - Operates safely under `dev_testing/` path namespacing when testing on `localhost`.

---

## 6. Verification & Test Plan

1. **Preference Persistence**: Toggle `episodeScored` off/on in `notifications.html` and verify node updates in Firebase RTDB.
2. **Cloud Function Trigger**: Simulate writing an episode completion node in RTDB and verify Cloud Function log execution.
3. **Push Delivery & Service Worker**: Verify push receipt on subscribed desktop/mobile browsers.
4. **Deep Link Navigation**: Click the notification and confirm auto-navigation to `index.html` with target league and season URL parameters.
