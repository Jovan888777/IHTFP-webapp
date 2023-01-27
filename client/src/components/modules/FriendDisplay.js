import React from "react";
import "./FriendDisplay.css";
import "../../utilities.css";

import { Link, navigate } from "@reach/router";

const FriendDisplay = (props) => {
    return (
        <div className="user-cards">
            <div className="card">
                <div className="column"></div>
                <div className = "header"> {props.name} </div>
                <div className = "body"> Kerberos {props.kerb} </div>
                <button onClick = {() => props.handleProfile(props.my_id, props.user_id)}>See More</button>
            </div>
        </div>
      );
};; 

export default FriendDisplay;