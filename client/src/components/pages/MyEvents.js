import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import "./MyEvents.css";

const MyEvents = (props) => {
  //Missing on how to pass a user_id
  const [events, setEvents] = useState({
    events: []
  });

  const loadEvents = (user_id) => {
    //Filtering through all the events that have user_id as user_id passed
    get("api/events").then(
      (settings) => {
        setEvents({
          events: settings.filter(
            (element) => {
              return element.user_id === user_id
            })
        })
      }
    );
  }

  useEffect(
    () => {
      loadEvents();
  }, []
  );

  //Missing printing the events
  return (
    <h1>My Events</h1>
  );
};

export default MyEvents;
