/**
 * Database API Layer for Survivor Fantasy League
 * Handles reading & writing data with fallback support for existing legacy nodes.
 */

class SurvivorAPI {
    constructor(db) {
        this.db = db;
    }

    /**
     * Get season contestant data & metadata
     */
    async getSeason(seasonId = 'season-50') {
        if (!this.db) return null;
        try {
            const snap = await this.db.ref(`seasons/${seasonId}`).once('value');
            if (snap.exists()) return snap.val();
        } catch (e) {
            console.error('Error fetching season data:', e);
        }
        return null;
    }

    /**
     * Get league metadata, members, and draft picks
     */
    async getLeague(leagueId = 'main-league-2026') {
        if (!this.db) return null;
        try {
            const snap = await this.db.ref(`leagues/${leagueId}`).once('value');
            if (snap.exists()) return snap.val();
            
            // Fallback for legacy database structure:
            const usersSnap = await this.db.ref('users').once('value');
            if (usersSnap.exists()) {
                const users = usersSnap.val() || {};
                const members = {};
                const drafts = {};
                
                Object.keys(users).forEach(uid => {
                    members[uid] = { displayName: users[uid].username || users[uid].name || uid };
                    if (users[uid].draftPicks) {
                        drafts[uid] = users[uid].draftPicks;
                    }
                });
                
                return {
                    id: leagueId,
                    name: leagueId === 'work-league-2026' ? 'Work League' : 'Main League',
                    members,
                    drafts
                };
            }
        } catch (e) {
            console.error('Error fetching league data:', e);
        }
        return null;
    }

    /**
     * Get episode scores for a season
     */
    async getEpisodeScores(seasonId = 'season-50') {
        if (!this.db) return {};
        try {
            const snap = await this.db.ref(`episodeScores/${seasonId}`).once('value');
            if (snap.exists()) return snap.val();

            // Legacy fallback
            const legacySnap = await this.db.ref('episodeScores').once('value');
            if (legacySnap.exists()) return legacySnap.val();
        } catch (e) {
            console.error('Error fetching episode scores:', e);
        }
        return {};
    }

    /**
     * Listen to real-time chat messages for a specific episode in a league
     */
    subscribeChat(leagueId, episodeNum, callback) {
        if (!this.db) return () => {};
        
        // Multi-league path with legacy fallback path
        const ref = this.db.ref(`leagues/${leagueId}/chat/episode-${episodeNum}`);
        const listener = ref.on('value', snap => {
            if (snap.exists()) {
                callback(snap.val());
            } else {
                // Fallback to legacy global chat node if empty
                this.db.ref(`chat/episode-${episodeNum}`).once('value').then(legacySnap => {
                    callback(legacySnap.val() || {});
                });
            }
        });

        return () => ref.off('value', listener);
    }

    /**
     * Post a new message to episode chat
     */
    async sendChatMessage(leagueId, episodeNum, messageData) {
        if (!this.db) return null;
        const msgRef = this.db.ref(`leagues/${leagueId}/chat/episode-${episodeNum}`).push();
        await msgRef.set({
            ...messageData,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        // Also mirror to legacy path for backward compatibility
        if (leagueId === 'main-league-2026') {
            await this.db.ref(`chat/episode-${episodeNum}/${msgRef.key}`).set({
                ...messageData,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }
        return msgRef.key;
    }

    /**
     * Save episode contestant points
     */
    async saveEpisodeScores(seasonId, episodeNum, scoresData) {
        if (!this.db) return false;
        await this.db.ref(`episodeScores/${seasonId}/episode-${episodeNum}`).set(scoresData);
        // Also update legacy node for backward compatibility
        await this.db.ref(`episodeScores/episode-${episodeNum}`).set(scoresData);
        return true;
    }

    /**
     * Subscribe to real-time draftState updates
     */
    subscribeDraftState(leagueId, seasonId, callback) {
        if (!this.db) return () => {};
        const ref = this.db.ref(`leagues/${leagueId}/seasons/${seasonId}/draftState`);
        const listener = ref.on('value', snap => {
            callback(snap.val() || null);
        });
        return () => ref.off('value', listener);
    }

    /**
     * Update draftState object in database
     */
    async updateDraftState(leagueId, seasonId, draftState) {
        if (!this.db) return false;
        await this.db.ref(`leagues/${leagueId}/seasons/${seasonId}/draftState`).set(draftState);
        return true;
    }
}

