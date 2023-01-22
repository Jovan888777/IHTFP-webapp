import React, { useEffect, useState } from "react";
import "./SharedDining.css";
import { get } from "../../utilities";

const SharedDining = (props) => {
  const [diningSettings, setdiningSettings] = useState({
    chosen: [null, null, null],
    rankings: ["Next", "Simmons", "Maseeh", "McCormmick", "New Vassar", "Baker"],
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

  return (
    <div className="wrapper">
      {diningSettings.rankings.map((item) => {
        return (
          <div className="dining-container">
            <h1>{item}</h1>
          </div>
        );
      })}
    </div>
  );
};

export default SharedDining;
