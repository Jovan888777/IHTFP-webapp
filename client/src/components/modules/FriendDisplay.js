import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./FriendDisplay.css";
import "../../utilities.css";

const FriendDisplay = (props) => {
  const [reqs, setReqs] = useState([]);

  const getReqs = () => {
    get("/api/friend-requests", { userId: props.user_id })
      .then((reqs) => {
        setReqs(reqs);
      })
      .catch((err) => {
        console.log("failed to get requests");
      });
  };

  return props.my_id === props.user_id ? (
    <div></div>
  ) : (
    <div className="user-cardsNew">
      <div className="cardNew">
        <div className="column"></div>
        <div className="header"> {props.name} </div>
        <div className="body"> Kerberos {props.kerb} </div>
        <button onClick={() => props.handleProfile(props.my_id, props.user_id)}>See More</button>
      </div>
    </div>
  );
};

export default FriendDisplay;
