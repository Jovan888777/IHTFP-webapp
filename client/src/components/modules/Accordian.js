import React, { useState, useEffect } from "react";
import "./Accordian.css";
import { get, post } from "../../utilities";

const Accordian = (props) => {
  const [data, setData] = useState(props.data);
  const [isActive, setIsActive] = useState(false);
  const [err, setErr] = useState("");

  const update = (e) => props.parentFXN({ [e.target.name]: e.target.value });

  const inputs = document.getElementsByTagName("input");
  for (const input of inputs) {
    if (input.value !== "Save Changes") {
      input.addEventListener("change", update);
    }
  }

  const updateData = () => {
    post(`/api/${props.changing}`, { new: data })
      .then(() => console.log(`succesfully updated ${props.changing}`))
      .catch((err) => {
        console.log(`failed to update ${props.changing}:${err}`);
      });
  };

  return (
    <div className="accordion-item">
      <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>{props.title}</div>
        <div>{isActive ? "-" : "+"}</div>
      </div>
      <div className="accordion-content" hidden={!isActive}>
        {props.content}
        <input value="Save Changes" type="submit" onClick={updateData} />
        <div>{err}</div>
      </div>
    </div>
  );
};

export default Accordian;
