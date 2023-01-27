import React from "react";
import "./FriendDisplay.css";

import "../../utilities.css";

const FriendDisplay = (props) => {
    console.log(props.kerb);
    return (
        <div className="user-cards">
            <div className="card">
                <div className="column"></div>
                <div className = "header"> {props.name} </div>
                <div className = "body"> Kerberos {props.kerb} </div>
            </div>
        </div>
      );
};

export default FriendDisplay;