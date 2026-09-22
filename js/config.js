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
const DEFAULT_LEAGUE_ID = "main-league-2026";

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
    const leagueParam = urlParams.get('league');
    
    if (leagueParam) {
        localStorage.setItem('survivor_active_league_id', leagueParam);
        return leagueParam;
    }
    
    return localStorage.getItem('survivor_active_league_id') || DEFAULT_LEAGUE_ID;
}

/**
 * Set active league ID and update URL / localStorage
 */
function setActiveLeagueId(leagueId) {
    localStorage.setItem('survivor_active_league_id', leagueId);
    const url = new URL(window.location.href);
    url.searchParams.set('league', leagueId);
    window.location.href = url.toString();
}

/**
 * Get active season ID (defaults to season-50)
 */
function getActiveSeasonId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('season') || DEFAULT_SEASON_ID;
}
