import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import { Link, navigate } from "@reach/router";

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
                    <div className="event-container">
                        <div className = "event-picture"/> 
                        <div className="profile-userbuttons">
                            <button className="btn">Upload</button>
                            <button className="btn">Remove</button>
                        </div>
                    </div>
                </div>
                <div className = "column">

                    <div className="card-info">
                        <div className="info-title">
                            <div className="row">
                                <h2 className="name">{props.profile.name}</h2>
                                <h2 className="faded">{props.profile.pronouns}</h2>
                            </div>
                        </div>
                        <div className="info-bio">
                        </div>

                    </div>
                    <div className="row">
                        <div>
                            <hr width="400px" className="solid"></hr>
                            <h3 padding-top = "10px" className="faded">Email: {props.profile.kerb} </h3>
                            <li>School Year: {props.profile.year}</li>
                            <li>Primary Major: {props.profile.primaryMajor}</li>
                            <li>Secondary Major: {props.profile.secondaryMajor}</li>
                            <li>Minor: {props.profile.minorOne}</li>
                            <li>Additional Minor: {props.profile.minorTwo}</li>
                            <li>Concentration:  {props.profile.concentration}</li>
                        </div>
                        <div className="center">
                            <button text-align="center" onClick = {() => navigate("/preferences")}>Edit</button>
                        </div>
                    </div>
                    

                </div>
            </div>
        </div>)
        :
        (<div>
            <div className="row">
                <div className = "column">
                    <div className="event-container">
                        <div className = "event-picture"/>
                    </div>
                </div>
                <div className = "column">

                    <div className="card-info">
                        <div className="info-title">
                            <div className="row">
                                <h2 className="name">{profileInfo.name}</h2>
                                <h2 className="faded">{profileInfo.pronouns}</h2>
                            </div>
                        </div>
                        <div className="info-bio">
                        </div>

                    </div>
                    <div className="row">
                        <div>
                            <hr width="400px" className="solid"></hr>
                            <h3 padding-top = "10px" className="faded">Email: {profileInfo.kerb} </h3>
                            <li>School Year: {profileInfo.year}</li>
                            <li>Primary Major: {profileInfo.primaryMajor}</li>
                            <li>Secondary Major: {profileInfo.secondaryMajor}</li>
                            <li>Minor: {profileInfo.minorOne}</li>
                            <li>Additional Minor: {profileInfo.minorTwo}</li>
                            <li>Concentration:  {profileInfo.concentration}</li>
                        </div>
                    </div>

                </div>
            </div>
        </div>)
      );
};

export default ProfileDisplay;