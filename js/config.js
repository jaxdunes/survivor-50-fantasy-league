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

const AVAILABLE_LEAGUES = {
    'jackson-ryan-league': {
        id: 'jackson-ryan-league',
        name: 'Jackson / Ryan League',
        teams: [
            { id: 'austin', name: 'Austin', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
            { id: 'sandra', name: 'Sandra', color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-50', textColor: 'text-green-700' },
            { id: 'ashlynn', name: 'Ashlynn', color: 'from-red-500 to-rose-600', bgColor: 'bg-red-50', textColor: 'text-red-700' },
            { id: 'jackson-ray', name: 'Jackson/Ray', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
            { id: 'maura', name: 'Maura', color: 'from-pink-500 to-fuchsia-600', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
            { id: 'ryan-jordan', name: 'Ryan/Jordan', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-700' }
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
        ]
    }
};

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
    window.location.href = url.toString();
}

/**
 * Get active season ID (defaults to season-51)
 */
function getActiveSeasonId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('season') || DEFAULT_SEASON_ID;
}
