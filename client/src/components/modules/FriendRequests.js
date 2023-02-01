/*

WARNING: Don't seperate the Accept Request, and Delete Request buttons
It will not work if they are not besides each other


*/

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
          .then((user) => {
            return { name: user.name, user_id: uid };
          })
          .catch((err) => console.log(err))
      )
    );
  };

  //getting requests of the userId
  const getRequests = () => {
    get("/api/friend-requests", { userId: props.userId })
      .then((reqs) => {
        getNames(reqs).then((names) => setRequests(names));
      })
      .catch((err) => {
        console.log("failed to get requests");
      });
  };

  //getting requests of the profileId
  const getRequestsOther = () => {
    get("/api/friend-requests", { userId: props.profileId })
      .then((reqs) => {
        setRequestsOther(reqs);
      })
      .catch((err) => {
        console.log("failed to get requests");
      });
  };

  //getting friends of the user
  const getFriends = () => {
    get("/api/user-friends", { userId: props.userId })
      .then((reqs) => {
        setFriends(reqs);
      })
      .catch((err) => {
        console.log("failed to get requests");
      });
  };

  const acceptRequest = (profileId, btnA, btnD) => {
    if (btnA && btnD) {
      btnA.innerHTML = "Accepted";
      btnA.disabled = true;
      btnD.remove();

      //accept request on one side
      post("/api/accept-request", { userId: props.userId, profileId: profileId }).catch((err) => {
        console.log(`failed to accept request:${err}`);
      });

      //accept request on the other side
      post("/api/accept-request", { userId: profileId, profileId: props.userId }).catch((err) => {
        console.log(`failed to accept request:${err}`);
      });
    }
  };

  const deleteFriend = (profileId, btn) => {
    btn.innerHTML = "Deleted";
    btn.disabled = true;

    //delete friend from userIds side
    post("/api/delete-friend", { userId: props.userId, profileId: profileId }).catch((err) =>
      console.log(err)
    );

    //delete friend from tmp's side
    post("/api/delete-friend", { userId: profileId, profileId: props.userId }).catch((err) =>
      console.log(err)
    );
  };

  const deleteRequest = (profileId, btnA, btnD) => {
    if (btnA && btnD) {
      btnD.innerHTML = "Deleted";
      btnD.disabled = true;
      btnA.remove();

      post("/api/delete-request", { userId: props.userId, profileId: profileId })
        .then(() => {})
        .catch((err) => {
          console.log(`failed to accept request:${err}`);
        });
    }
  };

  const AddFriend = (btn) => {
    post("/api/send-request", { profileId: props.profileId, userId: props.userId })
      .then((user) => {
        btn.innerHTML = "Friend Request Sent";
      })
      .catch((err) => console.log(`failed to send friend request:${err}`));
  };

  useEffect(() => {
    getRequests();
  }, [props]); // Must also change when friends change*/

  useEffect(() => {
    getRequestsOther();
  }, [props.profileId]); // Must also change when friends change*/

  useEffect(() => {
    getFriends();
  }, [props.userId]); // Must also change when friends change*/

  return props.userId === props.profileId ? (
    requests.length ? (
      <div>
        <h2 className="center" padding-top="10px">
          Friend Requests
        </h2>
        <div className="requestContainer">
          {requests.map((element) => (
            <div className="row">
              <div className="column" style={{ marginTop: 10 }}>
                {element.name}
              </div>
              <button
                className="btnNew"
                onClick={(e) => acceptRequest(element.user_id, e.target, e.target.nextSibling)}
              >
                {" "}
                Accept Request{" "}
              </button>
              <button
                className="btnNew"
                onClick={(e) => deleteRequest(element.user_id, e.target.previousSibling, e.target)}
              >
                {" "}
                Delete Request{" "}
              </button>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <div></div>
    )
  ) : (
    <div>
      {friends.includes(props.profileId) ? (
        <div className="profile-userbuttons">
          <button className="btn" onClick={(e) => deleteFriend(props.profileId, e.target)}>
            {" "}
            Delete Friend{" "}
          </button>
        </div>
      ) : requestsOther.includes(props.userId) ? (
        <div className="profile-userbuttons">
          <button className="btn"> Friend Request Sent</button>
        </div>
      ) : requests.filter((element) => element.user_id === props.profileId).length ? (
        <div className="profile-userbuttons">
          <button
            className="btn"
            onClick={(e) => acceptRequest(props.profileId, e.target, e.target.nextSibling)}
          >
            {" "}
            Accept Request{" "}
          </button>
          <button
            className="btn"
            onClick={(e) => deleteRequest(props.profileId, e.target.previousSibling, e.target)}
          >
            {" "}
            Delete Request{" "}
          </button>
        </div>
      ) : (
        <div className="profile-userbuttons">
          <button
            className="btn"
            onClick={(e) => {
              AddFriend(e.target);
            }}
          >
            {" "}
            Send Request{" "}
          </button>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
