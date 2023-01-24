import React, { useEffect, useState } from "react";
import "./ViewEvent.css";
import { get } from "../../utilities";

import EventDisplay from "../modules/EventDisplay";

const ViewEvent = (props) => {
  //Checked box state
  const [checkbox, setCheckBox] = useState(false);

  //List of events
  const [events, setEvents] = useState([]);

  //List of preferred events
  const [preferedevents, setPreferedEvents] = useState([]);

  //Maintaining preferences
  const [eventSettings, seteventsSettings] = useState({
    keywords: ["food", "raffle"],
  });

  //Getting preferences from the server
  const loadPreferences = () => {
    get("/api/event-settings")
      .then((settings) => {
        if (settings) seteventsSettings({ keywords: settings.keywords });
      })
      .catch((err) => console.log(`failed to get event settings:${err}`));
  };

  //Getting Events from the server
  //And filtering through them
  const loadEvents = () => {
    get("/api/events")
      .then((allEvents) => setEvents(allEvents))
      .catch((err) => console.log(`failed to get events:${err}`));
  };

  const loadPreferedEvents = () => {
    setPreferedEvents(
      events.filter((element) => {
        return element.keywords.some((el) => eventSettings.keywords.includes(el));
      })
    );
  };

  useEffect(() => {
    loadPreferences();
    loadEvents();
    loadPreferedEvents();
  }, [events]);

  return (
    <div>
      <h1> Upcoming Events </h1>
      <label className="container">
        Filtered
        <span className="checkmark"></span>
        <input
          type="checkbox"
          name="test"
          onChange={(event) => setCheckBox(event.target.checked)}
        />
      </label>
      {checkbox
        ? preferedevents.map((element) => <EventDisplay {...element} />)
        : events.map((element) => <EventDisplay {...element} />)}
    </div>
  );
};

export default ViewEvent;
