import React from "react";
import { Link } from "@reach/router";
//import { Home } from "../pages/Home.js";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "./NavBar.css";

const GOOGLE_CLIENT_ID = "700977180342-jgd43s318l777h9r9p17dpttm4rcgvv4.apps.googleusercontent.com";

const NavBar = (props) => {
  let logText = "";
  const logClick = () => {
    props.googleLogout();
    props.handleLogout();
    window.location.href = "/";
  };

  if (props.userId) {
    logText = "Logout";
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <button className="navbtn">
          <Link to="/" className="logo">
            {" "}
            Home{" "}
          </Link>
        </button>
      </div>
      
      <div className="dropdown">
        <button className="dropbtn">
          Profile
          <i className="fa fa-caret-down"></i>
        </button>
        <div className="dropdown-content">
          <Link to={"/profile/" + props.userId} userId = {props.userId} profileId = {props.userId}>My Profile</Link>
          <Link to="/friends/">Friends</Link>
          <Link to="/preferences/">Preferences</Link>
          <div>{logText ? <button onClick={logClick}>{logText}</button> : <div></div>}</div>
        </div>
      </div>

      <div className="dropdown">
        <button className="dropbtn">
          Classes
          <i className="fa fa-caret-down"></i>
        </button>
        <div className="dropdown-content">
          <Link to="/automatic-course-road/">Automatic Course Road</Link>
          <Link to="/shared-classes/">Shared Classes</Link>
        </div>
      </div>
      <div className="dropdown">
        <button className="dropbtn">
          Events
          <i className="fa fa-caret-down"></i>
        </button>
        <div className="dropdown-content">
          <Link to="/events/">View Event</Link>
          <button onClick = {() => {props.handleAddEvent();}}>Add Event</button>
          <Link to="/my-events/">My Events</Link>
        </div>
      </div>
      <div className="dropdown">
        <button className="dropbtn">
          Dining
          <i className="fa fa-caret-down"></i>
        </button>
        <div className="dropdown-content">
          <Link to="/menus/">General Dining</Link>
          <Link to="/shared-dining/">Shared Dining</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
