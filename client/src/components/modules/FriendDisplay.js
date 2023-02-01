import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./FriendDisplay.css";
import "../../utilities.css";

import { Link, navigate } from "@reach/router";

const FriendDisplay = (props) => {

    const [reqs, setReqs] = useState([]);

    const getReqs = () => {
        get("/api/friend-requests", {userId: props.user_id})
            .then((reqs) => {
                setReqs(reqs);
            })
            .catch((err) => {
                console.log("failed to get requests");
        });
    }

    /*const AddFriend = (btn) => {
        console.log("adding friends");
        console.log(props.my_id);
        console.log(props.user_id);
        post("/api/send-request", {profileId: props.my_id, userId: props.user_id})
            .then((user) => {
                btn.innerHTML = "Friend Request Sent";
                console.log("successfully sent a request");
            })
            .catch((err) => console.log(`failed to send friend request:${err}`));
    }*/

    return (
        props.my_id === props.user_id ?
        <div></div>
        : (<div className="user-cardsNew">
            <div className="cardNew">
                <div className="column"></div>
                <div className = "header"> {props.name} </div>
                <div className = "body"> Kerberos {props.kerb} </div>
                <button onClick = {() => props.handleProfile(props.my_id, props.user_id)}>See More</button>

            </div>
        </div>)
      );
};; 

export default FriendDisplay;

/*
deleted this am up to discussion if we should keep it

{props.friends.includes(props.user_id) ?
                    <button>Friends</button>
                    : props.reqs.includes(props.user_id) ? 
                        <button>Friend Request Sent</button>
                        : reqs.includes(props.profileId) ?
                        <button >Accept Friend Request</button>
                        : <button onClick = {(e) => AddFriend(e.target)}>Add Friend</button>
                }
*/