const admin = require("firebase-admin");
const serviceAccount = require("./firebaseadminsdk.json"); // Import the JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-c2749.firebaseio.com" // Update if using Realtime Database
});

module.exports = admin;
