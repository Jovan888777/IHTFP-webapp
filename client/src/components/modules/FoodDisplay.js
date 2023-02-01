import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./FoodDisplay.css";
import "../../utilities.css";

const vegan =
  "https://legacy.cafebonappetit.com/assets/cor_icons/menu-item-type-668e3c.png?v=1622190090";
const gluten =
  "https://legacy.cafebonappetit.com/assets/cor_icons/menu-item-type-ce9d00.png?v=1622190094";
const halal =
  "https://legacy.cafebonappetit.com/assets/cor_icons/menu-item-type-48b8d2.png?v=1622190090";
const inbalance =
  "https://legacy.cafebonappetit.com/assets/cor_icons/menu-item-type-inbalance.png?v=1622190095";
const vegetarian =
  "https://legacy.cafebonappetit.com/assets/cor_icons/menu-item-type-c9d18b.png?v=1622190094";
const humane =
  "https://legacy.cafebonappetit.com/assets/cor_icons/menu-item-type-ebce7b.png?v=1622190094";

const FoodDisplay = (props) => {
  return (
    <div>
      <div className="food">
        {props.dishName}{" "}
        {props.restrictions.map((res) => {
          return res === "Vegan" ? (
            <img className="img" src={vegan} alt width={25} height={25} />
          ) : res === "Gluten-Free" ? (
            <img className="img" src={gluten} alt width={25} height={25} />
          ) : res === "Halal" ? (
            <img className="img" src={halal} alt width={25} height={25} />
          ) : res === "In Balance" ? (
            <img className="img" src={inbalance} alt width={25} height={25} />
          ) : res === "Vegetarian" ? (
            <img className="img" src={vegetarian} alt width={25} height={25} />
          ) : res === "Humane" ? (
            <img className="img" src={humane} alt width={25} height={25} />
          ) : (
            <div></div>
          );
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
