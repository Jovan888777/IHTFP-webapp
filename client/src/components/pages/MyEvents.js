import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import "./MyEvents.css";

import EventDisplay from "../modules/EventDisplay";

const MyEvents = (props) => {
  //My events array and setting it
  const [myEvents, setmyEvents] = useState([]);

  //Function that sets the My events array
  const loadMyEvents = () => {
    get("/api/my-events").then((events) => {
      setmyEvents(events);
    });
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  //Missing printing the events
  return (
    <div>
      <h1>My Events</h1>
      {myEvents.map((element) => (
        <div>
          <EventDisplay {...element} />
          <div className="column">
            <button> Edit </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyEvents;
