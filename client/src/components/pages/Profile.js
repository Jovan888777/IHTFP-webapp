import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import "./Profile.css";
import ProfileDisplay from "../modules/ProfileDisplay";


const Profile = (props) => {
  /// Use flex to make picture and data nicer
  /// Picture link apparently not working because need to load from API

  const [profile, setProfile] = useState({
    name: "String",
    googleid: "String",
    kerb: "String",
    pronouns: 0,
    year: 0,
    pic: "String",
    primaryMajor: 0,
    secondaryMajor: 0,
    minorOne: "Number",
    minorTwo: "Number",
    concentration: "String",
    friends: [0],
  });

  const [friends, setFriends] = useState({
    name: "bla",
    googleid: "bla",
    kerb: "bla",
    pronouns: 0,
    year: 0,
    pic: "bla",
    primaryMajor: 0,
    secondaryMajor: 0,
    minorOne: "bla",
    minorTwo: "bla",
    concentration: "bla",
    friends: [0],
  });

  //loading your profile
  const loadProfile = (user_id) => {
    get("api/Profile", {userid : user_id}).then(
      (user) => {setProfile(user)}
    );
  }

  return (
    <div>
      <ProfileDisplay {...profile}/>
      <h2>Mutual Friends</h2>
    </div>
  );
};

export default Profile;
