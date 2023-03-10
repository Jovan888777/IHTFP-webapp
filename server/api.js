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
const scrape = require("./Scraper");
const schedule = require("node-schedule");

const auth = require("./auth");
const router = express.Router();
const socketManager = require("./server-socket");
const email = require("./Email");

// scheduled task. Once a day at midnight
var dailyActivities = schedule.scheduleJob("0 0 * * *", function () {
  // Reset chosen dining
  DiningSettings.find({})
    .then((settings) => {
      settings.map((setting) => {
        setting.chosen = [null, null, null, null];
        setting.save();
      });
    })
    .catch((err) => {
      console.log(`failed to update chosen meal:${err}`);
    });

  // Get rid of old events
  let now = new Date().toISOString();
  Event.find({})
    .then((events) => {
      for (let event of events) {
        if (event.start.toISOString() < now) {
          Event.deleteOne({ _id: event._id })
            .then(console.log("deleted: ", event.start))
            .catch((err) => {
              console.log(`failed to delete old event:${err}`);
            });
        }
      }
    })
    .catch((err) => {
      console.log(`failed to get all events:${err}`);
    });

  // send emails depeding on keyword preferences
  Event.find({}).then((events) => {
    let filtered;
    EventSettings.find({})
      .then((settings) => {
        settings.map((setting) => {
          User.findById(setting.user_id)
            .then((user) => {
              if (user.kerb !== "") {
                filtered = events.filter((element) => {
                  return element.keywords.some((el) => setting.keywords.includes(el));
                });
                if (user.kerb.includes("@mit.edu")) {
                  email.emailSender(user.kerb, filtered);
                } else {
                  email.emailSender(user.kerb + "@mit.edu", filtered);
                }
              }
            })
            .catch((err) => {
              console.log(`failed to get profile by id:${err}`);
            });
        });
      })
      .catch((err) => console.log(`failed to get event settings:${err}`));
  });
});

// scheduled task. On the first of Jan, Feb and June (to reset for a new semester)
const semesterlyActivities = schedule.scheduleJob("0 0 1 1,2,6 *", function () {
  // Reset classes and move current classes to completed classes
  ClassSettings.find({})
    .then((settings) => {
      settings.map((setting) => {
        setting.completedClasses = [...setting.completedClasses] + [...setting.currentClasses];
        setting.currentClasses = [];
        setting.save();
      });
    })
    .catch((err) => {
      console.log(`failed to reset classes for semester:${err}`);
    });
});

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

router.get("/users", (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => console.log(`failed to get users:${err}`));
});

router.get("/all-dining-settings", (req, res) => {
  DiningSettings.find({})
    .then((settings) => res.send(settings))
    .catch((err) => console.log(`failed to get dining settings:${err}`));
});

router.get("/all-class-settings", (req, res) => {
  ClassSettings.find({})
    .then((settings) => res.send(settings))
    .catch((err) => console.log(`failed to get class settings:${err}`));
});

router.get("/all-event-settings", (req, res) => {
  EventSettings.find({})
    .then((settings) => res.send(settings))
    .catch((err) => console.log(`failed to get event settings:${err}`));
});

router.get("/keyword-preferences", (req, res) => {
  EventSettings.findOne({ user_id: req.query.itemId })
    .then((settings) => res.send(settings.keywords))
    .catch((err) => console.log(`failed to get keyword preferences:${err}`));
});

router.get("/current-classes", (req, res) => {
  ClassSettings.findOne({ user_id: req.query.userId })
    .then((settings) => res.send(settings.currentClasses))
    .catch((err) => {
      console.log(`failed to get current classes:${err}`);
    });
});

router.get("/friend-requests", (req, res) => {
  User.findById(req.query.userId)
    .then((user) => res.send(user.requests))
    .catch((err) => {
      console.log(`failed to get friend requests:${err}`);
    });
});

router.get("/menus", (req, res) => {
  Menu.findOne({})
    .then((menus) => {
      console.log(menus);
      res.send(menus);
    })
    .catch((err) => {
      console.log(`failed to get menus:${err}`);
    });
});

router.get("/event-settings", (req, res) => {
  EventSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      res.send(settings);
    })
    .catch((err) => {
      console.log(`failed to get events settings:${err}`);
    });
});

router.get("/class-settings", (req, res) => {
  ClassSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      res.send(settings);
    })
    .catch((err) => {
      console.log(`failed to get class settings:${err}`);
    });
});

router.get("/dining-settings", (req, res) => {
  DiningSettings.findOne({ user_id: req.query.userId })
    .then((settings) => res.send(settings))
    .catch((err) => {
      console.log(`failed to get dining settings:${err}`);
    });
});

router.get("/dining-choice", (req, res) => {
  DiningSettings.findOne({ user_id: req.query.userId })
    .then((settings) => {
      res.send(settings.chosen);
    })
    .catch((err) => {
      console.log(`failed to get dining choice:${err}`);
    });
});

router.get("/events", (req, res) => {
  Event.find({})
    .then((events) => res.send(events))
    .catch((err) => {
      console.log(`failed to get all events:${err}`);
    });
});

router.get("/event-guestlist", (req, res) => {
  Event.findById(req.query.eventId)
    .then((event) => res.send(event.guests))
    .catch((err) => {
      console.log(`failed to get all event guestlist:${err}`);
    });
});

router.get("/event-keywords", (req, res) => {
  Event.findById(req.query.itemId)
    .then((event) => res.send(event.keywords))
    .catch((err) => {
      console.log(`failed to get all event keywords:${err}`);
    });
});

router.get("/my-events", (req, res) => {
  Event.find({ user_id: req.user._id })
    .then((events) => res.send(events))
    .catch((err) => {
      console.log(`failed to get my events:${err}`);
    });
});

router.get("/profile-by-id", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.query.userId)
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(`failed to get profile by id:${err}`);
    });
});

router.get("/profile-name", auth.ensureLoggedIn, (req, res) => {
  User.findOne({ _id: req.query.userId })
    .then((user) => res.send(user.name))
    .catch((err) => {
      console.log(`failed to get profile by id:${err}`);
    });
});

router.get("/profile-by-kerb", (req, res) => {
  User.find({ kerb: req.query.kerb })
    .then((user) => res.send(user))
    .catch((err) => {
      console.log(`failed to get profile by kerb:${err}`);
    });
});

router.get("/user-friends", (req, res) => {
  User.findOne({ _id: req.query.userId })
    .then((user) => res.send(user.friends))
    .catch((err) => `failed to find user friends:${err}`);
});

//////////////////// POST METHODS ////////////////////////////

//////////////////// ADDING ////////////////////////////

// add user
router.post("/add-user", auth.ensureLoggedIn, (req, res) => {
  const newUser = new User({
    name: req.body.name,
    googleid: req.body.googleid,
    kerb: "",
    pronouns: "",
    year: "",
    pic: "",
    primaryMajor: "",
    secondaryMajor: "",
    minorOne: "",
    minorTwo: "",
    concentration: "",
    friends: [],
  });

  const newDiningSettings = new DiningSettings({
    user_id: newUser._id,
    restrictions: [],
    chosen: [null, null, null, null],
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
router.post("/add-event", auth.ensureLoggedIn, (req, res) => {
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

  newEvent
    .save()
    .then((event) => {
      res.send(event);
    })
    .catch((err) => console.log("failed at adding event:" + err));
});

// add menus
router.post("/add-menus", (req, res) => {
  Menu.deleteOne({})
    .then(console.log("deleted menu successfully"))
    .catch((err) => console.log("failed at deleting menu: " + err));

  const newMenus = new Menu({
    Next: {
      breakfast: req.body.nextb,
      lunch: [],
      dinner: req.body.nextd,
      lateNight: [],
    },
    Maseeh: {
      breakfast: req.body.maseehb,
      lunch: req.body.maseehl,
      dinner: req.body.maseehd,
      lateNight: req.body.maseehln,
    },
    Simmons: {
      breakfast: req.body.simmonsb,
      lunch: [],
      dinner: req.body.simmonsd,
      lateNight: req.body.simmonsln,
    },
    McCormmick: {
      breakfast: req.body.mccormmickb,
      lunch: [],
      dinner: req.body.mccormmickd,
      lateNight: [],
    },
    NewVassar: {
      breakfast: req.body.newvassarb,
      lunch: req.body.newvassarl,
      dinner: req.body.newvassard,
      lateNight: [],
    },
    Baker: {
      breakfast: req.body.bakerb,
      lunch: [],
      dinner: req.body.bakerd,
      lateNight: [],
    },
  });

  newMenus
    .save()
    .then((event) => {
      console.log("successfully added menus!");
      res.send(event);
    })
    .catch((err) => console.log("failed at adding menus:" + err));
});

//////////////////// UPDATING ////////////////////////////

// update event details
router.post("/update-event", auth.ensureLoggedIn, (req, res) => {
  Event.findById(req.body.eventId)
    .then((event) => {
      event.name = req.body.newEvent.name;
      event.group = req.body.newEvent.group;
      event.location = req.body.newEvent.location;
      event.start = req.body.newEvent.start;
      event.end = req.body.newEvent.end;
      event.description = req.body.newEvent.description;
      event.keywords = req.body.newEvent.keywords;
      event.guestlistNeeded = req.body.newEvent.guestlistNeeded;
      event.save();
      res.send(event);
    })
    .catch((err) => {
      console.log(`failed to update event:${err}`);
    });
});

//send a friend request
router.post("/send-request", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.body.profileId)
    .then((user) => {
      console.log(user.name);
      user.requests.push(req.body.userId);
      user.save();
      res.send(user);
    })
    .catch((err) => {
      console.log(`failed to send request:${err}`);
    });
});

//accept a friends request
router.post("/accept-request", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.requests = user.requests.filter((request) => {
        return request !== req.body.profileId;
      });
      user.friends.push(req.body.profileId);
      user.save();
      res.send(user);
    })
    .catch((err) => {
      console.log(`failed to accept request:${err}`);
    });
});

//delete a friend request
router.post("/delete-request", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.body.userId)
    .then((user) => {
      user.requests = user.requests.filter((request) => {
        return request !== req.body.profileId;
      });
      user.save();
      res.send(user);
    })
    .catch((err) => {
      console.log(`failed to delete request:${err}`);
    });
});

// update event guestlist
router.post("/update-event-guestlist", auth.ensureLoggedIn, (req, res) => {
  Event.findById(req.body.eventId)
    .then((event) => {
      event.guests = req.body.guestlist;
      event.save();
      res.send(event);
    })
    .catch((err) => {
      console.log(`failed to update guestlist:${err}`);
    });
});

// update user details
router.post("/update-user", auth.ensureLoggedIn, (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      console.log(req.body.new);
      user.name = req.body.new.name;
      user.kerb = req.body.new.kerb;
      user.pronouns = req.body.new.pronouns;
      user.year = req.body.new.year;
      user.pic = req.body.new.pic;
      user.primaryMajor = req.body.new.primaryMajor;
      user.secondaryMajor = req.body.new.secondaryMajor;
      user.minorOne = req.body.new.minorOne;
      user.minorTwo = req.body.new.minorTwo;
      user.concentration = req.body.new.concentration;
      user.save();
      res.send(user);
    })
    .catch((err) => {
      console.log(`failed to update user details:${err}`);
    });
});

// update event settings
router.post("/event-settings", auth.ensureLoggedIn, (req, res) => {
  EventSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      settings.allowEmails = req.body.new.allowEmails;
      settings.keywords = req.body.new.keywords;
      settings.save();
      res.send(settings);
    })
    .catch((err) => {
      console.log(`failed to update event settings:${err}`);
    });
});

// update class settings
router.post("/class-settings", auth.ensureLoggedIn, (req, res) => {
  ClassSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      console.log(settings);
      settings.max_finals = req.body.new.max_finals;
      settings.max_units = req.body.new.max_units;
      settings.electiveClasses = req.body.new.electiveClasses;
      settings.concClasses = req.body.new.concClasses;
      settings.HASSClasses = req.body.new.HASSClasses;
      settings.CIClasses = req.body.new.CIClasses;
      settings.otherClasses = req.body.new.otherClasses;
      settings.completedClasses = req.body.new.completedClasses;
      settings.currentClasses = req.body.new.currentClasses;
      settings.save();
      res.send(settings);
    })
    .catch((err) => {
      console.log(`failed to update class settings:${err}`);
    });
});

// update dining settings
router.post("/dining-settings", auth.ensureLoggedIn, (req, res) => {
  DiningSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      settings.restrictions = req.body.new.restrictions;
      settings.rankings = req.body.new.rankings;
      settings.save();
      res.send(settings);
    })
    .catch((err) => {
      console.log(`failed to update dining settings:${err}`);
    });
});

// update chosen mean
router.post("/chosen-meal", auth.ensureLoggedIn, (req, res) => {
  DiningSettings.findOne({ user_id: req.user._id })
    .then((settings) => {
      settings.chosen = req.body.chosen;
      settings.save();
      res.send(settings);
    })
    .catch((err) => {
      console.log(`failed to update chosen meal:${err}`);
    });
});

// reset chosen dining
router.post("/reset-chosen", auth.ensureLoggedIn, (req, res) => {
  DiningSettings.find({})
    .then((settings) => {
      settings.map((setting) => {
        setting.chosen = [];
        setting.save();
      });
    })
    .catch((err) => {
      console.log(`failed to update chosen meal:${err}`);
    });
});

//////////////////// DELETING ////////////////////////////

//delete friend
router.post("/delete-friend", auth.ensureLoggedIn, (req, res) => {
  console.log("delete");
  User.findById(req.body.userId)
    .then((user) => {
      console.log(req.body.userId, req.body.profileId);
      user.friends = user.friends.filter((request) => {
        return request !== req.body.profileId;
      });
      user.save();
    })
    .catch((err) => {
      console.log(`failed to deleted friend:${err}`);
      res.send(false);
    });
});

// delete event
router.post("/delete-event", auth.ensureLoggedIn, (req, res) => {
  Event.deleteOne({ _id: req.body.eventId })
    .then(() => {
      console.log("successfully deleted event");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted event:${err}`);
      res.send(false);
    });
});

// delete user (and their settings)
router.post("/delete-user", auth.ensureLoggedIn, (req, res) => {
  User.deleteOne({ _id: req.user._id })
    .then(() => {
      console.log("successfully deleted user");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted user:${err}`);
      res.send(false);
    });
  EventSettings.deleteOne({ user_id: req.user._id })
    .then(() => {
      console.log("successfully deleted event settings");
    })
    .catch((err) => {
      console.log(`failed to deleted event settings:${err}`);
    });
  DiningSettings.deleteOne({ user_id: req.user._id })
    .then(() => {
      console.log("successfully deleted dining settings");
    })
    .catch((err) => {
      console.log(`failed to deleted dining settings:${err}`);
    });
  ClassSettings.deleteOne({ user_id: req.user._id })
    .then(() => {
      console.log("successfully deleted class settings");
    })
    .catch((err) => {
      console.log(`failed to deleted class settings:${err}`);
    });
});

// clear all the database (USE CAREFULLY)
router.post("/delete-everything", (req, res) => {
  User.deleteMany({})
    .then(() => {
      console.log("successfully deleted users");
    })
    .catch((err) => {
      console.log(`failed to deleted users:${err}`);
    });
  Event.deleteMany({})
    .then(() => {
      console.log("successfully deleted events");
    })
    .catch((err) => {
      console.log(`failed to deleted events:${err}`);
    });
  Menu.deleteMany({})
    .then(() => {
      console.log("successfully deleted menu");
    })
    .catch((err) => {
      console.log(`failed to deleted menu:${err}`);
    });
  EventSettings.deleteMany({})
    .then(() => {
      console.log("successfully deleted event settings");
    })
    .catch((err) => {
      console.log(`failed to deleted event settings:${err}`);
    });
  DiningSettings.deleteMany({})
    .then(() => {
      console.log("successfully deleted dining settings");
    })
    .catch((err) => {
      console.log(`failed to deleted dining settings:${err}`);
    });
  ClassSettings.deleteMany({})
    .then(() => {
      console.log("successfully deleted class settings");
    })
    .catch((err) => {
      console.log(`failed to deleted class settings:${err}`);
    });
});

// delete all events
router.post("/delete-events", auth.ensureLoggedIn, (req, res) => {
  Event.deleteMany({})
    .then(() => {
      console.log("successfully deleted events");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted events:${err}`);
      res.send(false);
    });
});

// delete all menus
router.post("/delete-menus", auth.ensureLoggedIn, (req, res) => {
  Menu.deleteMany({})
    .then(() => {
      console.log("successfully deleted menus");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted menus:${err}`);
      res.send(false);
    });
});

// delete dining settings
router.post("/delete-dining-settings", auth.ensureLoggedIn, (req, res) => {
  DiningSettings.deleteOne({ user_id: req.user._id })
    .then(() => {
      console.log("successfully deleted dining settings");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted dining settings:${err}`);
      res.send(false);
    });
});

// delete class settings
router.post("/delete-class-settings", auth.ensureLoggedIn, (req, res) => {
  ClassSettings.deleteOne({ user_id: req.user._id })
    .then(() => {
      console.log("successfully deleted class settings");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted class settings:${err}`);
      res.send(false);
    });
});

// delete event settings
router.post("/delete-event-settings", auth.ensureLoggedIn, (req, res) => {
  EventSettings.deleteOne({ user_id: req.user._id })
    .then(() => {
      console.log("successfully deleted event settings");
      res.send(true);
    })
    .catch((err) => {
      console.log(`failed to deleted event settings:${err}`);
      res.send(false);
    });
});

//scraping api
router.get("/scrape", (req, res) => {
  scrape
    .scrapeProduct(req.query.url)
    .then((cont) => {
      console.log("successfully scraped menu");
      res.send(cont);
    })
    .catch((err) => {
      console.log(`failed to scrape menu:${err}`);
      res.send(false);
    });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
