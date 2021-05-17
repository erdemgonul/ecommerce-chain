//firebase stuff
const firebaseAdmin = require("firebase-admin");
const serviceAccount = require("../../firebase.json");

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
});

module.exports = firebaseAdmin;
