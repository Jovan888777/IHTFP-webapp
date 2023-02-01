import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { useLocation } from "react-router-dom";

import "../../utilities.css";
import "./Home.css";

const GOOGLE_CLIENT_ID = "700977180342-jgd43s318l777h9r9p17dpttm4rcgvv4.apps.googleusercontent.com";

const Home = ({ userId, handleLogin, handleLogout }) => {
  if (userId) {
    var bgHome = "bgHome";
  } else {
    var bgHome = "unloggedBgHome";
  }

  return (
    <div className={bgHome}>
      <div className="center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="titleBox center">
            <h1>Welcome to IHTFP!</h1>
          </div>
          <br></br>
          <div className="homeCard center">
            {userId ? (
              <div>
                <h2>You are logged in!</h2>
                <p>
                  You may now explore student events, browse dining
                  selections for today, and edit your class planner.
                </p>
                <button
                  onClick={() => {
                    googleLogout();
                    handleLogout();
                  }} className="homeLogoutButton"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="center">
                <p>
                  Log in using google with the button below.
                </p>
                <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
              </div>
            )}
          </div>
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Home;
