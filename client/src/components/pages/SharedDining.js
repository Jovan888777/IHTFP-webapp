import React, { useEffect, useState } from "react";
import "./SharedDining.css";
import { get } from "../../utilities";
import Card from "../modules/Card.js";

const SharedDining = (props) => {
  const [chosen, setChosen] = useState(["", "", "", ""]);
  const [rankings, setRankings] = useState([
    "Next",
    "Simmons",
    "Maseeh",
    "McCormmick",
    "New Vassar",
    "Baker",
  ]);
  const [meal, setMeal] = useState("breakfast");
  const [mealIndex, setMealIndex] = useState(0);
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
    get("/api/dining-settings", { userId: props.userId })
      .then((settings) => {
        setChosen(settings.chosen);
        setRankings(settings.rankings);
      })
      .catch((err) => {
        console.log(`failed to get dining settings:${err}`);
      });
  };

  const loadFriendChoices = () => {
    let name;
    let newFriendChoices = {
      Next: [],
      Simmons: [],
      Maseeh: [],
      McCormmick: [],
      NewVassar: [],
      Baker: [],
    };

    if (chosen[mealIndex]) {
      newFriendChoices[chosen[mealIndex]].push(props.userName);
    }

    if (friends) {
      for (let friendId of friends) {
        name = get("/api/profile-by-id", { userId: friendId })
          .then((user) => {
            return user.name;
          })
          .catch((err) => console.log(`failed to get profile by id:${err}`));

        get("/dining-choice", { userId: friendId })
          .then((choices) => {
            if (choices) {
              let choice = choices[mealIndex];
              if (choice) {
                newFriendChoices[choice].push(name);
              }
            }
          })
          .catch((err) => console.log(`failed to get dining choice:${err}`));
      }
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

  useEffect(() => {
    loadFriends();
    loadDiningSettings();
    loadMeal();
  }, []);

  useEffect(() => {
    changeMealIndex();
  }, [meal]);

  useEffect(() => {
    loadFriendChoices(meal);
  }, [chosen, mealIndex]);

  return (
    <div>
      <div className="center">
        <h1>Select the meal to view the meal</h1>
        <select value={meal} onChange={(event) => setMeal(event.target.value)}>
          <option value="breakfast">breakfast</option>
          <option value="lunch">lunch</option>
          <option value="dinner">dinner</option>
          <option value="lateNight">late night</option>
        </select>
      </div>
      <br></br>
      <div className="wrapper">
        {rankings.map((diningHall) => (
          <Card title={diningHall} friends={friendChoices[diningHall.replace(" ", "")]} />
        ))}
      </div>
    </div>
  );
};

export default SharedDining;
