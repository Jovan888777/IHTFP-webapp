import React, { useEffect, useState } from "react";
// import { useNavigate, Navigate } from "react-router-dom";
import "./AddEvent.css";
import { get, post } from "../../utilities";

const AddEvent = (props) => {
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
  // const navigate = useNavigate();

  //Setting values according to props preposting
  const prepost = () => {
    console.log("success");
    console.log(props);
    if (props.eventName) setEventName(props.eventName);
    if (props.eventGroup) setEventGroup(props.eventGroup);
    if (props.eventDescription) setEventDescription(props.eventDescription);
    if (props.eventStart) setEventStart(props.eventStart);
    if (props.eventEnd) setEventEnd(props.eventEnd);
    if (props.eventKeywords) setEventKeywords(props.eventKeywords);
    if (props.eventGuestlistNeeded) setEventGuestlistNeeded(props.eventGuestlistNeeded);
    if (props.eventLocation) setEventLocation(props.eventLocation);
  }

  useEffect( () => {
    prepost();
  });

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
      post("/api/add-event", newEvent)
        .then(console.log("event added successfully!"))
        .catch((err) => console.log(err));
      console.log(newEvent);
      setDone(true);
      // navigate("/my-events");
    }
  };

  return (
    <div>
      <div className="center" hidden={!done}>
        Successfully added your event!
      </div>
      <div className="center" hidden={done}>
        {/* {done && <Navigate to="/my-events" replace={true} />} */}
        <h1>Add Event</h1>
        Name:{" "}
        <input
          name="eventname"
          type="textbox"
          placeholder="Enter some text"
          value={eventName}
          onChange={(event) => setEventName(event.target.value)}
          required
        />
        <br></br>
        Group:
        <input
          name="group"
          type="textbox"
          placeholder="Enter some text"
          value={eventGroup}
          onChange={(event) => setEventGroup(event.target.value)}
          required
        />
        <br></br>
        Location:
        <input
          name="location"
          type="textbox"
          placeholder="Enter some text"
          value={eventLocation}
          onChange={(event) => setEventLocation(event.target.value)}
          required
        />
        <br></br>
        Description:
        <textarea
          name="description"
          placeholder="Enter some text"
          value={eventDescription}
          onChange={(event) => setEventDescription(event.target.value)}
          required
        ></textarea>
        <br></br>
        Start Date and Time:
        <input
          type="datetime-local"
          name="start"
          min={new Date().toISOString().slice(0, new Date().toISOString().lastIndexOf(":"))}
          max="2023-12-31T23:59"
          value={eventStart}
          onChange={(event) => setEventStart(event.target.value)}
          required
        />
        <br></br>
        End Date and Time:
        <input
          type="datetime-local"
          name="start"
          min={eventStart}
          max="2023-12-31T23:59"
          value={eventEnd}
          onChange={(event) => setEventEnd(event.target.value)}
          required
        />
        <br></br>
        Guest List Needed:{" "}
        <input
          name="guestlistneeded"
          type="checkbox"
          value={eventGuestlistNeeded}
          onChange={() => setEventGuestlistNeeded(!eventGuestlistNeeded)}
        />
        <br></br>
        <input value="Add" type="submit" onClick={postNewEvent} />
        <div>{err}</div>
      </div>
    </div>
  );
};

export default AddEvent;

/*
      
       value="2023-01-22"
       min="2022-01-01" max="2023-12-31"</input> */
