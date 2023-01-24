import React, { useEffect, useState } from "react";
import "./AddEvent.css";
import { get } from "../../utilities";

const AddEvent = (props) => {
  const eventname = document.querySelector("input[name=eventname]");
  const group = document.querySelector("input[name=group]");
  const location = document.querySelector("input[name=location]");
  const start = document.querySelector("input[name=start]");
  const end = document.querySelector("input[name=end]");
  const description = document.querySelector("input[name=description]");
  const keywords = document.querySelector("input[name=keywords]");
  const guestlistneeded = document.querySelector("input[name=guestlistneeded]");
  const guests = document.querySelector("input[name=guests]");


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

  if (eventname) {
    eventname.addEventListener('change', function() {
      setnewEvent({name: this.target.value});
    });
  }
  if (group) {
    group.addEventListener('change', function() {
      setnewEvent({group: this.target.value});
    });
  }
  if (location) {
    location.addEventListener('change', function() {
      setnewEvent({location: this.target.value});
    });
  }
  if (start) {
    start.addEventListener('change', function() {
      setnewEvent({start: this.target.value});
    });
  }

  const loadTest = () => {
    console.log(newEvent);
  }

  const loadNewEvent = () => {
    setnewEvent({
      user_id: props.user_id
    });
  }

  //posting the new event to database
  //ask how to pass arguments
  const postNewEvent = () => {
    post("api/add-event");
  }

  /*useEffect( () => {
      loadNewEvent();
      postNewEvent();
  }, []); */

  useEffect( () => {
    loadTest();
  }, []);


  return (
    <div>
      <h1>Add Event</h1>
      Name:
      <input name = "eventname" type = "textbox" placeholder="Enter some text" />
      Group:
      <input name = "group" type = "textbox" placeholder="Enter some text"/>
      Location:
      <input name = "location" type = "textbox" placeholder="Enter some text"/>
      Description:
      <input name = "description" type = "textbox" placeholder="Enter some text"/>
      Start Date:
      <input type="date" name ="start" min="2018-01-01" max="2023-12-31"/>
      Guest List Needed:
      <input name = "guestlistneeded" type = "checkbox"/>
      Guest List:
      <input name = "guestlist" type = "search" placeholder="Enter guest names"/>

    </div>
    
  );
};

export default AddEvent;

/*
      
       value="2023-01-22"
       min="2022-01-01" max="2023-12-31"</input> */