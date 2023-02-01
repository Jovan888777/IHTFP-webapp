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
                    return (res === "Vegan") ? <img src="../../public/vegan.jpeg"/>
                    : (res === "Gluten-Free") ? <img src="../../public/glutenFree.jpeg"/>
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