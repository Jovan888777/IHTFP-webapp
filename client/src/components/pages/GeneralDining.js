import React, { useEffect, useState } from "react";
import "./GeneralDining.css";
import { get, post } from "../../utilities";
import FoodDisplay from "../modules/FoodDisplay";

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
  const [mealIndex, setMealIndex] = useState(0);
  const [restrictions, setRestrictions] = useState([]);

  const loadDiningSettings = () => {
    get("/api/dining-settings", { userId: props.userId })
      .then((settings) => {
        setChosen(settings.chosen);
        setRankings(settings.rankings);
        setRestrictions(settings.restrictions);
      })
      .catch((err) => {
        console.log(`failed to get dining settings:${err}`);
      });
  };

  //filter menus based on preferences
  const filterMenu = () => {
    //load preferences and then filter menus based on that
    let newMenus = [];
    for (let dining in menus) {
      for (let meals in menus[dining]) {
        if (
          meals === "breakfast" ||
          meals === "lunch" ||
          meals === "dinner" ||
          meals === "lateNight"
        ) {
          if (menus[dining][meals].length) {
            newMenus = menus[dining][meals].filter((element) => {
              return restrictions.every((r) => element.restrictions.includes(r));
            });
            menus[dining][meals] = newMenus;
          }
        }
      }
    }
    // menus.filter( (element) => {return restrictions.every( r => (element.restrictions.includes(r) )} );
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

  const changeMealIndex = () => {
    if (meal === "breakfast") {
      setMealIndex(0);
    } else if (meal === "lunch") {
      setMealIndex(1);
    } else if (meal === "dinner") {
      setMealIndex(2);
    } else if (meal === "lateNight") {
      setMealIndex(3);
    }
  };

  const updatingChoice = (element, dining_hall) => {
    let newChosen = [...chosen];

    newChosen[mealIndex] = dining_hall.replaceAll(" ", "");
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

  const settingBtns = () => {
    let allBtns = document.getElementsByClassName("select-dining");
    if (chosen[mealIndex]) {
      console.log(chosen, chosen[mealIndex]);
      for (let btn of allBtns) {
        if (btn.className.includes(chosen[mealIndex])) {
          btn.innerHTML = "Selected";
        } else {
          btn.innerHTML = "Change to here";
        }
      }
    } else {
      for (let btn of allBtns) {
        btn.innerHTML = "Go here!";
      }
    }
  };

  useEffect(() => {
    loadDiningSettings();
    loadMenu();
    // addMenuDB();
    loadMeal();
  }, []);

  useEffect(() => {
    changeMealIndex();
  }, [meal]);

  useEffect(() => {
    settingBtns();
  }, [mealIndex, menus, chosen]);

  useEffect(() => {
    filterMenu();
  }, [menus]);

  return (
    <div>
      <div className="center">
        <h1>Select a meal and dining hall</h1>
        <select
          className="mealSelector"
          value={meal}
          onChange={(event) => setMeal(event.target.value)}
        >
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="lateNight">late night</option>
        </select>
      </div>
      <br></br>
      <div className="wrapper">
        {rankings.map((diningHall) => {
          return (
            <div className="dining-container">
              <h1>{diningHall}</h1>
              <div className="menu">
                <div className="scrollbox">
                  {menus[diningHall.replaceAll(" ", "")][meal].length ? (
                    menus[diningHall.replaceAll(" ", "")][meal].map((food) => {
                      return (
                        <div>
                          <FoodDisplay dishName={food.dishName} restrictions={food.restrictions} />{" "}
                          <hr />
                        </div>
                      );
                    })
                  ) : (
                    <div className="notAvailable">Not Available</div>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => updatingChoice(e.target, diningHall)}
                className={"select-dining " + diningHall}
              >
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
