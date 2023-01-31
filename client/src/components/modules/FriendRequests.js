import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./FriendRequests.css";

const FriendRequests = (props) => {
    const [requests, setRequests] = useState([]);

    const getNames = async (requests) => {
        return Promise.all(
          requests.map((uid) =>
            get("/api/profile-by-id", { userId: uid })
              .then((user) => user.name)
              .catch((err) => console.log(err))
          )
        );
      };
    //getting requests of the user
    const getRequests = () => {
        get("/api/friend-requests", {userId: props.userId})
            .then((reqs) => {
                setRequests(reqs);
            })
            .catch((err) => {
                console.log("failed to get requests");
        });
    }

    const acceptRequest = (profileId, btnA, btnD) => {
        if (btnA && btnD) {
            console.log("accepted", {profileId});
            btnA.innerHTML = "Accepted";
            btnA.disabled = true;
            btnD.remove();
            console.log(props.userId, profileId);

            //accept request on one side
            post("/api/accept-request", {userId: props.userId, profileId: profileId})
                .then( () => {console.log("post request");})
                .catch((err) => {
                    console.log(`failed to accept request:${err}`);
            });

            //accept request on the other side
            post("/api/accept-request", {userId: profileId, profileId: props.userId})
                .then( () => {console.log("post request");})
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
                Name {element}
                <button onClick = {(e) => acceptRequest(element, e.target, e.target.nextSibling)} > Accept Request </button>
                <button onClick = {(e) => deleteRequest(element, e.target.previousSibling, e.target)}> Delete Request </button>
            </div>

            ))}
        </div>
      );
};

export default FriendRequests;