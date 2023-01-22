/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
*/

const express = require("express");

// import models
const User = require("./models/user");
const Event = require("./models/event");
const Dining = require("./models/dining");
const EventSettings = require("./models/eventsSettings");
const ClassSettings = require("./models/classSettings");
const DiningSettings = require("./models/diningSettings");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// router.get("/automatic-course-road", (req, res) => {
//   if (!req.user) {
//     // not logged in
//     return res.send({});
//   }

// });

router.get("/current-classes", (req, res) => {
  ClassSettings.find({ user_id: req.query.userid }).then((settings) =>
    res.send(settings.currentClasses)
  );
});

router.get("/menus", (req, res) => {
  Dining.find({}).then((menus) => res.send(menus));
});

router.get("/event-settings", (req, res) => {
  EventSettings.find({ user_id: req.user._id }).then((settings) => res.send(settings));
});

router.get("/class-settings", (req, res) => {
  ClassSettings.find({ user_id: req.user._id }).then((settings) => res.send(settings));
});

router.get("/dining-settings", (req, res) => {
  DiningSettings.find({ user_id: req.user._id }).then((settings) => res.send(settings));
});

router.get("/events", (req, res) => {
  Event.find({}).then((events) => res.send(events));
});

// router.post("/add-event", (req, res) => {

// });

router.get("/my-events", (req, res) => {
  Event.find({ user_id: req.user._id }).then((events) => res.send(events));
});

router.get("/profile", (req, res) => {
  User.findById(req.query.userid).then((user) => res.send(user));
});

router.get("/friends", (req, res) => {
  User.findById(req.user._id).then((user) => res.send(user.friends));
});

// router.get("/preferences", (req, res) => {

// });

// router.post("/preferences", (req, res) => {

// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
