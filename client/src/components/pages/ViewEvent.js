import React, { useEffect, useState } from "react";
import "./ViewEvent.css";
import { get } from "../../utilities";

const ViewEvent = (props) => {

  //List of events
  const [events, setEvents] = useState({
    events: []
  });

  //Maintaining preferences
  const [eventsSettings, seteventsSettings] = useState({
    user_id: 0,
    allowEmails: false,
    keywords: [],
  });
  
  //filtered is a variable that shows if the checkbox is checked
  let filter = true;
  let checkbox = document.getElementById("filter"); 
  if (checkbox.checked == false) {
    filter = false;
  }

  //Function to filter through preferences when the checkbox is checked
  const arrayFilter = (element, preferences) => {
    for (let i = 0; i < element.keywords.size(); i++) {
      if (preferences.includes(element.keywords[i]))
        return true;
    }
    return false;
  }

  //Getting preferences from the server
  const loadPreferences = () => {
    get("api/events-settings").then(
      (settings) => {
        seteventsSettings ({
        user_id: settings.user_id,
        allowEmails: settings.allowEmails,
        keywords: settings.keywords,
      });
    });
  };

  //Getting Events from the server
  //And filtering through them
  const loadEvents = (filter) => {
    //if the checkbox is checked filtering the events
    if (filter === true) {
      get("api/events").then(
        (settings) => {
          setEvents({
            events: settings.filter((element) => {arrayFilter(element, settings.keywords)})
          })
        });
    }
    else {
      get("api/events").then(
        (settings) => {
          setEvents({
            events: settings,
          })
        });
    }
  } 

  useEffect((filter) => {
    loadPreferences();
    loadEvents(filter);
  }, []); 

  return (
    <div>
      <h1> Upcoming Events </h1>
      <label className="container">
        Filtered
        <input type = "checkbox" id = "filter" />
        <span class = "checkmark"> </span>
      </label>
    </div>
  );
};

export default ViewEvent;
