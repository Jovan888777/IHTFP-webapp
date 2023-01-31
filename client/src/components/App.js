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

//web scraping

//For posting the dining menus 1am every day
/*window.setInterval(function() {
  let date = new Date(); // Date Now
  if(date.getHours() === 8 && date.getMinutes() === 0) {
    console.log("posting dining menus");
  }
}, 600000); // Repeat every 60000 milliseconds (1 minute)*/

const App = (props) => {
  const [userId, setUserId] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [eventInfo, setEventInfo] = useState(undefined);
  const [menu, setMenu] = useState(undefined);

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
    console.log(`Logged in as ${decodedCredential.name}`);
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
    console.log("went inside");
    console.log(element);
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
    console.log("handling");
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
    navigate("/add-event/");
  };

  //This is for navigateing to a new friend profile and seeing mutual friends
  const handleProfile = (profileId, userId) => {
    let path = "/profile/" + profileId;
    navigate(path, (userId = { userId }));
  };

  const menuURLs = [
    "https://mit.cafebonappetit.com/cafe/the-howard-dining-hall-at-maseeh/",
    "https://mit.cafebonappetit.com/cafe/simmons/",
    "https://mit.cafebonappetit.com/cafe/next/",
    "https://mit.cafebonappetit.com/cafe/new-vassar/",
    "https://mit.cafebonappetit.com/cafe/mccormick/",
    "https://mit.cafebonappetit.com/cafe/baker/",
  ];

  //getting the menus from the webscraping
  const handleMenu = (url) => {
    get("/api/scrape", { url: url })
      .then((cont) => {
        cleanMenu(cont);
        console.log("successfully scraped menu");
      })
      .catch((err) => console.log("failed at scraping " + url + ": " + err));
  };

  //cleaning the menus from webscraping for posting event
  const cleanMenu = (cont) => {
    let Dininghall = {
      breakfast: [],
      lunch: [],
      dinner: [],
      lateNight: [],
    };

    if (cont.length === 2) {
      Dininghall.breakfast = cont[0];
      Dininghall.dinner = cont[1];
    }

    let request = {
      nextb: [],
      nextd: [],
      maseehb: Dininghall.breakfast,
      maseehl: [],
      maseehd: Dininghall.dinner,
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
    };
    
    console.log(request);
    post("/api/add-menus", request)
      .then(console.log("menu added successfully"))
      .catch((err) => console.log("failed to add the menu: " + err));
  };

  const allMenus = () => {
    ///// UNCOMMENT BELOW WHEN ALL LINK SCRAPPING IS READY
    for (let url of menuURLs) {
      handleMenu(url);
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
          <AutomaticCourseRoad path="/automatic-course-road/" userId={userId} isHome={false} />
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
