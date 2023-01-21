import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";
import { socket } from "../client-socket.js";
import { get, post } from "../utilities";

// CSS Files
import "../utilities.css";
import "./App.css";

// Modules
import NavBar from "./modules/NavBar.js";

// Pages
import AddEvent from "./pages/AddEvent.js";
import ViewEvent from "./pages/ViewEvent.js";
import MyEvents from "./pages/MyEvents.js";
import AutomaticCourseRoad from "./pages/AutomaticCourseRoad.js";
import SharedClasses from "./pages/SharedClasses.js";
import GeneralDining from "./pages/GeneralDining.js";
import SharedDining from "./pages/SharedDining.js";
import GeneralProfile from "./pages/GeneralProfile.js";
import ProfileFriends from "./pages/ProfileFriends.js";
import ProfilePreferences from "./pages/ProfilePreferences.js";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);
  const [token, setToken] = useState("Login");

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
  }, []);

  const handleLogin = (credentialResponse) => {
    setToken("Logout");
    console.log("Logout");
    const userToken = credentialResponse.credential;
    const decodedCredential = jwt_decode(userToken);
    console.log(`Logged in as ${decodedCredential.name}`);
    post("/api/login", { token: userToken }).then((user) => {
      setUserId(user._id);
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  const handleLogout = () => {
    setToken("Login");
    setUserId(undefined);
    post("/api/logout");
  };

  return (
    <>
      <NavBar token={token} />
      <Router>
        <Skeleton path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <AddEvent path="/add-event/" />
        <ViewEvent path="/events/" />
        <MyEvents path="/my-events/" />
        <AutomaticCourseRoad path="/automatic-course-road/" />
        <SharedClasses path="/shared-classes/" />
        <GeneralDining path="/menus/" />
        <SharedDining path="/shared-dining/" />
        <GeneralProfile path="/profile/" />
        <ProfileFriends path="/friends/" />
        <ProfilePreferences path="/preferences/" />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
