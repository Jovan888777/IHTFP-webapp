import React, { useState, useEffect } from "react";
import "./Accordian.css";
import { get, post } from "../../utilities";

const Accordian = (props) => {
  const [data, setData] = useState({});
  const [isActive, setIsActive] = useState(false);
  const [err, setErr] = useState("");

  const loadData = () => {
    console.log("here!");
    let newData = {};
    for (let key in props.data) {
      if (Array.isArray(props.data[key])) {
        newData[key] = [...props.data[key]];
      } else {
        newData[key] = props.data[key];
      }
    }
    setData(newData);
  };

  const updateText = (e) => {
    console.log("data b4: ", data);
    setData({ ...data, [e.target.name]: e.target.value });
    console.log("data after: ", data);
    props.parentFXN(e.target.name, e.target.value);
  };

  const updateCheckboxList = (e) => {
    let currentVal = [...data[e.target.name]];
    if (data[e.target.name].includes(e.target.value)) {
      currentVal = currentVal.filter((item) => item !== e.target.value);
    } else {
      currentVal.push(e.target.value);
    }
    data[e.target.name] = currentVal;
    props.parentFXN(e.target.name, currentVal);
  };

  const updateCheckboxBool = (e) => {
    let currentVal = data[e.target.name];
    data[e.target.name] = !currentVal;
    props.parentFXN(e.target.name, !currentVal);
  };

  const updateSelect = (e) => {
    data[e.target.name] = e.target.value;
  };

  const setUp = () => {
    const inputs = document.getElementsByClassName(props.classNameUsed);
    for (const input of inputs) {
      if (input.tagName.toLowerCase() === "input") {
        if (input.type === "checkbox") {
          if (Array.isArray(props.data[input.name])) {
            input.checked = props.data[input.name].includes(input.value);
            input.addEventListener("change", updateCheckboxList);
          } else {
            input.checked = props.data[input.name];
            input.addEventListener("change", updateCheckboxBool);
          }
        } else {
          input.value = data[input.name];
          input.addEventListener("input", updateText);
        }
      } else if (input.tagName.toLowerCase() === "select") {
        input.value = props.data[input.name];
        input.addEventListener("change", updateSelect);
      }
    }
  };

  const updateData = () => {
    post(`/api/${props.changing}`, { new: data })
      .then(() => {
        console.log(`succesfully updated ${props.changing}`);
      })
      .catch((err) => {
        console.log(`failed to update ${props.changing}:${err}`);
      });
  };

  useEffect(() => {
    loadData();
    setUp();
  }, [props]);

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
