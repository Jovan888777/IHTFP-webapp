import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import "./Profile.css";

import ProfileDisplay from "../modules/ProfileDisplay";
import FriendRequests from "../modules/FriendRequests";

const Profile = (props) => {
  /// Use flex to make picture and data nicer
  /// Picture link apparently not working because need to load from API
  const [profile, setProfile] = useState(undefined);
  const [myFriends, setmyFriends] = useState([]);
  const [mutual, setMutual] = useState([]);

  const [display, setDisplay] = useState("Mutual Friends");
  const [requests, setRequests] = useState("");

  //Loading the profile of requested user
  const loadProfile = (id) => {
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
          if (props.userId === props.profileId) {
            setDisplay("My Friends");
            setRequests("Friend Requests");
          }
        }
      })
      .catch((err) => {
        console.log(`failed to get profile:${err}`);
      });
  };

  //Loading friends of logged in user
  const loadMyFriends = () => {
    if (props.userId) {
      get("/api/user-friends", { userId: props.userId })
        .then((friends) => setmyFriends(friends))
        .catch((err) => {
          console.log(`failed to get my friends:${err}`);
        });
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

  useEffect(() => {
    console.log(props);
    loadProfile();
    loadMyFriends();
    loadMutual();
  }, [props.userId, props.profileId]); // Must also change when friends change

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
        <ProfileDisplay {...profile} />
        <button>Edit</button>
        <FriendRequests  userId = {props.userId}/>
        <h2 className="u-textCenter"> {display} </h2>
        {mutual.map((element) => (
          <ProfileDisplay {...element} />
        ))}
      </div>
    );
  }

  return content;
};

export default Profile;
