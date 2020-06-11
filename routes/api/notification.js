const express = require("express");
const router = express.Router();
const Message = require("../../models/Message");
var admin = require("firebase-admin");
const Profile = require("../../models/Profile");

var serviceAccount = require("../../config/signaway-a4524-firebase-adminsdk-go4y8-ace6dab5ee.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://signaway-a4524.firebaseio.com",
});

module.exports.admin = admin;
router.post("/", async (req, res)  => {
  const registrationToken = req.body.registrationToken;
  const messages = req.body.message;
  const {
    user,
    message,
  }= req.body;
  const notif = {};
  notif.user = user;
  notif.message = message;
  notification = new Message(notif);
  await notification.save();
  console.log(notif.message.notification.body);
  if(notif.message.notification.body=="accepted"){
    Profile.findOneAndUpdate({ user: user },{authorization: "accepted"},function(err, d) {
      if(err) console.log(err);
      console.log(d);
  });
  }else if(notif.message.notification.body == "denied"){
    Profile.findOneAndUpdate({ user: user },{authorization: "denied"},function(err, d) {
      if(err) console.log(err);
      console.log(d);
  });
  }

  admin
    .messaging()
    .sendToDevice(registrationToken, messages)
    .then((response) => {
      res.status(200).send("Notification sent successfully");
    })
    .catch((error) => {
      console.log(error);
    });
});
router.get("/getAllNotifs/:param", async (req, res) => {
  try {

    console.log(req.params.param);
    let notifications = await Message.find({ user: req.params.param }).populate("user").lean();
    if (user) {
      return res.json(notifications);
    } else {
      res.send(["there are no notifications"]);
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error);
  }
});
module.exports = router;
