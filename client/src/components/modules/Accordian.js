import React, { useState } from "react";
import "./Accordian.css";
import { get, post } from "../../utilities";

const Accordian = (props) => {
  const [data, setData] = useState(props.data);
  const [isActive, setIsActive] = useState(false);

  const updateData = (newData) => {
    post(`/api/${props.changing}`, { new: newData })
      .then(() => console.log(`succesfully updated ${props.changing}`))
      .catch((err) => {
        console.log(`failed to update ${props.changing}:${err}`);
      });
  };

  const updateVals = (e) => this.setData({ [e.target.name]: e.target.value });

  return (
    <div className="accordion-item">
      {/* <div className="accordion-title" onClick={() => setIsActive(!isActive)}>
        <div>{props.title}</div>
        <div>{isActive ? "-" : "+"}</div>
      </div>
      {isActive && (
        <div className="accordion-content">
          {props.content}
          <input value="Save Changes" type="submit" onClick={updateData(data)} />
          <div>{err}</div>
        </div>
      )} */}
    </div>
  );
};

export default Accordian;
