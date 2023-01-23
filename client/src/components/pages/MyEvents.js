import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import "./MyEvents.css";
import EventDisplay from "../modules/EventDisplay";

const MyEvents = (props) => {

  //User_id of the logged in person
  const [user, setUser] = useState( {
    user_id: null
  });

  //My events array and setting it
  const [myEvents, setmyEvents] = useState ({
    events: []
  });

  //Missing on how to pass a user_id
  const [events, setEvents] = useState({
    events: []
  });

  //Function that sets the My events array
  const loadMyEvents = () => {

  }

  const loadUser = () => {
    get("api.events-settings").then(
      (settings) => {
        setUser({
          user_id: settings.user_id
        });
      }
    );
  }

  const loadEvents = (user_id) => {
    //Filtering through all the events that have user_id as user_id passed
    get("api/events").then(
      (settings) => {
        setEvents({settings})
      }
    );
  }

  useEffect( () => {
      loadEvents();
  }, []
  );

  //Missing printing the events
  return (
    <div>
      <h1>My Events</h1>
      <EventDisplay name = "Weblab deadline" group="Sleep-deprived sophomores" 
      start="01/01/01" end = "02/02/02" location = "zoom" description= ""/>
    </div>

  );
};

export default MyEvents;
