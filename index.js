const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Send notification when new chat message is posted
exports.sendChatNotification = functions.database.ref('/chat/episode-{episodeNum}/{messageId}')
    .onCreate(async (snapshot, context) => {
        const message = snapshot.val();
        const episodeNum = context.params.episodeNum;
        
        console.log('New chat message:', message);
        
        // Get all users
        const usersSnapshot = await admin.database().ref('users').once('value');
        const users = usersSnapshot.val();
        
        if (!users) {
            console.log('No users found');
            return null;
        }
        
        // Build list of tokens to send to
        const tokens = [];
        
        for (const userId in users) {
            const user = users[userId];
            
            // Skip if no FCM token
            if (!user.fcmToken) {
                console.log('User', userId, 'has no FCM token');
                continue;
            }
            
            // Skip if user sent the message
            if (user.username === message.username) {
                console.log('Skipping message sender:', user.username);
                continue;
            }
            
            // Check if user wants chat notifications
            const prefs = user.notificationPrefs || {};
            if (prefs.chatMessage === false) {
                console.log('User', user.username, 'disabled chat notifications');
                continue;
            }
            
            // Check if user has watched this episode (don't spoil!)
            if (!user.watchedEpisodes || !user.watchedEpisodes[episodeNum]) {
                console.log('User', user.username, 'hasn\'t watched episode', episodeNum, '- skipping');
                continue;
            }
            
            tokens.push(user.fcmToken);
        }
        
        if (tokens.length === 0) {
            console.log('No users to notify');
            return null;
        }
        
        console.log('Sending notification to', tokens.length, 'users');
        
        // Send notification
        const payload = {
            notification: {
                title: '💬 Survivor 50 Chat',
                body: `${message.username}: ${message.text.substring(0, 100)}`,
            },
            data: {
                type: 'chat',
                episode: episodeNum,
                messageId: context.params.messageId
            }
        };
        
        try {
            const response = await admin.messaging().sendToDevice(tokens, payload);
            console.log('Successfully sent notification');
            console.log('Success count:', response.successCount);
            console.log('Failure count:', response.failureCount);
            
            // Clean up invalid tokens
            if (response.failureCount > 0) {
                const updates = {};
                response.results.forEach((result, index) => {
                    if (result.error) {
                        console.log('Removing invalid token:', result.error.code);
                        // Find user with this token and remove it
                        for (const userId in users) {
                            if (users[userId].fcmToken === tokens[index]) {
                                updates[`users/${userId}/fcmToken`] = null;
                            }
                        }
                    }
                });
                
                if (Object.keys(updates).length > 0) {
                    await admin.database().ref().update(updates);
                }
            }
            
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
            return null;
        }
    });

// Send notification when episode is marked as watched
exports.sendEpisodeWatchedNotification = functions.database.ref('/users/{userId}/watchedEpisodes/{episodeNum}')
    .onCreate(async (snapshot, context) => {
        const userId = context.params.userId;
        const episodeNum = context.params.episodeNum;
        
        // Get the user who watched
        const userSnapshot = await admin.database().ref(`users/${userId}`).once('value');
        const user = userSnapshot.val();
        
        if (!user) {
            console.log('User not found');
            return null;
        }
        
        console.log(`${user.username} watched episode ${episodeNum}`);
        
        // Get all other users
        const usersSnapshot = await admin.database().ref('users').once('value');
        const users = usersSnapshot.val();
        
        if (!users) {
            console.log('No users found');
            return null;
        }
        
        const tokens = [];
        
        for (const otherUserId in users) {
            if (otherUserId === userId) continue; // Skip the user who watched
            
            const otherUser = users[otherUserId];
            
            if (!otherUser.fcmToken) {
                console.log('User', otherUserId, 'has no FCM token');
                continue;
            }
            
            const prefs = otherUser.notificationPrefs || {};
            if (prefs.episodeWatched === false) {
                console.log('User', otherUser.username, 'disabled episode notifications');
                continue;
            }
            
            tokens.push(otherUser.fcmToken);
        }
        
        if (tokens.length === 0) {
            console.log('No users to notify');
            return null;
        }
        
        console.log('Sending notification to', tokens.length, 'users');
        
        const payload = {
            notification: {
                title: '📺 Survivor 50',
                body: `${user.username} watched Episode ${episodeNum}`,
            },
            data: {
                type: 'episode-watched',
                episode: episodeNum,
                username: user.username
            }
        };
        
        try {
            const response = await admin.messaging().sendToDevice(tokens, payload);
            console.log('Successfully sent notification');
            console.log('Success count:', response.successCount);
            console.log('Failure count:', response.failureCount);
            
            // Clean up invalid tokens
            if (response.failureCount > 0) {
                const updates = {};
                response.results.forEach((result, index) => {
                    if (result.error) {
                        console.log('Removing invalid token:', result.error.code);
                        for (const otherUserId in users) {
                            if (users[otherUserId].fcmToken === tokens[index]) {
                                updates[`users/${otherUserId}/fcmToken`] = null;
                            }
                        }
                    }
                });
                
                if (Object.keys(updates).length > 0) {
                    await admin.database().ref().update(updates);
                }
            }
            
            return response;
        } catch (error) {
            console.error('Error sending notification:', error);
            return null;
        }
    });
