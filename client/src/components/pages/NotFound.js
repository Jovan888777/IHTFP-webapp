import React from "react";
import { Link } from "@reach/router";

const NotFound = () => {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>The page you requested couldn't be found.</p>
      <Link to="/">
        <button> Go back Home </button>
      </Link>
    </div>
  );
};

export default NotFound;
