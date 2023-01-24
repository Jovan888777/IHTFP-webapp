/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
*/

const express = require("express");

// import models
const User = require("./models/user");
const Event = require("./models/event");
const Menu = require("./models/dining");
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

//////////////////// GET METHODS ////////////////////////////

// router.get("/course-details", (req, res) => {
// for MIT API
// });

router.get("/current-classes", (req, res) => {
  ClassSettings.findOne({ user_id: req.query.userid }).then((settings) =>
    res.send(settings.currentClasses)
  );
});

router.get("/menus", (req, res) => {
  Menu.find({}).then((menus) => res.send(menus));
});

router.get("/event-settings", (req, res) => {
  EventSettings.findOne({ user_id: req.user._id }).then((settings) => res.send(settings));
});

router.get("/class-settings", (req, res) => {
  ClassSettings.findOne({ user_id: req.user._id }).then((settings) => res.send(settings));
});

router.get("/dining-settings", (req, res) => {
  DiningSettings.findOne({ user_id: req.user._id }).then((settings) => res.send(settings));
});

router.get("/dining-choice", (req, res) => {
  DiningSettings.findOne({ user_id: req.user._id }).then((settings) => res.send(settings.choice));
});

router.get("/events", (req, res) => {
  Event.find({}).then((events) => res.send(events));
});

router.get("/my-events", (req, res) => {
  Event.find({ user_id: req.user._id }).then((events) => res.send(events));
});

router.get("/profile", (req, res) => {
  User.findById(req.query.userid).then((user) => res.send(user));
});

router.get("/friends", (req, res) => {
  User.findById(req.query.userid).then((user) => res.send(user.friends));
});

//////////////////// POST METHODS ////////////////////////////

// add user
router.post("/add-user", (req, res) => {
  const newUser = new User({
    name: req.body.name,
    googleid: req.body.googleid,
    kerb: req.body.kerb,
    pronouns: req.body.pronouns,
    year: req.body.year,
    pic: req.body.pic,
    primaryMajor: req.body.primaryMajor,
    secondaryMajor: req.body.secondaryMajor,
    minorOne: req.body.minorOne,
    minorTwo: req.body.minorTwo,
    concentration: req.body.concentration,
    friends: req.body.friends,
  });

  const newDiningSettings = new DiningSettings({
    user_id: newUser._id,
    restrictions: [],
    chosen: [null, null, null],
    rankings: ["Next", "Simmons", "Maseeh", "McCormmick", "New Vassar", "Baker"],
  });

  const newClassSettings = new ClassSettings({
    user_id: newUser._id,
    max_finals: 4,
    max_units: 48,
    electiveClasses: [],
    concClasses: [],
    HASSClasses: [],
    CIClasses: [],
    otherClasses: [],
    completedClasses: [],
    currentClasses: [],
  });

  const newEventSettings = new EventSettings({
    user_id: newUser._id,
    allowEmails: true,
    keywords: [],
  });

  newDiningSettings
    .save()
    .then(() => console.log("successfully added dining settings"))
    .catch(() => console.log("failed to add dining settings"));
  newClassSettings
    .save()
    .then(() => console.log("successfully added class settings"))
    .catch(() => console.log("failed to add class settings"));
  newEventSettings
    .save()
    .then(() => console.log("successfully added event settings"))
    .catch(() => console.log("failed to add event settings"));
  newUser
    .save()
    .then(() => console.log("successfully added user"))
    .then((user) => res.send(user))
    .catch(() => console.log("failed to add user"));
});

// add event
router.post("/add-event", (req, res) => {
  const newEvent = new Event({
    user_id: req.user._id,
    name: req.body.name,
    group: req.body.group,
    location: req.body.location,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description,
    keywords: req.body.keywords,
    guestlistNeeded: req.body.guestlistNeeded,
    guests: [],
  });

  newEvent.save().then((event) => res.send(event));
});

// update event details
router.post("/update-event", (req, res) => {
  Event.findById(req.body.eventId)
    .then((event) => {
      event = req.body.newEvent;
      event.save();
    })
    .then((event) => res.send(event));
});

// update user details
router.post("/update-user", (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      user = req.body.newUser;
      user.save();
    })
    .then((user) => res.send(user));
});

// update event settings
router.post("/event-settings", (req, res) => {
  EventSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      settings = req.body.newSettings;
      settings.save();
    })
    .then((settings) => res.send(settings));
});

// update class settings
router.post("/class-settings", (req, res) => {
  ClassSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      settings = req.body.newSettings;
      settings.save();
    })
    .then((settings) => res.send(settings));
});

// update dining settings
router.post("/dining-settings", (req, res) => {
  DiningSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      settings = req.body.newSettings;
      settings.save();
    })
    .then((settings) => res.send(settings));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
