import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import { useLocation } from "react-router-dom";

import "../../utilities.css";
import "./Home.css";

const GOOGLE_CLIENT_ID = "700977180342-jgd43s318l777h9r9p17dpttm4rcgvv4.apps.googleusercontent.com";

const Home = ({ userId, handleLogin, handleLogout }) => {
  return (
    <div class="bgImg container">
      <div className="vertical-center">
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <h1 className="u-bold u-textCenter">Welcome to WEBSITE NAME!</h1>
          <div className="horizontal-center">
            {userId ? (
              <div>
                <button
                  onClick={() => {
                    googleLogout();
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
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
