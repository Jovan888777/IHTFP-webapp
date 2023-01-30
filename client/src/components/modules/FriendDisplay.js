import React from "react";
import { get, post } from "../../utilities";

import "./FriendDisplay.css";
import "../../utilities.css";

import { Link, navigate } from "@reach/router";

const FriendDisplay = (props) => {
    /*
    {props.reqs.includes(props.user_id) ? 
                    <button onClick = {(e) => AddFriend()}>Add Friend</button>
                    : <button onClick = {(e) => AddFriend()}>Friend Request Sent</button>
                }
    */

    const AddFriend = (btn) => {
        console.log("adding friends");
        console.log(props.my_id);
        console.log(props.user_id);
        post("/api/send-request", {profileId: props.my_id, userId: props.user_id})
            .then((user) => {
                btn.innerHTML = "Friend Request Sent";
                console.log("successfully sent a request");
            })
            .catch((err) => console.log(`failed to send friend request:${err}`));
    }

    return (
        <div className="user-cards">
            <div className="card">
                <div className="column"></div>
                <div className = "header"> {props.name} </div>
                <div className = "body"> Kerberos {props.kerb} </div>
                {props.friends.includes(props.user_id) ?
                    <button>Friends</button>
                    : props.reqs.includes(props.user_id) ? 
                        <button>Friend Request Sent</button>
                        : <button onClick = {(e) => AddFriend(e.target)}>Add Friend</button>
                }
                <button onClick = {() => props.handleProfile(props.my_id, props.user_id)}>See More</button>

            </div>
        </div>
      );
};; 

export default FriendDisplay;