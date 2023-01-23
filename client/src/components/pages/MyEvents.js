import React, { useEffect, useState } from "react";
import { get } from "../../utilities";
import "./MyEvents.css";

const MyEvents = (props) => {

  //My events array and setting it
  const [myEvents, setmyEvents] = useState (
     [{user_id: 0,
      name: "",
      group: "",
      location: "",
      start: null,
      end: null,
      description: "",
      keywords: [""],
      guestlistNeeded: false,
      guests: [0],},
    ]
  );

  //Function that sets the My events array
  const loadMyEvents = () => {
    get("api/my-events/").then(
      events => {setmyEvents(events)}
    );
  }

  /*useEffect( () => {
      loadMyEvents();
  }, []
  ); */

  //Missing printing the events
  return (
    <div>
      <h1>My Events</h1>
      {myEvents.map((element, index) => (<EventDisplay {...element}/>))}
    </div>

  );
};

export default MyEvents;
