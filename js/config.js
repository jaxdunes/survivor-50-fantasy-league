/**
 * Firebase & Application Configuration
 */

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAls1zpuUGgNx7xhlpCjF4bDEXp8qfxQ3A",
    authDomain: "survivorfantasy-cc908.firebaseapp.com",
    databaseURL: "https://survivorfantasy-cc908-default-rtdb.firebaseio.com",
    projectId: "survivorfantasy-cc908",
    storageBucket: "survivorfantasy-cc908.firebasestorage.app",
    messagingSenderId: "401357232113",
    appId: "1:401357232113:web:a9980c49bde38ff981d650"
};

const DEFAULT_SEASON_ID = "season-51";
const DEFAULT_LEAGUE_ID = "jackson-ryan-league";

var AVAILABLE_LEAGUES = {
    'jackson-ryan-league': {
        id: 'jackson-ryan-league',
        name: 'Jackson / Ryan League',
        teams: [
            { id: 'jackson', name: 'Jackson', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
            { id: 'ray', name: 'Ray', color: 'from-indigo-500 to-blue-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
            { id: 'ryan', name: 'Ryan', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
            { id: 'jordan', name: 'Jordan', color: 'from-teal-500 to-cyan-600', bgColor: 'bg-teal-50', textColor: 'text-teal-700' },
            { id: 'maura-will', name: 'Maura & Will', color: 'from-pink-500 to-fuchsia-600', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
            { id: 'austin', name: 'Austin', color: 'from-blue-500 to-sky-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
            { id: 'sandra', name: 'Sandra', color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' }
        ],
        seasons: [
            { 
                id: 'season-51', 
                name: 'Season 51: Open Era', 
                status: 'current', 
                label: 'Season 51',
                teams: [
                    { id: 'jackson', name: 'Jackson', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
                    { id: 'ray', name: 'Ray', color: 'from-indigo-500 to-blue-600', bgColor: 'bg-indigo-50', textColor: 'text-indigo-700' },
                    { id: 'ryan', name: 'Ryan', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
                    { id: 'jordan', name: 'Jordan', color: 'from-teal-500 to-cyan-600', bgColor: 'bg-teal-50', textColor: 'text-teal-700' },
                    { id: 'maura-will', name: 'Maura & Will', color: 'from-pink-500 to-fuchsia-600', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
                    { id: 'austin', name: 'Austin', color: 'from-blue-500 to-sky-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
                    { id: 'sandra', name: 'Sandra', color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' }
                ]
            },
            { 
                id: 'season-50', 
                name: 'Season 50: In the Hands of the Gods', 
                status: 'previous', 
                label: 'Season 50',
                teams: [
                    { id: 'austin', name: 'Austin', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
                    { id: 'sandra', name: 'Sandra', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', textColor: 'text-green-700' },
                    { id: 'ashlynn', name: 'Ashlynn', color: 'from-red-500 to-rose-600', bgColor: 'bg-red-50', textColor: 'text-red-700' },
                    { id: 'jackson-ray', name: 'Jackson/Ray', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
                    { id: 'maura', name: 'Maura', color: 'from-pink-500 to-fuchsia-600', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
                    { id: 'ryan-jordan', name: 'Ryan/Jordan', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' }
                ]
            }
        ]
    },
    'jordan-denver-league': {
        id: 'jordan-denver-league',
        name: 'Jordan / Denver League',
        teams: [
            { id: 'ryan', name: 'Ryan', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
            { id: 'jordan', name: 'Jordan', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
            { id: 'scott', name: 'Scott', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
            { id: 'hayley', name: 'Hayley', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
            { id: 'ashlynn', name: 'Ashlynn', color: 'from-red-500 to-rose-600', bgColor: 'bg-red-50', textColor: 'text-red-700' }
        ],
        seasons: [
            { 
                id: 'season-51', 
                name: 'Season 51: Open Era', 
                status: 'current', 
                label: 'Season 51',
                teams: [
                    { id: 'ryan', name: 'Ryan', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
                    { id: 'jordan', name: 'Jordan', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
                    { id: 'scott', name: 'Scott', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
                    { id: 'hayley', name: 'Hayley', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
                    { id: 'ashlynn', name: 'Ashlynn', color: 'from-red-500 to-rose-600', bgColor: 'bg-red-50', textColor: 'text-red-700' }
                ]
            }
        ]
    }
};

window.AVAILABLE_LEAGUES = AVAILABLE_LEAGUES;
window.LEAGUES = AVAILABLE_LEAGUES;
var LEAGUES = AVAILABLE_LEAGUES;
var firebaseInitialized = false;
window.firebaseInitialized = false;

/**
 * Initializes Firebase database connection if available
 */
function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('⚠️ Firebase SDK not loaded.');
        firebaseInitialized = false;
        window.firebaseInitialized = false;
        return null;
    }
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        firebaseInitialized = true;
        window.firebaseInitialized = true;
        console.log('🔥 Firebase initialized successfully!');
        return firebase.database();
    } catch (error) {
        console.error('Firebase initialization error:', error);
        firebaseInitialized = false;
        window.firebaseInitialized = false;
        return null;
    }
}

/**
 * Get active league ID from URL parameter or localStorage
 */
function getActiveLeagueId() {
    const urlParams = new URLSearchParams(window.location.search);
    let leagueParam = urlParams.get('league');
    
    if (!leagueParam || !AVAILABLE_LEAGUES[leagueParam]) {
        leagueParam = localStorage.getItem('survivor_active_league_id');
    }
    
    if (!AVAILABLE_LEAGUES[leagueParam]) {
        leagueParam = DEFAULT_LEAGUE_ID;
    }
    
    localStorage.setItem('survivor_active_league_id', leagueParam);
    return leagueParam;
}

/**
 * Set active league ID and update URL / localStorage
 */
function setActiveLeagueId(leagueId) {
    if (!AVAILABLE_LEAGUES[leagueId]) return;
    localStorage.setItem('survivor_active_league_id', leagueId);
    const url = new URL(window.location.href);
    url.searchParams.set('league', leagueId);
    url.searchParams.delete('season'); // Reset to default season for this league
    window.location.href = url.toString();
}

/**
 * Get active season ID for a given league (defaults to season-51)
 */
function getActiveSeasonId(leagueId) {
    const activeLeague = leagueId || getActiveLeagueId();
    const leagueConfig = AVAILABLE_LEAGUES[activeLeague] || AVAILABLE_LEAGUES[DEFAULT_LEAGUE_ID];
    const allowedSeasonIds = (leagueConfig.seasons || []).map(s => s.id);
    
    const urlParams = new URLSearchParams(window.location.search);
    let seasonParam = urlParams.get('season');
    
    if (!seasonParam || !allowedSeasonIds.includes(seasonParam)) {
        seasonParam = localStorage.getItem('survivor_active_season_id_' + activeLeague);
    }
    
    if (!seasonParam || !allowedSeasonIds.includes(seasonParam)) {
        seasonParam = DEFAULT_SEASON_ID;
    }
    
    return seasonParam;
}

/**
 * Helper: Resolve Tribe Progression Array for a Player
 */
function getPlayerTribeProgression(player) {
    if (!player) return [];
    if (player.tribeHistory && Array.isArray(player.tribeHistory) && player.tribeHistory.length > 0) {
        return player.tribeHistory;
    }
    const start = player.startingTribe || player.tribe || 'Unassigned';
    const curr = player.tribe || player.startingTribe || 'Unassigned';
    if (start !== curr && curr !== 'Unassigned') {
        return [
            { episode: 1, tribe: start, type: 'starting', label: `Starting Tribe: ${start}` },
            { episode: 2, tribe: curr, type: 'swap', label: `Swapped to ${curr}` }
        ];
    }
    return [{ episode: 1, tribe: start, type: 'starting', label: `Starting Tribe: ${start}` }];
}

/**
 * Helper: Compile Chronological Episode Timeline of Tribe Swaps & Scoring Events
 */
function getPlayerEventsTimeline(player, scores, eliminationOrder) {
    if (!player) return [];
    const timelineByEpisode = {};

    // 1. Tribe events
    const progression = getPlayerTribeProgression(player);
    progression.forEach(th => {
        const ep = th.episode || 1;
        if (!timelineByEpisode[ep]) timelineByEpisode[ep] = [];
        let icon = '🏝️';
        if (th.tribe === 'Toka') icon = '☀️';
        else if (th.tribe === 'Savu') icon = '🟣';
        else if (th.tribe === 'Exile Island') icon = '🏝️';
        else if (th.tribe === 'Cila') icon = '🔥';
        else if (th.tribe === 'Kalo') icon = '🌊';
        else if (th.tribe === 'Vatu') icon = '⚡';

        let title = th.label || `Tribe: ${th.tribe}`;
        if (th.type === 'starting') title = `Assigned to Starting Tribe: ${th.tribe}`;
        else if (th.type === 'swap') title = `🔄 Tribe Swap: Transferred to ${th.tribe} Tribe`;
        else if (th.type === 'merge') title = `🏝️ Made Merge: Joined ${th.tribe} Merge Tribe`;

        timelineByEpisode[ep].push({
            id: `tribe-${ep}-${th.tribe}`,
            type: 'tribe',
            icon: icon,
            title: title,
            tribe: th.tribe
        });
    });

    // 2. Scoring events
    const playerScores = scores && scores[player.id] ? scores[player.id] : {};
    Object.entries(playerScores).forEach(([epStr, scoreObj]) => {
        const ep = parseInt(epStr);
        if (!timelineByEpisode[ep]) timelineByEpisode[ep] = [];
        Object.entries(scoreObj || {}).forEach(([scoreId, item]) => {
            timelineByEpisode[ep].push({
                id: scoreId,
                type: 'score',
                icon: item.points >= 0 ? '🏆' : '⚠️',
                title: item.category,
                points: item.points,
                note: item.note
            });
        });
    });

    // 3. Elimination event
    if (eliminationOrder && eliminationOrder[player.id]) {
        const ep = parseInt(eliminationOrder[player.id]);
        if (!timelineByEpisode[ep]) timelineByEpisode[ep] = [];
        timelineByEpisode[ep].push({
            id: `elim-${ep}`,
            type: 'elimination',
            icon: '💀',
            title: `Voted Out / Eliminated`,
            points: -10
        });
    }

    // Sort episodes chronologically
    return Object.keys(timelineByEpisode)
        .map(Number)
        .sort((a, b) => a - b)
        .map(ep => ({
            episode: ep,
            events: timelineByEpisode[ep]
        }));
}

/**
 * Set active league AND season ID and update URL / localStorage
 */
function setActiveLeagueAndSeason(leagueId, seasonId) {
    if (!AVAILABLE_LEAGUES[leagueId]) return;
    const sId = seasonId || DEFAULT_SEASON_ID;
    localStorage.setItem('survivor_active_league_id', leagueId);
    localStorage.setItem('survivor_active_season_id_' + leagueId, sId);
    const url = new URL(window.location.href);
    url.searchParams.set('league', leagueId);
    url.searchParams.set('season', sId);
    window.location.href = url.toString();
}

