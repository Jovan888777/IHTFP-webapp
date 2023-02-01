import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
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

  const getNames = async (guests) => {
    return Promise.all(
      guests.map((uid) =>
        get("/api/profile-by-id", { userId: uid })
          .then((user) => user.name)
          .catch((err) => console.log(err))
      )
    );
  };

  const downloadGuestlist = async (eventId) => {
    get("/api/event-guestlist", { eventId: eventId })
      .then((guests) => {
        if (guests.length !== 0) {
          getNames(guests)
            .then((guestNames) => {
              const file = new Blob([guestNames.join("\n")], { type: "text/plain" });
              const element = document.createElement("a");
              element.href = URL.createObjectURL(file);
              element.download = "guestlist_" + eventId + ".txt";
              document.body.appendChild(element); // Required for this to work in FireFox
              element.click();
            })
            .catch((err) => console.log(err));
        } else {
          alert("There is no one on the guestlist yet!");
        }
      })
      .catch((err) => {
        console.log(`failed to get all event guestlist:${err}`);
      });
  };

  const deleteEvent = (eventIdPlus) => {
    let confirmation = confirm("Are you sure you want to delete your event?");
    if (confirmation) {
      let eventId = eventIdPlus.split("_")[0];
      post("/api/delete-event", { eventId: eventId }).catch((err) => {
        console.log(`failed to deleted event:${err}`);
        res.send(false);
      });
      let newEvents = myEvents.filter((event) => event._id !== eventId);
      setmyEvents(newEvents);
      alert("Your event was deleted successfully!");
    }
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  //Missing printing the events
  return (
    <div className="center">
      <h1>My Events</h1>
      {myEvents.length !== 0 ? (
        myEvents.map((element) => (
          <div className="myEventsContainer">
            <EventDisplay {...element} userId={props.userId} />

            <div className="column">
              {element.guestlistNeeded ? (
                <button
                  onClick={(e) => downloadGuestlist(e.target.className)}
                  className={element._id}
                >
                  Download Guestlist
                </button>
              ) : (
                ""
              )}
              <button
                onClick={() => {
                  props.handleEditing(element);
                }}
              >
                {" "}
                Edit{" "}
              </button>
              <button
                onClick={(e) => deleteEvent(e.target.className)}
                className={element._id + "_delete"}
              >
                Delete this event
              </button>
            </div>
          </div>
        ))
      ) : (
        <h2>You don't have any events yet! You can create some from the Add Event page.</h2>
      )}
    </div>
  );
};

export default MyEvents;
