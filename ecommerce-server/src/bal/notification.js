const firebaseAdmin = require('firebase-admin');
const userBAL = require('./user');

const self = {
    async sendNotification(title, body, imageUrl, notificationToken) {
        const message = {
            tokens: [notificationToken],
            notification: {
                title: title,
                body: body,
                imageUrl,
            },
        }

        if (Array.isArray(notificationToken)) {
            message.tokens = notificationToken;
        }

        try {
            await firebaseAdmin
                .messaging()
                .sendMulticast(message)
                .then((e) => console.log(e))
                .catch((err) => console.log(err));

            return true;
        } catch (err) {
            return false;
        }
    },

    async sendNotificationToEveryone(title, body, imageUrl) {
        try {
            // get all user's notification tokens
            const allNotificationTokens = await userBAL.getAllNotificationTokens();

            for (let token of allNotificationTokens) {
                await self.sendNotification(title, body, imageUrl, token);
            }

            return true;
        } catch (err) {
            return false;
        }
    },
};

module.exports = self;