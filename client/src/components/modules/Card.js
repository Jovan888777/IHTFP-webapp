import React, { useEffect, useState } from "react";
import "./Card.css";
import { get } from "../../utilities";

const Card = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      <ul>{props.friends ? props.friends.map((name) => <li>{name}</li>) : "No friends here!"}</ul>
    </div>
  );
};

export default Card;
