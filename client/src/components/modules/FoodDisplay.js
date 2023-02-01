import React, { useEffect, useState } from "react";
import { get, post } from "../../utilities";

import "./FoodDisplay.css";
import "../../utilities.css";

import { Link, navigate } from "@reach/router";

const FoodDisplay = (props) => {

    return (
        <div>
            <div className="food">
                {props.dishName} {" "}  
                {props.restrictions.map( (res) => { 
                    return (res === "Vegan") ? <div className="vegan"/>
                    : (res === "Gluten-Free") ? <img src={require("../../public/glutenFree.png")}/>
                    : (res === "Halal") ? <img src="../../public/halal.jpeg"/>
                    : (res === "In Balance") ? <div>Ib</div>
                    : (res === "Vegetarian") ? <img src="../../public/vegetarian.jpeg"/>
                    : (res === "Seafood Watch") ? <div>Sw</div>
                    : (res === "Humane") ? <div>H</div>
                    : <div></div>

                })}
            </div>
        </div>
    );
};

export default FoodDisplay;