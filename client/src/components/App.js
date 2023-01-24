import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";
import { Link, navigate } from "@reach/router";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

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
  const [eventInfo, setEventInfo] = useState(undefined);

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setUserId(undefined);
    post("/api/logout");
  };

  const handleEditing = (element) => {
    console.log("went inside");
    setEventInfo({
      userId: element.userId,
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

  }

  return (
    <>
      <NavBar userId={userId} googleLogout={googleLogout} handleLogout={handleLogout} />
      <Router>
        <Home path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <AddEvent path="/add-event/" {...eventInfo}/>
        <ViewEvent path="/events/" userId={userId} />
        <MyEvents path="/my-events/" userId={userId} handleEditing = {handleEditing}/>
        <AutomaticCourseRoad path="/automatic-course-road/" userId={userId} />
        <SharedClasses path="/shared-classes/" userId={userId} />
        <GeneralDining path="/menus/" userId={userId} />
        <SharedDining path="/shared-dining/" userId={userId} />
        <Profile path="/profile/:profileId" userId={userId} />
        <Friends path="/friends/" userId={userId} />
        <Preferences path="/preferences/" userId={userId} />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
