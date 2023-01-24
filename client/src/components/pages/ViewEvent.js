import React, { useEffect, useState } from "react";
import "./ViewEvent.css";
import { get } from "../../utilities";

import EventDisplay from "../modules/EventDisplay";

const ViewEvent = (props) => {

  //Checked box state
  const [checkbox, setCheckBox] = useState(false);
  const box = document.querySelector("input[name=test]");

  //List of events
  const [events, setEvents] = useState(
    [{user_id: 0,
    name: "String",
    group: "String",
    location: "String",
    start: "Date",
    end: "Date",
    description: "String",
    keywords: ["food", ],
    guestlistNeeded: false,
    guests: [0]},

    {user_id: 0,
    name: "String",
    group: "String",
    location: "String",
    start: "Date",
    end: "Date",
    description: "String",
    keywords: ["food", "raffle", "boba", "merch"],
    guestlistNeeded: false,
    guests: [0]},

    {user_id: 0,
    name: "String",
    group: "String",
    location: "String",
    start: "Date",
    end: "Date",
    description: "String",
    keywords: ["raffle", "xxxx"],
    guestlistNeeded: false,
    guests: [0]},

    {user_id: 0,
    name: "String",
    group: "String",
    location: "String",
    start: "Date",
    end: "Date",
    description: "String",
    keywords: ["boba", "merch"],
    guestlistNeeded: false,
    guests: [0]}]);

  //List of preferred events
  const [preferedevents, setPreferedEvents] = useState(
    [],
  );

  //Maintaining preferences
  const [eventSettings, seteventsSettings] = useState({
    user_id: 0,
    allowEmails: false,
    keywords: ["food", "raffle"],
  });

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


  const loadPreferedEvents = () => {
    setPreferedEvents(
      events.filter(
        (element) => {return element.keywords.some(el => eventSettings.keywords.includes(el))}
      )
    );
  }
  if (box) {
    box.addEventListener('change', function() {
      setCheckBox(this.checked);
    });
  }

  /*useEffect(() => {
    loadPreferences();
    loadEvents();
    loadPreredEvents();
  }, []); */

  useEffect( () => {
    loadPreferedEvents();
  }, [])

  return (
    <div>
      <h1> Upcoming Events </h1>
      <label className="container">
        Filtered
        <span className="checkmark"></span>
        <input type="checkbox" name="test"/>
      </label>
      {(checkbox) ? (
        preferedevents.map((element) => (<EventDisplay {...element}/>))
      ) : (
        events.map((element) => (<EventDisplay {...element}/>))
      )
      }
      
    </div>
  );
};

export default ViewEvent;
