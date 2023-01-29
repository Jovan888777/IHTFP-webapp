import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import { Link, navigate } from "@reach/router";

import "./MyEvents.css";

import EventDisplay from "../modules/EventDisplay";
import AddEvent from "./AddEvent";

const MyEvents = (props) => {
  //My events array and setting it
  const [myEvents, setmyEvents] = useState([]);

  //Function that sets the My events array
  const loadMyEvents = () => {
    get("/api/my-events").then((events) => {
      setmyEvents(events);
    });
  };

  const downloadGuestlist = (eventId) => {
    get("/api/event-guestlist", { eventId: eventId })
      .then((guests) => {
        if (guests) {
          const file = new Blob([guests.join("\n")], { type: "text/plain" });
          const element = document.createElement("a");
          element.href = URL.createObjectURL(file);
          element.download = "guestlist_" + eventId + ".txt";
          document.body.appendChild(element); // Required for this to work in FireFox
          element.click();
        } else {
          alert("There is no one on the guestlist yet!");
        }
      })
      .catch((err) => {
        console.log(`failed to get all event guestlist:${err}`);
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
          <EventDisplay {...element} userId={props.userId} />
          {element.guestlistNeeded ? (
            <button onClick={(e) => downloadGuestlist(e.target.className)} className={element._id}>
              Download Guestlist
            </button>
          ) : (
            ""
          )}
          <div className="column">
            <button
              onClick={() => {
                props.handleEditing(element);
              }}
            >
              {" "}
              Edit{" "}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyEvents;
