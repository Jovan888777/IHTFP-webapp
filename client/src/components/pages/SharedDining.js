import React, { useEffect, useState } from "react";
import "./SharedDining.css";
import { get } from "../../utilities";

const SharedDining = (props) => {
  const [diningSettings, setdiningSettings] = useState({
    chosen: [null, null, null],
    rankings: ["Next", "Simmons", "Maseeh", "McCormmick", "New Vassar", "Baker"],
  });
  const [menus, setMenus] = useState({
    Next: { breakfast: [], lunch: [], dinner: [] },
    Simmons: { breakfast: [], lunch: [], dinner: [] },
    Maseeh: { breakfast: [], lunch: [], dinner: [] },
    McCormmick: { breakfast: [], lunch: [], dinner: [] },
    New_Vassar: { breakfast: [], lunch: [], dinner: [] },
    Baker: { breakfast: [], lunch: [], dinner: [] },
  });

  const loadDiningSettings = () => {
    get("/api/dining-settings").then((settings) => {
      setdiningSettings({
        chosen: settings.chosen,
        rankings: settings.rankings,
      });
    });
  };

  useEffect(() => {
    loadDiningSettings();
  }, []);

  const loadMenu = () => {
    get("/api/menus").then((menus) => {
      setMenus(menus);
    });
  };

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <div>
      <div className="center">
        <h1>Select the meal to view the meal</h1>
        <select>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
        </select>
      </div>
      <br></br>
      <div className="wrapper">
        {diningSettings.rankings.map((item) => {
          return (
            <div className="dining-container">
              <h1>{item}</h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SharedDining;
