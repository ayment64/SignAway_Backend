const express = require("express");
const router = express.Router();
var admin = require("firebase-admin");

var serviceAccount = require("../../config/signaway-a4524-firebase-adminsdk-go4y8-ace6dab5ee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://signaway-a4524.firebaseio.com",
});

module.exports.admin = admin;
router.post("/", (req, res) => {
  const registrationToken = req.body.registrationToken;
  const message = req.body.message;

  admin
    .messaging()
    .sendToDevice(registrationToken, message)
    .then((response) => {
      res.status(200).send("Notification sent successfully");
    })
    .catch((error) => {
      console.log(error);
    });
});
module.exports = router;
