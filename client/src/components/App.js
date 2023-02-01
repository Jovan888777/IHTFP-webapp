import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";
import { Link, navigate } from "@reach/router";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import Schedule from "react-schedule-job";

// CSS Files
import "../utilities.css";
import "./App.css";

// Modules
import NavBar from "./modules/NavBar.js";

// Pages
import Home from "./pages/Home.js";
import AddEvent from "./pages/AddEvent.js";
import ViewEvent from "./pages/ViewEvent.js";
import MyEvents from "./pages/MyEvents.js";
import AutomaticCourseRoad from "./pages/AutomaticCourseRoad.js";
import SharedClasses from "./pages/SharedClasses.js";
import GeneralDining from "./pages/GeneralDining.js";
import SharedDining from "./pages/SharedDining.js";
import Profile from "./pages/Profile.js";
import Friends from "./pages/Friends.js";
import Preferences from "./pages/Preferences.js";
import NotFound from "./pages/NotFound.js";

/**
 * Define the "App" component
 */

const App = (props) => {
  const [userId, setUserId] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [eventInfo, setEventInfo] = useState(undefined);

  const [menu, setMenu] = useState({
    nextb: [],
    nextd: [],
    maseehb: [],
    maseehl: [],
    maseehd: [],
    maseehln: [],
    simmonsb: [],
    simmonsd: [],
    simmonsln: [],
    mccormmickb: [],
    mccormmickd: [],
    newvassarb: [],
    newvassarl: [],
    newvassard: [],
    bakerb: [],
    bakerd: [],
  });

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
        setUserName(user.name);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    // console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      setUserName(user.name);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    setUserName(undefined);
    post("/api/logout");
  };

  const handleEditing = (element) => {
    setEventInfo({
      eventId: element._id,
      userId: element.user_id,
      eventName: element.name,
      eventGroup: element.group,
      eventDescription: element.description,
      eventStart: element.start,
      eventEnd: element.end,
      eventKeywords: element.keywords,
      eventGuestlistNeeded: element.guestlistNeeded,
      eventLocation: element.location,
    });
    navigate("/add-event/");
  };

  const handleAddEvent = () => {
    setEventInfo({
      eventId: null,
      eventName: "",
      eventGroup: "",
      eventDescription: "",
      eventStart: false,
      eventEnd: false,
      eventKeywords: [],
      eventGuestlistNeeded: false,
      eventLocation: "",
    });
    navigate("/add-event/", { ...eventInfo });
  };

  //This is for navigateing to a new friend profile and seeing mutual friends
  const handleProfile = (profileId, userId) => {
    let path = "/profile/" + profileId;
    navigate(path, (userId = { userId }));
  };

  const menuURLs = [
    {
      url: "https://mit.cafebonappetit.com/cafe/the-howard-dining-hall-at-maseeh/",
      diningHall: "maseeh",
    },
    { url: "https://mit.cafebonappetit.com/cafe/simmons/", diningHall: "simmons" },
    { url: "https://mit.cafebonappetit.com/cafe/next/", diningHall: "next" },
    { url: "https://mit.cafebonappetit.com/cafe/new-vassar/", diningHall: "new-vassar" },
    { url: "https://mit.cafebonappetit.com/cafe/mccormick/", diningHall: "mccormick" },
    { url: "https://mit.cafebonappetit.com/cafe/baker/", diningHall: "baker" },
  ];

  //getting the menus from the webscraping
  const handleMenu = (url, diningHall) => {
    get("/api/scrape", { url: url })
      .then((cont) => {
        cleanMenu(cont, diningHall);
      })
      .catch((err) => console.log("failed at scraping " + url + ": " + err));
  };

  //posting the menus
  const updateMenu = () => {
    post("/api/add-menus", menu).catch((err) => console.log("failed to add the menu: " + err));
  };

  //cleaning the menus from webscraping for posting event
  const cleanMenu = (content, diningHall) => {
    //console.log(content, diningHall);
    if (diningHall === "maseeh") {
      menu["maseehb"] = content.Breakfast;
      menu["maseehl"] = content.Lunch;
      menu["maseehd"] = content.Dinner;
      menu["maseehln"] = content.lateNight;
    } else if (diningHall === "simmons") {
      menu["simmonsb"] = content.Breakfast;
      menu["simmonsd"] = content.Dinner;
      menu["simmonsln"] = content.lateNight;
    } else if (diningHall === "newvassar") {
      menu["newvassarb"] = content.Breakfast;
      menu["newvassarl"] = content.Lunch;
      menu["newvassard"] = content.Dinner;
    } else if (diningHall === "next") {
      menu["nextb"] = content.Breakfast;
      menu["nextd"] = content.Dinner;
    } else if (diningHall === "mccormick") {
      menu["mccormickb"] = content.Breakfast;
      menu["mccormickd"] = content.Dinner;
    } else if (diningHall === "baker") {
      menu["bakerb"] = content.Breakfast;
      menu["bakerd"] = content.Dinner;
    }
    updateMenu();
  };

  const allMenus = () => {
    ///// UNCOMMENT BELOW WHEN ALL LINK SCRAPPING IS READY
    for (let element of menuURLs) {
      handleMenu(element.url, element.diningHall);
    }
  };

  // scheduled updating of the menu once a day at midnight UTC time
  ///////////////// FIGURE OUT WHAT TIME THEY UPDATE THEIR MENUS!
  const jobs = [
    {
      fn: allMenus,
      id: "1",
      schedule: "0 0 * * *",
    },
  ];

  if (!userId) {
    return (
      <div>
        <Schedule
          jobs={jobs}
          timeZone="UTC"
          dashboard={{
            hidden: true, // dashboard is hidden
          }}
        />
        <Home
          className="bgImg"
          path="/"
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          userId={userId}
          isHome={true}
        />
      </div>
    );
  } else {
    return (
      <>
        <Schedule
          jobs={jobs}
          timeZone="UTC"
          dashboard={{
            hidden: true, // dashboard is hidden
          }}
        />
        <NavBar
          userId={userId}
          googleLogout={googleLogout}
          handleLogout={handleLogout}
          handleAddEvent={handleAddEvent}
        />
        <Router className="bg">
          <Home
            path="/"
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            userId={userId}
            isHome={true}
          />
          <AddEvent path="/add-event/" userId={userId} {...eventInfo} isHome={false} />
          <ViewEvent path="/events/" userId={userId} isHome={false} />
          <MyEvents
            path="/my-events/"
            userId={userId}
            handleEditing={handleEditing}
            isHome={false}
          />
          <SharedClasses path="/shared-classes/" userId={userId} isHome={false} />
          <GeneralDining path="/menus/" userId={userId} isHome={false} />
          <SharedDining path="/shared-dining/" userId={userId} userName={userName} isHome={false} />
          <Profile path="/profile/:profileId" userId={userId} isHome={false} />
          <Friends path="/friends/" userId={userId} handleProfile={handleProfile} isHome={false} />
          <Preferences path="/preferences/" userId={userId} isHome={false} />
          <NotFound default />
        </Router>
      </>
    );
  }
};

export default App;
