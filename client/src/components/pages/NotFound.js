import React from "react";
import { Link } from "@reach/router";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="center2">
      <div className="content">
        <h1>404 Not Found</h1>
        <p>The page you requested couldn't be found.</p>
        <p>BUT DON'T STOP SLAYING QUEEEEN!!</p>
        <Link to="/">
          <button> Back Home! </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
