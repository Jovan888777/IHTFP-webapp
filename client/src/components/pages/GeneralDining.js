import React, { useEffect, useState } from "react";
import "./GeneralDining.css";
import { get } from "../../utilities";

const GeneralDining = () => {
  const [diningSettings, setdiningSettings] = useState({
    chosen: [null, null, null],
    rankings: ["Next", "Simmons", "Maseeh", "McCormmick", "New Vassar", "Baker"],
  });
  const [menus, setMenus] = useState({
    Next: {
      breakfast: [{ dishName: "potato" }, { dishName: "ji" }],
      lunch: [{ dishName: "lunhc" }],
      dinner: [{ dishName: "dinner" }],
      lateNight: [{ dishName: "late night" }],
    },
    Simmons: { breakfast: [{ dishName: "potato" }], lunch: [], dinner: [], lateNight: [] },
    Maseeh: { breakfast: [{ dishName: "potato" }], lunch: [], dinner: [], lateNight: [] },
    McCormmick: { breakfast: [{ dishName: "potato" }], lunch: [], dinner: [], lateNight: [] },
    NewVassar: { breakfast: [{ dishName: "potato" }], lunch: [], dinner: [], lateNight: [] },
    Baker: { breakfast: [{ dishName: "potato" }], lunch: [], dinner: [], lateNight: [] },
  });
  const [meal, setMeal] = useState("breakfast");

  const loadDiningSettings = () => {
    get("/api/dining-settings").then((settings) => {
      setdiningSettings({
        chosen: settings.chosen,
        rankings: settings.rankings,
      });
    });
  };

  const loadMenu = () => {
    get("/api/menus").then((menus) => {
      setMenus(menus);
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

  useEffect(() => {
    // loadDiningSettings();
    // loadMenu();
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
        {diningSettings.rankings.map((item) => {
          return (
            <div className="dining-container">
              <h1>{item}</h1>
              <div className="menu">
                {menus[item.replaceAll(" ", "")][meal].map((meal) => {
                  return <p>{meal.dishName}</p>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GeneralDining;
