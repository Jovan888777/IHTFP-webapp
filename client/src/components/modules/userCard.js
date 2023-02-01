import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./userCard.css";
import "../../utilities.css";

const UserCard = (props) => {
  const [profileInfo, setProfileInfo] = useState({});

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
            requests: user.requests,
            friends: user.friends,
          };
          setProfileInfo(newData);
        }
      })
      .catch((err) => {
        console.log(`failed to get profile:${err}`);
      });
  };

  useEffect(() => {
    loadProfile();
  }, [props.profileId]);

  return (
    <div className="user-cardsNew">
      <div className="cardNew" text-align="left">
        <h3 font-weight="bold"> {profileInfo.name} </h3>
        <div className="body" color="grey">
          {" "}
          Email: {profileInfo.kerb}{" "}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
