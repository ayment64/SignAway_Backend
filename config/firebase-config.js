var admin = require("firebase-admin");

var serviceAccount = require("./signaway-a4524-firebase-adminsdk-go4y8-ace6dab5ee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://signaway-a4524.firebaseio.com"
});

module.exports.admin = admin;