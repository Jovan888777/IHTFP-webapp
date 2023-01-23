import React, { useEffect, useState } from "react";
import "./ViewEvent.css";
import { get } from "../../utilities";

const ViewEvent = (props) => {
  //List of events
  const [events, setEvents] = useState({
    events: [],
  });

  //List of events
  const [preferedevents, setPreferedEvents] = useState({
    events: [],
  });

  //Maintaining preferences
  const [eventSettings, seteventsSettings] = useState({
    user_id: 0,
    allowEmails: false,
    keywords: [],
  });

  const changeEventView = (checkedVal) => {
    if (checkedVal) {
      return null;
    }
    return null;
  };
  //Getting preferences from the server
  const loadPreferences = () => {
    get("api/events-settings").then((settings) => {
      seteventsSettings(settings);
    });
  };

  //Getting Events from the server
  //And filtering through them
  const loadEvents = () => {
    get("api/events").then((allEvents) => {
      setEvents(allEvents);
    });
  };

  const loadPreredEvents = () => {
    setPreferedEvents(
      events.filter((element) => {
        return eventSettings.preferences.includes(element);
      })
    );
  };

  useEffect(() => {
    loadPreferences();
    loadEvents();
    loadPreredEvents();
  }, []);

  return (
    <div>
      <h1> Upcoming Events </h1>
      <label className="container">
        Filtered
        <input type="checkbox" onChange={changeEventView(this.checked)} />
        <span class="checkmark"></span>
      </label>
    </div>
  );
};

export default ViewEvent;
