import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./ProfileDisplay.css";

const ProfileDisplay = (props) => {

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
        }

    useEffect(() => {
        loadProfile();
    }, [props]);

    return (
        (props.userId === props.profileId) ?
        (<div>
            <div className="row">
                <div className = "column">
                    <div className="event-container"><div className = "event-picture"/> </div>
                </div>
                <div className = "column">
                    <ul>
                        <li>Name Surname: {props.profile.name}</li>
                        <li>Pronouns:  {props.profile.pronouns}</li>
                        <li>Contact Info/Kerberos: {props.profile.kerb}</li>
                        <li>School Year: {props.profile.year}</li>
                        <li>Primary Major: {props.profile.primaryMajor}</li>
                        <li>Secondary Major: {props.profile.secondaryMajor}</li>
                        <li>Minor: {props.profile.minorOne}</li>
                        <li>Additional Minor: {props.profile.minorTwo}</li>
                        <li>Concentration:  {props.profile.concentration}</li>
                    </ul>
                </div>
            </div>
        </div>)
        :
        (<div>
            <div className="row">
                <div className = "column">
                    <div className="event-container"><div className = "event-picture"/> </div>
                </div>
                <div className = "column">
                    <ul>
                        <li>Name Surname: {profileInfo.name}</li>
                        <li>Pronouns:  {profileInfo.pronouns}</li>
                        <li>Contact Info/Kerberos: {profileInfo.kerb}</li>
                        <li>School Year: {profileInfo.year}</li>
                        <li>Primary Major: {profileInfo.primaryMajor}</li>
                        <li>Secondary Major: {profileInfo.secondaryMajor}</li>
                        <li>Minor: {profileInfo.minorOne}</li>
                        <li>Additional Minor: {profileInfo.minorTwo}</li>
                        <li>Concentration:  {profileInfo.concentration}</li>
                    </ul>
                </div>
            </div>
        </div>)
        
      );
};

export default ProfileDisplay;