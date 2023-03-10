import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./Profile.css";
import { Link, navigate } from "@reach/router";

import ProfileDisplay from "../modules/ProfileDisplay";
import FriendRequests from "../modules/FriendRequests";
import FriendDisplay from "../modules/FriendDisplay";
import UserCard from "../modules/userCard";
import { CLIENT_RENEG_LIMIT } from "tls";

const Profile = (props) => {
  /// Use flex to make picture and data nicer
  /// Picture link apparently not working because need to load from API
  const [profile, setProfile] = useState(undefined);
  const [myFriends, setmyFriends] = useState([]);
  const [mutual, setMutual] = useState([]);

  const [display, setDisplay] = useState("Mutual Friends");
  const [requests, setRequests] = useState([]);

  //Loading the profile of requested user
  const loadProfile = () => {
    get("/api/profile-by-id", { userId: props.profileId })
      .then((user) => {
        if (user) {
          let newData = {
            name: user.name,
            kerb: user.kerb,
            pronouns: user.pronouns,
            year: user.year,
            pic: user.pic,
            primaryMajor: user.primaryMajor,
            secondaryMajor: user.secondaryMajor,
            minorOne: user.minorOne,
            minorTwo: user.minorTwo,
            concentration: user.concentration,
            friends: user.friends,
          };
          setProfile(newData);
        }
      })
      .catch((err) => {
        console.log(`failed to get profile:${err}`);
      });
  };

  //load display
  const loadDisplay = () => {
    if (props.userId === props.profileId) {
      setDisplay("My Friends");
      setRequests("Friend Requests");
    }
  };

  //Loading friends of logged in user
  const loadMyFriends = () => {
    if (props.userId) {
      get("/api/user-friends", { userId: props.userId })
        .then((friends) => setmyFriends(friends))
        .catch((err) => console.log(`failed to get my friends:${err}`));
    }
  };

  //Loading mutual friends
  const loadMutual = () => {
    setMutual(
      myFriends.filter((element) => {
        return profile.friends.includes(element);
      })
    );
  };

  //deleting your friends, when you are in your profile
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

  useEffect(() => {
    if (props.userId && props.profileId) loadProfile();
    //loadMyFriends();
    //loadMutual();
  }, [props.profileId]); // For profile change

  useEffect(() => {
    if (props.userId && props.profileId) loadDisplay();
  }, [props.userId, props.profileId]); //for setting display anytime props change

  useEffect(() => {
    if (profile) loadMyFriends();
  }, [props.profileId, profile]); //for changing

  useEffect(() => {
    if (myFriends) loadMutual();
  }, [myFriends]); //load mutual anytime my friends change

  let content;
  if (!profile) {
    content = (
      <div className="center">
        <h3>Sorry no such user exists!</h3>
      </div>
    );
  } else {
    content = (
      <div>
        <ProfileDisplay profile={profile} userId={props.userId} profileId={props.profileId} />
        <div className="row" style={{ paddingTop: 100 }}>
          <div className="column">
            <h2 className="u-textCenter"> {display} </h2>
            {props.userId === props.profileId
              ? mutual.map((element) => (
                  <div>
                    <div className="row">
                      <UserCard userId={props.userId} profileId={element} />
                      <div className="profile-userbuttons">
                        <button
                          className="btn"
                          style={{ marginTop: 20 }}
                          onClick={(e) => deleteFriend(element, e.target)}
                        >
                          Delete Friend
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : mutual.map((element) => (
                  <div className="row">
                    <UserCard userId={props.userId} profileId={element} />
                  </div>
                ))}
          </div>
          <div className="column">
            <FriendRequests userId={props.userId} profileId={props.profileId} />
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default Profile;
