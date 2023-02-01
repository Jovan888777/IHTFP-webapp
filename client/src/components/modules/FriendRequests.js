import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./FriendRequests.css";

const FriendRequests = (props) => {
    const [requests, setRequests] = useState([]);
    const [requestsOther, setRequestsOther] = useState([]);
    const [friends, setFriends] = useState([]);
    const [names, setNames] = useState([]);

    
    //could not get getNames to work
    const getNames = async (requests) => {
        return Promise.all(
          requests.map((uid) =>
            get("/api/profile-by-id", { userId: uid })
              .then((user) => {return {name: user.name, 
                               user_id: uid};}
              )
              .catch((err) => console.log(err))
          )
        );
      };

    //getting requests of the userId
    const getRequests = () => {
        get("/api/friend-requests", {userId: props.userId})
            .then((reqs) => {
                getNames(reqs)
                .then((names) => setRequests(names));
            })
            .catch((err) => {
                console.log("failed to get requests");
        });
    }

    //getting requests of the profileId
    const getRequestsOther = () => {
        get("/api/friend-requests", {userId: props.profileId})
            .then((reqs) => {
                setRequestsOther(reqs);
            })
            .catch((err) => {
                console.log("failed to get requests");
        });
    }

    //getting friends of the user
    const getFriends = () => {
        get("/api/user-friends", {userId: props.userId})
            .then((reqs) => {
                setFriends(reqs);
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

    const deleteFriend = (profileId, btn) => {
        btn.innerHTML = "Deleted";
        btn.disabled = true;
    
        //delete friend from userIds side
        post("/api/delete-friend", {userId: props.userId, profileId: profileId})
          .then( () => console.log("deleted friends") )
          .catch( (err) => console.log(err));
    
        //delete friend from tmp's side
        post("/api/delete-friend", {userId: profileId, profileId: props.userId})
          .then( () => console.log("deleted friends") )
          .catch( (err) => console.log(err));
      }

    const deleteRequest = (profileId, btnA, btnD) => {
        if (btnA && btnD) {
            console.log("deleted", {profileId});
            btnD.innerHTML = "Deleted";
            btnD.disabled = true;
            btnA.remove();

        post("/api/delete-request", {userId: props.userId, profileId: profileId})
            .then( () => {})
            .catch((err) => {
                console.log(`failed to accept request:${err}`);
        });
        }
    }

    const AddFriend = (btn) => {
        console.log("adding friends");
        post("/api/send-request", {profileId: props.profileId, userId: props.userId})
            .then((user) => {
                btn.innerHTML = "Friend Request Sent";
                console.log("successfully sent a request");
            })
            .catch((err) => console.log(`failed to send friend request:${err}`));
    }

    useEffect(() => {
        getRequests();
    }, [props]); // Must also change when friends change*/

    useEffect(() => {
        getRequestsOther();
    }, [props.profileId]); // Must also change when friends change*/

    useEffect(() => {
        getFriends();
    }, [props.userId]); // Must also change when friends change*/


      return (
        (props.userId === props.profileId) ? 
        (<div>
            <h1>Friend Requests</h1>
            {requests.map((element) => (
            
            <div>
                {element.name}
                <button onClick = {(e) => acceptRequest(element.user_id, e.target, e.target.nextSibling)} > Accept Request </button>
                <button onClick = {(e) => deleteRequest(element.user_id, e.target.previousSibling, e.target)}> Delete Request </button>
            </div>

            ))}
        </div>)
        : 
        (<div>
            {friends.includes(props.profileId) ?
                <button onClick = {(e) => deleteFriend(props.profileId, e.target)}> Delete Friend </button>
                : requestsOther.includes(props.userId) ?
                <button> Friend Request Sent </button>
                : (requests.filter( (element) => (element.user_id === props.profileId))).length ?
                    <div>
                        <button onClick = {(e) => acceptRequest(props.profileId, e.target, e.target.nextSibling)} > Accept Request </button>
                        <button onClick = {(e) => deleteRequest(props.profileId, e.target.previousSibling, e.target)}> Delete Request </button>
                    </div>
                : <button onClick = {(e) => {AddFriend(e.target)}}> Send Request </button> }
            
        </div>)
      );
};

export default FriendRequests;