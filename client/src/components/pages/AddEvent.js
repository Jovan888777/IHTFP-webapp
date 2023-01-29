import React, { useEffect, useState } from "react";
// import { useNavigate, Navigate } from "react-router-dom";
import "./AddEvent.css";
import { get, post } from "../../utilities";
import * as moment from 'moment';

const AddEvent = (props) => {
  const [edit, setEdit] = useState(false);
  const [routeStrings, setRouteStrings] = useState({
    api: "/api/add-event",
    button: "Add",
    console: "Your event was successfully added!",
  });
  const [eventName, setEventName] = useState("");
  const [eventGroup, setEventGroup] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventStart, setEventStart] = useState(undefined);
  const [eventEnd, setEventEnd] = useState(undefined);
  const [eventKeywords, setEventKeywords] = useState([]);
  const [eventGuestlistNeeded, setEventGuestlistNeeded] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const [eventId, setEventId] = useState(null);

  //Setting values according to props preposting
  const prepost = () => {
    console.log("prepost");
    console.log(props.eventName);
    if (props.eventName) {
      setEventName(props.eventName);
      setRouteStrings({
        api: "/api/update-event",
        button: "Edit",
        console: "Your event was successfully edited!"});
    }
    else setEventName("");
    if (props.eventGroup) setEventGroup(props.eventGroup);
    else setEventGroup("");
    if (props.eventDescription) setEventDescription(props.eventDescription);
    else setEventDescription("");
    if (props.eventStart)
      setEventStart(moment(props.eventStart).format("YYYY-MM-DDTkk:mm"));
    else setEventStart(null);
    if (props.eventEnd) 
      setEventEnd(moment(props.eventEnd).format("YYYY-MM-DDTkk:mm"));
    else setEventEnd(null);
    if (props.eventKeywords) setEventKeywords(props.eventKeywords);
    else setEventKeywords([]);
    if (props.eventGuestlistNeeded) setEventGuestlistNeeded(props.eventGuestlistNeeded);
    else setEventGuestlistNeeded(false);
    if (props.eventLocation) setEventLocation(props.eventLocation);
    else setEventLocation("");
    if (props.eventId) setEventId(props.eventId);
  }

  useEffect( () => {
    prepost();
    setEdit(true);
    
  }, [props]);

  //posting the new event to database
  //ask how to pass arguments
  const postNewEvent = (event) => {
    event.preventDefault();
    if (
      !(
        eventName &&
        eventGroup &&
        eventLocation &&
        eventDescription &&
        eventStart &&
        eventEnd &&
        eventKeywords
      )
    ) {
      setErr("One of your input fields is empty. Please fill them all to proceed.");
    } else if (Date.parse(eventStart) > Date.parse(eventEnd)) {
      //end is less than start
      setErr("The end date is less than the start date. Please fix to proceed.");
    } else {
      setErr("");
      let newEvent = {
          name: eventName,
          group: eventGroup,
          location: eventLocation,
          start: eventStart,
          end: eventEnd,
          description: eventDescription,
          keywords: eventKeywords,
          guestlistNeeded: eventGuestlistNeeded,
          guests: [],
      };
      let  editedEvent = {
          name: eventName,
          group: eventGroup,
          location: eventLocation,
          start: eventStart,
          end: eventEnd,
          description: eventDescription,
          keywords: eventKeywords,
          guestlistNeeded: eventGuestlistNeeded,
          guests: [],
      };
      //Resetting the textbox states
      console.log(routeStrings.api);
      if (routeStrings.api === "/api/add-event") {
        post(routeStrings.api, newEvent)
          .then(console.log(routeStrings.console))
          .catch((err) => console.log(err));
      }
      else if (routeStrings.api === "/api/update-event") {
        console.log(editedEvent);
        post(routeStrings.api, {eventId: eventId, newEvent: editedEvent})
          .then(console.log(routeStrings.console))
          .catch((err) => console.log(err));
      }
      setDone(true);

      setEventName("");
      setEventGroup("");
      setEventLocation("");
      setEventDescription("");
      setEventStart(undefined);
      setEventEnd(undefined);
      setEventKeywords([]);
      setEventGuestlistNeeded(false);
      setEventId(null);
    }
  };

  return (
    <div className="center">
      <div className="center" hidden={!done}>
        {routeStrings.console}
      </div>
      <div className="addCard center" hidden={done}>
        {/* {done && <Navigate to="/my-events" replace={true} />} */}
        <h1>{routeStrings.button} Event</h1>
        <div className="inputs">
          <div className="halfWidth">
            Name:
          </div>
          <div className="halfWidth">
            <input
              className="inputBox"
              name="eventname"
              type="textbox"
              placeholder="Enter some text"
              value={eventName}
              onChange={(event) => {setEventName(event.target.value)}}
              required
            />
          </div>
          <div className="halfWidth">
            Group:
          </div>
          <div className="halfWidth">
            <input
              className="inputBox"
              name="group"
              type="textbox"
              placeholder="Enter some text"
              value={eventGroup}
              onChange={(event) => setEventGroup(event.target.value)}
              required
            />
          </div>
          <div className="halfWidth">
            Location:
          </div>
          <div className="halfWidth">
            <input
              className="inputBox"
              name="location"
              type="textbox"
              placeholder="Enter some text"
              value={eventLocation}
              onChange={(event) => setEventLocation(event.target.value)}
              required
            />
          </div>
          <div className="halfWidth">
          Start Date and Time:
          </div>
          <div className="halfWidth">
          <input
            className="inputBox"
            type="datetime-local"
            name="start"
            min={new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(":"))}
            max="2023-12-31T23:59"
            value={eventStart}
            onChange={(event) => setEventStart(event.target.value)}
            required
          />
          </div>
          <div className="halfWidth">
            End Date and Time:
          </div>
          <div className="halfWidth">
            <input
              className="inputBox"
              type="datetime-local"
              name="start"
              min={eventStart}
              max="2023-12-31T23:59"
              value={eventEnd}
              onChange={(event) => setEventEnd(event.target.value)}
              required
            />
          </div>
          <div className="halfWidth">
            Guest List Needed:
          </div>
          <div className="halfWidth">
            <input
              className="inputBox"
              name="guestlistneeded"
              type="checkbox"
              value={eventGuestlistNeeded}
              onChange={() => setEventGuestlistNeeded(!eventGuestlistNeeded)}
            />
          </div>
          <div className="halfWidth">
          Description:
          </div>
          <div className="halfWidth">
            <textarea
              className="inputBox"
              name="description"
              placeholder="Enter some text"
              value={eventDescription}
              onChange={(event) => setEventDescription(event.target.value)}
              required
            ></textarea>
          </div>
          <div className="fullWidth">
            <button className ="inputBox" value={routeStrings.button} type="submit" onClick={postNewEvent}>
              Add
            </button>
          </div>
          <div className="fullWidth">
            {err}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;

