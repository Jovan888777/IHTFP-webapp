import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Skeleton.css";

//TODO: REPLACE WITH YOUR OWN CLIENT_ID
const GOOGLE_CLIENT_ID = "700977180342-jgd43s318l777h9r9p17dpttm4rcgvv4.apps.googleusercontent.com";

const Skeleton = ({ userId, handleLogin, handleLogout }) => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <h1 className="u-bold u-textCenter">Welcome to WEBSITE NAME!</h1>
      <div>
        {userId ? (
          <div>
            <button>
              Hello
            </button>
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
  );
};

export default Skeleton;
