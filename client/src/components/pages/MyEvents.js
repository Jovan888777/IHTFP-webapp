import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";
import "./MyEvents.css";
import EventDisplay from "../modules/EventDisplay";

const MyEvents = (props) => {
  const [myEvents, setmyEvents] = useState([]);

  //Sets the My events array
  const loadMyEvents = () => {
    get("/api/my-events")
      .then((events) => {
        setmyEvents(events);
      })
      .catch((err) => console.log(`failed to load my events:${err}`));
  };

  //Async function that gets the names of the guests on the guestlist
  //from the id list
  const getNames = async (guestsId) => {
    return Promise.all(
      guestsId.map((uid) =>
        get("/api/profile-by-id", { userId: uid })
          .then((user) => user.name)
          .catch((err) => err)
      )
    );
  };

  //If there are guests on the guestlit, it downloads a .txt
  //file when the appropriate button is clicked
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
            .catch((err) => {
              console.log(`failed to download guestlist:${err}`);
              alert("Failed to download the guestlist. Try again later.");
            });
        } else {
          alert("There is no one on the guestlist yet!");
        }
      })
      .catch((err) => {
        console.log(`failed to get all event guestlist:${err}`);
        alert("Failed to download the guestlist. Try again later.");
      });
  };

  //Allows creator to delete their event (also has confirmation)
  const deleteEvent = (eventId) => {
    let confirmation = confirm("Are you sure you want to delete your event?");
    if (confirmation) {
      post("/api/delete-event", { eventId: eventId })
        .then(() => {
          let newEvents = myEvents.filter((event) => event._id !== eventId);
          setmyEvents(newEvents);
          alert("Your event was deleted successfully!");
        })
        .catch((err) => {
          console.log(`failed to delete event:${err}`);
          alert("Failed to delete your event.");
        });
    }
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  return (
    <div>
      <h1>My Events</h1>
      {myEvents.length !== 0 ? (
        myEvents.map((element) => (
          <div>
            <EventDisplay {...element} userId={props.userId} />

            <div className="column">
              {element.guestlistNeeded ? (
                <button onClick={(e) => downloadGuestlist(element._id)}>Download Guestlist</button>
              ) : (
                ""
              )}
              <button onClick={() => props.handleEditing(element)}>Edit</button>
              <button onClick={(e) => deleteEvent(element._id)}>Delete this event</button>
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
