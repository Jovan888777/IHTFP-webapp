import React, { useEffect, useState } from "react";
import "./SharedDining.css";
import { get } from "../../utilities";
import Card from "../modules/Card.js";

const SharedDining = (props) => {
  const [diningSettings, setdiningSettings] = useState({
    chosen: [null, null, null, null],
    rankings: ["Next", "Simmons", "Maseeh", "McCormmick", "New Vassar", "Baker"],
  });
  const [meal, setMeal] = useState("breakfast");
  const [friends, setFriends] = useState([]);
  const [friendChoices, setFriendChoices] = useState({
    Next: [],
    Simmons: [],
    Maseeh: [],
    McCormmick: [],
    NewVassar: [],
    Baker: [],
  });

  const loadFriends = () => {
    get("/user-friends", { userId: props.userId })
      .then((friends) => setFriends(friends))
      .catch((err) => `failed to find user friends:${err}`);
  };

  const loadDiningSettings = () => {
    get("/api/dining-settings", { userId: userId })
      .then((settings) => {
        setdiningSettings({
          chosen: settings.chosen,
          rankings: settings.rankings,
        });
      })
      .catch((err) => {
        console.log(`failed to get dining settings:${err}`);
      });
  };

  const loadFriendChoices = (meal) => {
    let index, name, settings, choice;
    let newFriendChoices = {
      Next: [],
      Simmons: [],
      Maseeh: [],
      McCormmick: [],
      NewVassar: [],
      Baker: [],
    };
    if (meal === "breakfast") {
      index = 0;
    } else if (meal === "lunch") {
      index = 1;
    } else if (meal === "dinner") {
      index = 2;
    } else if (meal === "lateNight") {
      index = 3;
    }

    for (let friendId of friends) {
      name = get("/api/profile-by-id", { userId: friendId })
        .then((user) => {
          return user;
        })
        .catch((err) => console.log(`failed to get profile by id:${err}`));

      get("/dining-choice", { userId: friendId })
        .then((choices) => {
          if (choices) {
            choice = settings.choices[index];
            if (choice) {
              newFriendChoices[choice].push(name);
            }
          }
        })
        .catch((err) => console.log(`failed to get dining choice:${err}`));
    }

    setFriendChoices({
      Next: [...newFriendChoices.Next],
      Maseeh: [...newFriendChoices.Maseeh],
      Simmons: [...newFriendChoices.Simmons],
      McCormmick: [...newFriendChoices.McCormmick],
      NewVassar: [...newFriendChoices.NewVassar],
      Baker: [...newFriendChoices.Baker],
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
    loadFriends();
    loadDiningSettings();
    loadMeal();
  }, []);

  useEffect(() => {
    loadFriendChoices(meal);
  }, [meal]);

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
        {diningSettings.rankings.map((diningHall) => (
          <Card title={diningHall} friendsGoing={friendChoices[diningHall.replace(" ", "")]} />
        ))}
      </div>
    </div>
  );
};

export default SharedDining;
