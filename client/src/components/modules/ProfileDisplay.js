import React from "react";
import "./ProfileDisplay.css";

const ProfileDisplay = (props) => {
    return (
        <div>
            <div className="row">
                <div className = "column">
                    <div className="event-container"><div className = "event-picture"/> </div>
                </div>
                <div className = "column">
                    <ul>
                        <li>Name Surname: {props.name}</li>
                        <li>Pronouns:  {props.pronouns}</li>
                        <li>Contact Info/Kerberos: {props.kerb}</li>
                        <li>School Year: {props.year}</li>
                        <li>Primary Major: {props.primaryMajor}</li>
                        <li>Secondary Major: {props.secondaryMajor}</li>
                        <li>Minor: {props.minorOne}</li>
                        <li>Additional Minor: {props.minorTwo}</li>
                        <li>Concentration:  {props.concentration}</li>
                    </ul>
                </div>
            </div>
        </div>
      );
};

export default ProfileDisplay;