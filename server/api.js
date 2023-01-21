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

// router.get("/shared-classes", (req, res) => {

// });

// router.get("/menus", (req, res) => {

// });

// router.get("/shared-dining", (req, res) => {

// });

router.get("/events", (req, res) => {
  console.log("hi");
  res.send({ msg: "hi" });
});

// router.get("/add-event", (req, res) => {

// });

// router.get("/my-events", (req, res) => {

// });

// router.get("/profile/{}", (req, res) => {

// });

// router.get("/friends", (req, res) => {

// });

// router.get("/preferences", (req, res) => {

// });

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
