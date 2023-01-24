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
    friends: [2, 3],
  });

  const [myFriends, setmyFriends] = useState(
    [{name: "bla",
    googleid: 2,
    kerb: "bla",
    pronouns: 0,
    year: 0,
    pic: "bla",
    primaryMajor: 0,
    secondaryMajor: 0,
    minorOne: "bla",
    minorTwo: "bla",
    concentration: "bla",
    friends: [2, 3],
  },
  {name: "bla",
    googleid: 3,
    kerb: "kakakakakak",
    pronouns: 0,
    year: 0,
    pic: "bla",
    primaryMajor: 0,
    secondaryMajor: 0,
    minorOne: "bla",
    minorTwo: "bla",
    concentration: "bla",
    friends: [2, 3],
  }]);


  const [mutual, setMutual] = useState(
    []
  );

  //Loading the profile of requested user
  const loadProfile = (user_id) => {
    get("api/profile", {userid : user_id}).then(
      (user) => {setProfile(user)}
    );
  }

  //Loading friends of logged in user
  const loadMyFriends = (my_user_id) => {
    get("api/friends", {userid: my_user_id}).then(
      (friends) => {setmyFriends(friends)}
    )
  }

  //Loading mutual friends
  //tell Jennifer about googleid thing
  const loadMutual = () => {
    setMutual ( 
      myFriends.filter(
        (element) => { return profile.friends.includes(element.googleid) }
    ));
  }

  /*
  useEffect ( () => {
    loadProfile(props.user_id);
    loadMyFriends(props.my_user_id);
  }, [user_id]
  );
  */

  useEffect ( () => {
    loadMutual();
  }, [] 
  );

  let display = "Mutual Friends";
  if (props.user_id === props.my_user_id)
    display = "My Friends";

  return (
    <div>
      <ProfileDisplay {...profile}/>
      <button>Edit</button>
      <h2 className = "u-textCenter"> {display} </h2>
      {mutual.map((element) => (<ProfileDisplay {...element}/>))}
    </div>
  );
};

export default Profile;
