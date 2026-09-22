/**
 * Pure Scoring Engine for Survivor Fantasy League
 */

const DEFAULT_SCORING_RULES = {
    immunityWinIndiv: 15,
    immunityWinTribe: 5,
    rewardWinIndiv: 10,
    rewardWinTribe: 3,
    idolFound: 10,
    advantageFound: 5,
    survivedTribal: 2,
    confessional: 1,
    individualImmunityPlayed: 5,
    successfulIdolPlay: 10
};

/**
 * Calculates total points earned by a single contestant across all episodes
 * @param {string} contestantId 
 * @param {Object} episodeScores - Episode score records mapped by episode key (e.g., ep01)
 * @returns {number}
 */
function calculateContestantTotal(contestantId, episodeScores = {}) {
    let total = 0;
    
    Object.values(episodeScores).forEach(episode => {
        if (episode && episode[contestantId]) {
            const stats = episode[contestantId];
            if (typeof stats === 'number') {
                total += stats;
            } else if (typeof stats === 'object') {
                total += (stats.totalPoints || 0);
            }
        }
    });
    
    return total;
}

/**
 * Calculates total points earned by a league user based on their drafted roster
 * @param {Array<string>} draftedContestantIds 
 * @param {Object} episodeScores 
 * @returns {number}
 */
function calculateUserScore(draftedContestantIds = [], episodeScores = {}) {
    return draftedContestantIds.reduce((sum, contestantId) => {
        return sum + calculateContestantTotal(contestantId, episodeScores);
    }, 0);
}

/**
 * Calculates ranked leaderboard for all members of a league
 * @param {Object} members - Map of userId => { displayName, avatar }
 * @param {Object} drafts - Map of userId => [contestantId1, contestantId2]
 * @param {Object} episodeScores - Map of episode scores
 * @returns {Array<Object>} Sorted list of members with scores and rankings
 */
function calculateLeaderboard(members = {}, drafts = {}, episodeScores = {}) {
    const leaderboard = Object.keys(members).map(userId => {
        const member = members[userId] || {};
        const userDraft = drafts[userId] || [];
        const score = calculateUserScore(userDraft, episodeScores);
        
        return {
            userId,
            displayName: member.displayName || member.username || 'Anonymous',
            score,
            draftCount: userDraft.length,
            drafts: userDraft
        };
    });
    
    // Sort descending by score
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Assign rank
    return leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1
    }));
}
