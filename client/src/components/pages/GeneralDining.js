import React, { useEffect, useState } from "react";
import "./GeneralDining.css";
import { get, post } from "../../utilities";

const GeneralDining = (props) => {
  const [chosen, setChosen] = useState(["", "", "", ""]);
  const [rankings, setRankings] = useState([
    "Next",
    "Simmons",
    "Maseeh",
    "McCormmick",
    "New Vassar",
    "Baker",
  ]);
  const [menus, setMenus] = useState({
    Next: { breakfast: [], lunch: [], dinner: [], lateNight: [] },
    Simmons: { breakfast: [], lunch: [], dinner: [], lateNight: [] },
    Maseeh: { breakfast: [], lunch: [], dinner: [], lateNight: [] },
    McCormmick: { breakfast: [], lunch: [], dinner: [], lateNight: [] },
    NewVassar: { breakfast: [], lunch: [], dinner: [], lateNight: [] },
    Baker: { breakfast: [], lunch: [], dinner: [], lateNight: [] },
  });
  const [meal, setMeal] = useState("breakfast");

  const loadDiningSettings = () => {
    get("/api/dining-settings", { userId: props.userId })
      .then((settings) => {
        setChosen(settings.chosen);
        setRankings(settings.rankings);
      })
      .catch((err) => {
        console.log(`failed to get dining settings:${err}`);
      });
  };

  /*const addMenuDB = () => {
    post("/api/delete-menus")
      .then((success) => console.log(success))
      .catch((err) => {
        console.log(`failed to delete all menus:${err}`);
      });
    post("/api/add-menus", {
      nextb: [{ dishName: "potato", restrictions: ["vegan"] }],
      nextd: [],
      maseehb: [],
      maseehl: [],
      maseehd: [],
      maseehln: [],
      simmonsb: [],
      simmonsd: [],
      simmonsln: [],
      bakerb: [],
      bakerd: [],
      mccormmickb: [],
      miccormmickd: [],
      newvassarb: [],
      newvassarl: [],
      newvassard: [],
    })
      .then((menu) => console.log(menu))
      .catch((err) => {
        console.log(`failed to post menus:${err}`);
      }); 
  }; */

  const loadMenu = () => {
    get("/api/menus")
      .then((menus) => {
        setMenus(menus);
      })
      .catch((err) => {
        console.log(`failed to get menu:${err}`);
      });
  };

  const loadMeal = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    if (hour >= 16 && hour <= 20) {
      setMeal("lunch");
    } else if (hour >= 22 || hour < 2) {
      setMeal("dinner");
    } else if (hour >= 2 || hour <= 6) {
      setMeal("lateNight");
    } else {
      setMeal("breakfast");
    }
  };

  const changeMeal = (val) => {
    setMeal(val);
  };

  const updatingChoice = (element, dining_hall) => {
    let newChosen = [...chosen];
    let index;

    if (meal === "breakfast") {
      index = 0;
    } else if (meal === "lunch") {
      index = 1;
    } else if (meal === "dinner") {
      index = 2;
    } else if (meal === "lateNight") {
      index = 3;
    }

    newChosen[index] = dining_hall.replaceAll(" ", "");
    setChosen(newChosen);
    post("/api/chosen-meal", { chosen: newChosen })
      .then(() => console.log("success"))
      .catch((err) => console.log(err));

    let allBtns = document.getElementsByClassName("select-dining");
    for (let btn of allBtns) {
      btn.innerHTML = "Change to here";
    }
    if (element) {
      element.innerHTML = "Selected";
    }
  };

  useEffect(() => {
    loadDiningSettings();
    loadMenu();
    // addMenuDB();
    loadMeal();
  }, []);

  return (
    <div>
      <div className="center">
        <h1>Select the meal to view the meal</h1>
        <select value={meal} onChange={(event) => changeMeal(event.target.value)}>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="lateNight">late night</option>
        </select>
      </div>
      <br></br>
      <div className="wrapper">
        {rankings.map((item) => {
          return (
            <div className="dining-container">
              <h1>{item}</h1>
              <div className="menu">
                <div className="scrollbox">
                  {menus[item.replaceAll(" ", "")][meal].map((food) => {
                    return <p>{food.dishName}</p>;
                  })}
                </div>
              </div>
              <button onClick={(e) => updatingChoice(e.target, item)} className="select-dining">
                Go here!
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralDining;
