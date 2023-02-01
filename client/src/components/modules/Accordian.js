import React, { useState, useEffect } from "react";
import "./Accordian.css";
import { get, post } from "../../utilities";
import { events } from "socket.io/lib/socket";

const Accordian = (props) => {
  const [data, setData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [err, setErr] = useState("");

  const loadData = () => {
    let newData = {};
    for (let key in props.data) {
      if (Array.isArray(props.data[key])) {
        newData[key] = [...props.data[key]];
      } else {
        newData[key] = props.data[key];
      }
    }

    setData(newData);

    const inputs = document.getElementsByClassName(props.classNameUsed);
    for (const input of inputs) {
      if (input.tagName.toLowerCase() === "input") {
        if (input.type === "checkbox") {
          if (Array.isArray(newData[input.name])) {
            input.checked = newData[input.name].includes(input.value);
          } else {
            input.checked = newData[input.name];
          }
        } else {
          input.value = newData[input.name];
        }
      } else if (input.tagName.toLowerCase() === "select") {
        input.value = newData[input.name];
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [props]);

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>{props.title}</div>
        <div>{isActive ? "-" : "+"}</div>
      </div>
      <div className="accordion-content" hidden={!isActive}>
        {props.content}
        <div>{err}</div>
      </div>
    </div>
  );
};

export default Accordian;
