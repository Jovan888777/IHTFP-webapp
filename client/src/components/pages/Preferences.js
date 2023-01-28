import React, { useState, useEffect } from "react";
import "./Preferences.css";
import { get, post } from "../../utilities";
import Accordian from "../modules/Accordian.js";

const Preferences = (props) => {
  const [profile, setProfile] = useState({
    name: "",
    kerb: "",
    pronouns: "",
    year: "",
    pic: "",
    primaryMajor: "",
    secondaryMajor: "",
    minorOne: "",
    minorTwo: "",
    concentration: "",
  });
  const [diningSettings, setDiningSettings] = useState({});
  const [classSettings, setClassSettings] = useState({});
  const [eventSettings, setEventSettings] = useState({});

  // const deleteME = () => {
  //   post("/api/delete-everything")
  //     .then(() => console.log("done"))
  //     .catch((err) => console.log(`failed to get profile:${err}`));
  // };

  const loadProfile = () => {
    get("/api/profile-by-id", { userId: props.userId })
      .then((user) => {
        if (user) {
          profile.name = user.name;
          profile.kerb = user.kerb;
          profile.pronouns = user.pronouns;
          profile.year = user.year;
          profile.pic = user.pic;
          profile.primaryMajor = user.primaryMajor;
          profile.secondaryMajor = user.secondaryMajor;
          profile.minorOne = user.minorOne;
          profile.minorTwo = user.minorTwo;
          profile.concentration = user.concentration;
        }
      })
      .catch((err) => {
        console.log(`failed to get profile:${err}`);
      });
  };

  const loadDiningSettings = () => {
    get("/api/dining-settings", { userId: props.userId })
      .then((settings) => {
        if (settings) {
          setDiningSettings({
            restrictions: settings.restrictions,
            rankings: settings.rankings,
          });
        }
      })
      .catch((err) => {
        console.log(`failed to get dining settings:${err}`);
      });
  };

  const loadClassSettings = () => {
    get("/api/class-settings")
      .then((settings) => {
        if (settings) {
          classSettings.max_finals = settings.max_finals;
          classSettings.max_units = settings.max_units;
        }
      })
      .catch((err) => {
        console.log(`failed to get class settings:${err}`);
      });
  };

  const loadEventSettings = () => {
    get("/api/event-settings")
      .then((settings) => {
        if (settings) {
          setEventSettings({
            allowEmails: settings.allowEmails,
            keywords: settings.keywords,
          });
        }
      })
      .catch((err) => {
        console.log(`failed to get event settings:${err}`);
      });
  };

  useEffect(() => {
    loadProfile();
    loadDiningSettings();
    loadClassSettings();
    loadEventSettings();
    // deleteME();
  }, []);

  let profileContent = (
    <div>
      Name: <input name="name" type="textbox" placeholder="Name" required />
      <br></br>
      Kerb: <input name="kerb" type="textbox" placeholder="Kerb" required />
      <br></br>
      Pronouns: <input name="pronouns" type="textbox" placeholder="Pronouns" required />
      <br></br>
      Year: <input name="year" type="number" placeholder="year" required />
      <br></br>
      Profile Picture: <input name="pic" type="textbox" placeholder="Picture" required />
      <br></br>
      Primary Major:{" "}
      <input name="primaryMajor" type="textbox" placeholder="Primary Major" required />
      <br></br>
      Secondary Major (optional):{" "}
      <input name="secondaryMajor" type="textbox" placeholder="Secondary Major" />
      <br></br>
      Minor 1: <input name="minorOne" type="textbox" placeholder="Minor 1" />
      <br></br>
      Minor 2: <input name="minorTwo" type="textbox" placeholder="Minor 2" />
      <br></br>
      Concentration:{" "}
      <input name="concentration" type="textbox" placeholder="Concentration" required />
      <br></br>
    </div>
  );
  let diningContent = (
    <div>
      Dietary Restrictions: <input name="restrictions" type="text" placeholder="Restrictions" />
      <br></br>
    </div>
  );

  let classContent = (
    <div>
      Max Number of Finals per Semester:{" "}
      <input name="max_finals" type="number" placeholder="Max Finals" />
      <br></br>
      Max Number of Units per Semester:{" "}
      <input name="max_units" type="number" placeholder="Max Units" />
    </div>
  );

  let eventContent = (
    <div>
      Favorite Keywords: <input name="keywords" type="text" placeholder="Keywords" />
      <br></br>
      Allow Summary Emails: <input name="allEmails" type="checkbox" />
      <br></br>
    </div>
  );

  return (
    <div className="accordion">
      <Accordian
        data={profile}
        changing="update-user"
        title="Profile Details"
        content={profileContent}
        parentFXN={setProfile}
      />
      {/* <Accordian
        data={diningSettings}
        changing="dining-settings"
        title="Dining Settings"
        content={diningContent}
        parentFXN={setDiningSettings}
      />
      <Accordian
        data={eventSettings}
        changing="event-settings"
        title="Event Settings"
        content={eventContent}
        parentFXN={setEventSettings}
      />
      <Accordian
        data={classSettings}
        changing="class-settings"
        title="Class Settings"
        content={classContent}
        parentFXN={setClassSettings}
      /> */}
    </div>
  );
};

export default Preferences;
