import React, { useEffect, useState } from "react";
import "./SharedClasses.css";
import { get } from "../../utilities";
import Card from "../modules/Card.js";

const SharedClasses = (props) => {
  const [classes, setClasses] = useState(undefined);
  const [friends, setFriends] = useState([]);
  const [friendInClasses, setFriendInClasses] = useState(undefined);

  const loadFriends = () => {
    get("/user-friends", { userId: props.userId })
      .then((friends) => setFriends(friends))
      .catch((err) => `failed to find user friends:${err}`);
  };

  const loadClasses = () => {
    get("/current-classes", { userId: props.userId })
      .then((classes) => {
        setClasses(classes);
        let classObj = {};
        for (let className in classes) {
          classObj[className] = [];
        }
        setFriendInClasses(classObj);
      })
      .catch((err) => `failed to find user classes:${err}`);
  };

  const loadFriendsInClasses = () => {
    let name;
    let friendChoices = {};

    if (classes) {
      for (let className of classes) {
        friendChoices[className] = [];
      }
    }

    if (friends) {
      for (let friendId of friends) {
        name = get("/api/profile-by-id", { userId: friendId })
          .then((user) => {
            return user.name;
          })
          .catch((err) => console.log(`failed to get profile by id:${err}`));

        get("/current-classes", { userId: friendId })
          .then((friendClasses) => {
            for (let className of friendClasses) {
              if (className in classes) {
                friendChoices[choice].push(name);
              }
            }
          })
          .catch((err) => console.log(`failed to get dining choice:${err}`));
      }

      setFriendInClasses(friendChoices);
    }
  };

  useEffect(() => {
    loadFriends();
    loadClasses();
  }, []);

  useEffect(() => {
    loadFriendsInClasses();
  }, [classes, friends]);

  return (
    <div>
      <div className="center">
        <h1>Friends in your classes!</h1>
      </div>
      <br></br>
      <div className="wrapper">
        {classes
          ? classes.map((classNum) => <Card title={classNum} friends={friendInClasses[classNum]} />)
          : "No Class in the System!"}
      </div>
    </div>
  );
};

export default SharedClasses;
