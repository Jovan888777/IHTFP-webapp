import React, { useEffect, useState } from "react";
import "./AddEvent.css";
import { get } from "../../utilities";

const AddEvent = (props) => {

  const [newEvent, setnewEvent] = useState({
    user_id: 0,
    name: "",
    group: "",
    location: "",
    start: null,
    end: null,
    description: "",
    keywords: [],
    guestlistNeeded: false,
    guests: [],
  });

  //the problem might be getElement not being rendered ill correct this tomorrow
  const loadAddEvent = () => {
    setnewEvent({
      name: getElementById("name"),
      group: getElementById("group"),
      location: getElementById("location"),
      description: getElementById("description"),
    });
  }

  /**/useEffect( () => {
      loadAddEvent();
  }, []);


  return (
    <div>
      <h1>Add Event</h1>
      Name:
      <input id = "name" placeholder="Enter some text" name="name" />
      Group:
      <input id = "group" placeholder="Enter some text" name="name" />
      Location:
      <input id = "location" placeholder="Enter some text" name="name" />
      Description:
      <input id = "description" placeholder="Enter some text" name="name" />
      Start Date:
      <input type="date" id="start" name="trip-start"
       value="2023-01-22"
       min="2022-01-01" max="2023-12-31"></input>
    </div>
    
  );
};

export default AddEvent;
