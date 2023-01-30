import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./FriendRequests.css";

const FriendRequests = (props) => {
    const [requests, setRequests] = useState([]);

    //getting requests of the user
    const getRequests = () => {
        console.log(props.userId);
        get("/api/friend-requests", {userId: props.userId})
            .then((reqs) => setRequests(reqs))
            .catch((err) => {
                console.log("failed to get requests");
        });
        console.log(requests);
    }


    const acceptRequest = (profileId, btnA, btnD) => {
        if (btnA && btnD) {
            console.log("accepted", {profileId});
            btnA.innerHTML = "Accepted";
            btnA.disabled = true;
            btnD.remove();
        post("/api/accept-request", {userId: props.userId, profileId: profileId})
            .then( () => {})
            .catch((err) => {
                console.log(`failed to accept request:${err}`);
            });
        }
    }

    const deleteRequest = (profileId, btnA, btnD) => {
        if (btnA && btnD) {
            console.log("deleted", {profileId});
            btnD.innerHTML = "Deleted";
            btnD.disabled = true;
            btnA.remove();

        post("/api/accept-request", {userId: props.userId, profileId: profileId})
            .then( () => {})
            .catch((err) => {
                console.log(`failed to accept request:${err}`);
        });
        }
    }

    useEffect(() => {
        getRequests();
    }, [props]); // Must also change when friends change*/
    
      return (
        <div>
            <h1>Friend Requests</h1>
            {requests.map((element) => (
            
            <div>
                {element.name}
                <button onClick = {(e) => acceptRequest(element._id, e.target, e.target.nextSibling)} > Accept Request </button>
                <button onClick = {(e) => deleteRequest(element._id, e.target.previousSibling, e.target)}> Delete Request </button>
            </div>

            ))}
        </div>
      );
};

export default FriendRequests;