import React, { useEffect, useState } from "react";
import "./SharedClasses.css";
import { get } from "../../utilities";
import Card from "../modules/Card.js";

const SharedClasses = (props) => {
  const [classes, setClasses] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendNames, setFriendNames] = useState([]);
  const [friendClasses, setFriendClasses] = useState([]);
  const [friendInClasses, setFriendInClasses] = useState({});

  const loadFriends = () => {
    get("/api/user-friends", { userId: props.userId })
      .then((friends) => {
        setFriends(friends);
      })
      .catch((err) => `failed to find user friends:${err}`);
  };

  const loadClasses = () => {
    get("/api/current-classes", { userId: props.userId })
      .then((classes) => {
        setClasses(classes);
      })
      .catch((err) => `failed to find user classes:${err}`);
  };

  const getNames = async () => {
    if (friends) {
      const output = friends.map((uid) => {
        return get("/api/profile-by-id", { userId: uid })
          .then((user) => {
            return user.name;
          })
          .catch((err) => console.log(err));
      });
      setFriendNames(await Promise.all(output));
    }
  };

  const getFriendClasses = async () => {
    if (friends) {
      const output = friends.map((uid) => {
        return get("/api/current-classes", { userId: uid });
      });
      setFriendClasses(await Promise.all(output));
    }
  };

  const loadFriendsInClasses = () => {
    let friendChoices = {};

    if (classes) {
      console.log(classes, friendClasses);
      for (let className of classes) {
        friendChoices[className] = [];
      }
      if (friendClasses.length) {
        for (let i = 0; i < friendClasses.length; i++) {
          for (let j = 0; j < friendClasses[i].length; j++) {
            if (classes.includes(friendClasses[i][j])) {
              friendChoices[friendClasses[i][j]].push(friendNames[i]);
            }
          }
        }
      }
      setFriendInClasses(friendChoices);
    }
  };

  useEffect(() => {
    loadFriends();
    loadClasses();
  }, [props]);

  useEffect(() => {
    getNames();
  }, [friends]);

  useEffect(() => {
    getFriendClasses();
  }, [friendNames]);

  useEffect(() => {
    loadFriendsInClasses();
  }, [friendClasses]);

  return (
    <div>
      <div className="center">
        <h1>Friends in your classes!</h1>
      </div>
      <br></br>
      <div className="wrapper center">
        {classes.length
          ? classes.map((classNum) => <Card title={classNum} friends={friendInClasses[classNum]} />)
          : "No Classes in the System!"}
      </div>
    </div>
  );
};

export default SharedClasses;
