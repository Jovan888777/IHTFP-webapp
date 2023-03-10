import React, { useEffect, useState } from "react";
import "./ViewEvent.css";
import { get } from "../../utilities";
import EventDisplay from "../modules/EventDisplay";
import * as moment from "moment";

const ViewEvent = (props) => {
  //Checked box state, if true means we need to filter
  const [checkbox, setCheckBox] = useState(false);
  //Loaded checks if we need to filter with search bar
  const [loaded, setLoaded] = useState(false);

  //List of all events, static does not change
  const [events, setEvents] = useState([]);

  //List of preferred events filters through the keyword preferences
  const [preferedEvents, setPreferedEvents] = useState([]);

  //List of events filtered by search engine
  const [searchedEvents, setSearchedEvents] = useState([]);

  //Maintaining preferences
  const [eventSettings, seteventsSettings] = useState({});

  //Getting preferences from the server
  const loadPreferences = () => {
    get("/api/event-settings")
      .then((settings) => {
        if (settings) seteventsSettings({ keywords: settings.keywords });
      })
      .catch((err) => console.log(`failed to get event settings:${err}`));
  };

  //Getting Events from the server
  const loadEvents = () => {
    get("/api/events")
      .then((allEvents) => sortEvents(allEvents, setEvents))
      .catch((err) => console.log(`failed to get events:${err}`));
  };

  //Loading preferred events based on preferences
  const loadPreferedEvents = () => {
    setPreferedEvents(
      events.filter((element) => {
        return element.keywords.some((el) => eventSettings.keywords.includes(el));
      })
    );
  };

  //loading events when searched by the checkbox
  const searching = (checkbox, text) => {
    if (text !== "" && checkbox === false) {
      setSearchedEvents(
        events.filter((element) => {
          return element.name.toLowerCase().includes(text);
        })
      );
      setLoaded(true);
    } else if (text !== "" && checkbox === true) {
      setSearchedEvents(
        preferedEvents.filter((element) => {
          return element.name.toLowerCase().includes(text);
        })
      );
      setLoaded(true);
    } else setLoaded(false);
  };

  //When user has searched in the search bar, and then the preferences get clicked
  //this was added to prevent that
  const loadChecked = (loaded, checked) => {
    setCheckBox(checked);
    if (loaded) {
      setSearchedEvents(
        searchedEvents.filter((element) => {
          return element.keywords.some((el) => eventSettings.keywords.includes(el));
        })
      );
    }
  };

  const sortEvents = (content, setter) => {
    let newEvents;
    newEvents = content.slice().sort((a, b) => {
      return a.start > b.start ? 1 : a.start < b.start ? -1 : 0;
    });
    setter(newEvents);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [props.userId]);

  useEffect(() => {
    loadPreferedEvents();
  }, [eventSettings]);

  return (
    <div>
      <h1 className="center"> Upcoming Events </h1>
      <div className="search-wrapper center">
        <label for="search">Search Events</label>
        <input
          className="viewEventSearch center"
          onChange={(text) => {
            searching(checkbox, text.target.value);
          }}
        ></input>
      </div>
      <div className="fullWidthHeight"></div>
      <label className="container">
        Filtered
        <span className="checkmark"></span>
        <input
          type="checkbox"
          name="test"
          onChange={(event) => loadChecked(loaded, event.target.checked)}
        />
      </label>
      <div className="viewContainer">
        {loaded
          ? searchedEvents.map((element) => <EventDisplay {...element} userId={props.userId} />)
          : checkbox
          ? preferedEvents.map((element) => <EventDisplay {...element} userId={props.userId} />)
          : events.map((element) => <EventDisplay {...element} userId={props.userId} />)}
      </div>
    </div>
  );
};

export default ViewEvent;
