import React, { useState, useEffect } from "react";
import "./EventDisplay.css";
import { get, post } from "../../utilities";
import * as moment from "moment";

const EventDisplay = (props) => {
  const [going, setGoing] = useState(false);
  const [guests, setGuests] = useState([]);

  const loadGuests = () => {
    get("/api/event-guestlist", { eventId: props._id })
      .then((guests) => {
        setGuests(guests);
        let btn = document.getElementsByClassName(props._id)[0];
        if (guests) {
          if (guests.includes(props.userId)) {
            setGoing(true);
            if (btn) btn.innerHTML = "Remove yourself from the guestlist!";
          }
        }
      })
      .catch((err) => console.log(`failed to get all event guestlist:${err}`));
  };

  const addToGuestList = (element) => {
    let guestlist = [...guests];
    if (going) {
      guestlist = guestlist.filter((uid) => uid !== props.userId);
      element.innerHTML = "Add yourself to the guestlist!";
    } else {
      guestlist.push(props.userId);
      element.innerHTML = "Remove yourself from the guestlist!";
    }
    setGuests(guestlist);
    post("/api/update-event-guestlist", { eventId: props._id, guestlist: guestlist }).catch(
      (err) => {
        console.log(`failed to update guestlist:${err}`);
      }
    );
    setGoing(!going);
  };

  useEffect(() => {
    loadGuests();
  }, []);

  return (
    <div className="eventDisplayCard">
      <div className="row">
        <div className="column">
          <div className="event-container">
            <div className="event-picture" />{" "}
          </div>
        </div>
        <div className="column">
          <ul>
            <li>Name: {props.name}</li>
            <li>Group/Club: {props.group}</li>
            <li>Start time: {moment(props.start).format("MM-DD-YYYY kk:mm")}</li>
            <li>End time: {moment(props.end).format("MM-DD-YYYY kk:mm")}</li>
            <li>Location: {props.location}</li>
            <li>Description: {props.description}</li>
            <li>Keywords: {props.keywords.length === 0 ? "None" : props.keywords.join(", ")}</li>
          </ul>
          {props.userId === props.user_id ? (
            ""
          ) : props.guestlistNeeded ? (
            <button className={props._id} onClick={(e) => addToGuestList(e.target)}>
              Add yourself to the guestlist!
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDisplay;
