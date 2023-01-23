import React from "react";
import "./EventDisplay.css";

const EventDisplay = (props) => {
    return (
        <div>
            <div class="row">
                <div className = "column">
                    <div className="event-container"><div className = "event-picture"/> </div>
                </div>
                <div className = "column">
                    <ul>
                    <li>Name: {props.name}</li>
                    <li>Group/Club: {props.group}</li>
                    <li>Start time:  {props.start}</li>
                    <li>End time: {props.end}</li>
                    <li>Location: {props.location}</li>
                    <li>Description: {props.description}</li>
                    </ul>
                </div>
            </div>
        </div>
      );
};

export default EventDisplay;