import React from "react";
import "./FriendRequests.css";

const FriendRequests = (props) => {
    const [requests, setRequests] = useState([]);

    const getRequests = () => {
        get("/api/friend-requests", {userId: props.userId})
            .then((reqs) => setRequests(reqs))
            .catch((err) => {
                console.log("failed to get requests");
        });
    }

    const acceptRequest = () => {
        post("/api/accept-request", {userId: props.userId, profileId: props.profileId})
            .then( () => {})
            .catch((err) => {
                console.log(`failed to accept request:${err}`);
            });
    }

    const declineRequest = () => {

    }
    return (
        <div>
            <h1>Friend Requests</h1>
            <div className="row">
            </div>
        </div>
      );
};

export default FriendRequests;