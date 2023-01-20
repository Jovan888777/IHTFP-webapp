import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import jwt_decode from "jwt-decode";

import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";

import "../utilities.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

//ADDED BY TAMAR
import NavBar from "./modules/NavBar.js";
import AddEvent from "./pages/AddEvent.js";
import ViewEvent from "./pages/ViewEvent.js";
import AutomaticCourseRoad from "./pages/AutomaticCourseRoad.js";
import SharedClasses from "./pages/SharedClasses.js";
import GeneralDining from "./pages/GeneralDining.js";
import SharedDining from "./pages/SharedDining.js";
import GeneralProfile from "./pages/GeneralProfile.js";
import ProfileFriends from "./pages/ProfileFriends.js";
import ProfilePreferences from "./pages/ProfilePreferences.js";

/**
 * Define the "App" component
 */
const App = () => {
  const [userId, setUserId] = useState(undefined);

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

  return (
    <>
      <NavBar />
      <Router>
        <Skeleton path="/" handleLogin={handleLogin} handleLogout={handleLogout} userId={userId} />
        <AddEvent path = "/add-event/" />
        <ViewEvent path = "/view-event/" />
        <AutomaticCourseRoad path = "/automatic-course-road/" />
        <SharedClasses path = "/shared-classes/" />
        <GeneralDining path = "/general-dining/" />
        <SharedDining path = "/shared-dining/" />
        <GeneralProfile path = "/general-profile/" />
        <ProfileFriends path = "/profile-friends/" />
        <ProfilePreferences path = "/profile-preferences/" />
        <NotFound default />
      </Router>
    </>
  );
};

export default App;
