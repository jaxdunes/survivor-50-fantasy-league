# Implementation Plan: Episode Scored Push Notifications

**Target Feature**: Episode Scored Push Notifications  
**Location**: `features/episode_scored_notifications/episode_scored_notifications_implementation_plan.md`  
**Git Branch**: `feature/episode-scored-push-notifications`

---

## Proposed Changes

### Phase 1: User Notification Preferences (`notifications.html`)
Add a new UI toggle card to `notifications.html` allowing users to configure whether they receive notifications when episode scores are published.

#### Proposed Edits:
- Add a HTML card inside `#preferencesSection` in `notifications.html`:
  ```html
  <div class="notification-card">
      <h3>🏆 Episode Scores</h3>
      <div class="toggle-container">
          <span class="toggle-label">Notify me when episode scores are released</span>
          <div class="toggle-switch active" data-pref="episodeScored"></div>
      </div>
  </div>
  ```

---

### Phase 2: Firebase Cloud Function (`index.js`)
Implement `sendEpisodeScoredNotification` in `index.js` to broadcast Web Push notifications to opted-in league members when an episode is marked as scored.

#### Proposed Edits:
- Add Firebase Cloud Function trigger:
  ```javascript
  exports.sendEpisodeScoredNotification = functions.database
      .ref('/leagues/{leagueId}/seasons/{seasonId}/scoredEpisodes/{episodeNum}')
      .onCreate(async (snapshot, context) => {
          const { leagueId, seasonId, episodeNum } = context.params;
          
          // 1. Fetch league members
          const leagueSnap = await admin.database().ref(`leagues/${leagueId}/members`).once('value');
          const members = leagueSnap.val() || {};
          
          // 2. Fetch users and filter by FCM tokens and preferences
          const usersSnap = await admin.database().ref('users').once('value');
          const users = usersSnap.val() || {};
          
          const tokens = [];
          for (const userId in members) {
              const user = users[userId];
              if (!user || !user.fcmToken) continue;
              
              const prefs = user.notificationPrefs || {};
              if (prefs.episodeScored === false) continue;
              
              tokens.push(user.fcmToken);
          }
          
          if (tokens.length === 0) return null;
          
          // 3. Send notification payload via admin.messaging()
          const payload = {
              notification: {
                  title: `🏆 Survivor Fantasy League`,
                  body: `Scores for Episode ${episodeNum} are live! Check the standings.`
              },
              data: {
                  type: 'episode-scored',
                  leagueId,
                  seasonId,
                  episode: episodeNum
              }
          };
          
          return admin.messaging().sendToDevice(tokens, payload);
      });
  ```

---

### Phase 3: Service Worker Handler (`service-worker.js`)
Update `service-worker.js` to handle `notificationclick` events for `episode-scored` type and route users to `index.html` with their league and season context.

#### Proposed Edits:
- Modify `notificationclick` event listener in `service-worker.js`:
  - Read `event.notification.data`.
  - Construct target URL: `./index.html?league=${leagueId}&season=${seasonId}`.
  - Focus active client tab or open a new window.

---

### Phase 4: Admin Trigger Integration (`index.html`)
Provide an admin UI control in `index.html` (e.g. inside `Add Points` modal or `EpisodesScoredTracker` component) to set `scoredEpisodes/{episodeNum}` to mark an episode as completed and trigger the notification.

#### Proposed Edits:
- Add a button or checkbox: "Mark Episode {N} as Scored".
- On submit, call `database.ref(`leagues/${activeLeagueId}/seasons/${activeSeasonId}/scoredEpisodes/${episode}`).set({ scoredAt: firebase.database.ServerValue.TIMESTAMP, scoredBy: currentUser.uid })`.

---

## Verification Plan

### Automated & Manual Verification Steps

1. **Branch Check**:
   - Confirm active branch is `feature/episode-scored-push-notifications`.

2. **Preference Toggle Testing (`notifications.html`)**:
   - Open `http://localhost:8085/notifications.html`.
   - Toggle "Notify me when episode scores are released".
   - Inspect Firebase RTDB path `users/{uid}/notificationPrefs/episodeScored` to confirm `true` / `false` persistence.

3. **Cloud Function & Push Delivery**:
   - Trigger the `scoredEpisodes/{episodeNum}` creation in RTDB.
   - Verify push notification receipt on browser/device.

4. **Service Worker Navigation**:
   - Click the push notification notification.
   - Verify browser focuses or opens `index.html?league=jackson-ryan-league&season=season-51`.
