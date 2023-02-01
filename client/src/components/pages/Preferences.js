import React, { useState, useEffect } from "react";
import "./Preferences.css";
import { get, post } from "../../utilities";
import Accordian from "../modules/Accordian.js";
import KeywordInput from "../modules/KeywordInput.js";
import RankElement from "../modules/RankElement";

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

  let majors = [
    "1-ENG",
    "2",
    "2-A",
    "2-OE",
    "3",
    "3-A",
    "3-C",
    "4",
    "4-B",
    "5",
    "5-7",
    "6-1",
    "6-2",
    "6-3 (NEW)",
    "6-3 (OLD)",
    "6-4",
    "6-7",
    "6-9",
    "6-14",
    "7",
    "8",
    "9",
    "10",
    "10-B",
    "10-C",
    "10-ENG",
    "11",
    "11-6",
    "12",
    "14",
    "14-2",
    "15-1",
    "15-2",
    "15-3",
    "16",
    "16-ENG",
    "17",
    "18",
    "18-C",
    "20",
    "21",
    "21A",
    "21E",
    "21G",
    "21H",
    "21L",
    "21M-1",
    "21M-2",
    "21S",
    "21W",
    "22",
    "22-ENG",
    "24-1",
    "24-2",
    "CMS",
    "STS",
  ];
  let minors = [
    "1",
    "2",
    "2-A",
    "3",
    "3-A",
    "3-C",
    "4",
    "5",
    "6",
    "7",
    "8",
    "8",
    "9",
    "11",
    "12",
    "14",
    "15-1",
    "15-2",
    "15-3",
    "17",
    "18",
    "20",
    "21",
    "21",
    "21A",
    "21G",
    "21H",
    "21L",
    "21M",
    "21W",
    "24-1",
    "24-2",
    "CMS",
    "E&I",
    "IDSS",
    "STS",
  ];
  let concentrations = [
    "African and African Diaspora Studies",
    "American Studies",
    "Ancient and Medieval Studies",
    "Anthropology",
    "Archaeology and Archaeological Science",
    "Art, Culture, and Technology",
    "Asian and Asian Diaspora Studies",
    "Comparative Media Studies",
    "Computing and Society",
    "Development Economics",
    "Economics",
    "Education",
    "English Language Studies (ELS)",
    "Ethics",
    "Chinese",
    "French",
    "German",
    "Japanese",
    "Korean ",
    "Portuguese",
    "Russian",
    "Spanish",
    "Other Languages",
    "Studies in International Literatures and Cultures (SILC)",
    "Theory of Languages",
    "History",
    "History of Architecture, Art, and Design",
    "Latin American and Latino/a Studies",
    "Legal Studies",
    "Linguistics",
    "Literature",
    "Middle Eastern Studies",
    "Music",
    "Philosophy",
    "Political Science",
    "Religious Studies",
    "Russian and Eurasian Studies",
    "Science, Technology, and Society (STS)",
    "Theater Arts",
    "Urban Studies",
    "Women's and Gender Studies",
    "Writing",
  ];

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
          classSettings.currentClasses = settings.currentClasses;
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

  const changeEventSettings = (e) => {
    if (e.target.tagName.toLowerCase() === "input") {
      if (e.target.type === "checkbox") {
        eventSettings[e.target.name] = !eventSettings[e.target.name];
      } else {
        eventSettings[e.target.name] = e.target.value;
      }
    }
  };

  const changeClassSettings = (e) => {
    classSettings[e.target.name] = e.target.value;
  };

  const changeProfile = (e) => {
    profile[e.target.name] = e.target.value;
  };

  const changeDiningSettings = (e) => {
    if (e.target.type === "checkbox") {
      if (Array.isArray(diningSettings[e.target.name])) {
        let currentVal = [...diningSettings[e.target.name]];
        if (diningSettings[e.target.name].includes(e.target.value)) {
          currentVal = currentVal.filter((item) => item !== e.target.value);
        } else {
          currentVal.push(e.target.value);
        }
        diningSettings[e.target.name] = currentVal;
      }
    } else {
      diningSettings[e.target.name] = e.target.value;
    }
  };

  const changeEventKeywords = (newKeywords) => {
    eventSettings.keywords = newKeywords;
  };

  const changeClasses = (newClasses) => {
    classSettings.currentClasses = newClasses;
  };

  const updateData = (changing, data) => {
    console.log(data);
    post(`/api/${changing}`, { new: data })
      .then(() => {
        console.log(`succesfully updated ${changing}`);
      })
      .catch((err) => {
        console.log(`failed to update ${changing}:${err}`);
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
      Name:{" "}
      <input
        name="name"
        type="textbox"
        placeholder="Name"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      />
      <br></br>
      Kerb:{" "}
      <input
        name="kerb"
        type="textbox"
        placeholder="Kerb"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      />
      <br></br>
      Pronouns:{" "}
      <input
        name="pronouns"
        type="textbox"
        placeholder="Pronouns"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      />
      <br></br>
      Year:{" "}
      <input
        name="year"
        type="number"
        placeholder="year"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      />
      {/* <br></br>
      Profile Picture:{" "} */}
      <input
        type="text"
        name="pic"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        // accept="image/*"
        // enctype="multipart/form-data"
        hidden
      />
      <br></br>
      Primary Major:{" "}
      <select
        name="primaryMajor"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      >
        <option value="" defaultChecked>
          --select--
        </option>
        {majors.map((major) => (
          <option value={major}>{major}</option>
        ))}
      </select>
      <br></br>
      Secondary Major (optional):{" "}
      <select
        name="secondaryMajor"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      >
        <option value="" defaultChecked>
          --select--
        </option>
        {majors.map((major) => (
          <option value={major}>{major}</option>
        ))}
      </select>
      <br></br>
      Minor 1:
      <select name="minorOne" className="profileInput" onChange={(e) => changeProfile(e)} required>
        <option value="" defaultChecked>
          --select--
        </option>
        {minors.map((minor) => (
          <option value={minor}>{minor}</option>
        ))}
      </select>
      <br></br>
      Minor 2:
      <select name="minorTwo" className="profileInput" onChange={(e) => changeProfile(e)} required>
        <option value="" defaultChecked>
          --select--
        </option>
        {minors.map((minor) => (
          <option value={minor}>{minor}</option>
        ))}
      </select>
      <br></br>
      Concentration:
      <select
        name="concentration"
        className="profileInput"
        onChange={(e) => changeProfile(e)}
        required
      >
        {concentrations.map((concentration) => (
          <option value={concentration}>{concentration}</option>
        ))}
      </select>
      <br></br>
      <br></br>
      <input
        value="Save Changes"
        type="submit"
        onClick={() => updateData("update-user", profile)}
      />
      <br></br>
    </div>
  );

  let diningContent = (
    <div>
      {/* <div className="rankContainer">
        {diningSettings.rankings
          ? diningSettings.rankings.map((diningHall) => {
              <RankElement className={1} name={diningHall} />
            })
          : ""}
      </div> */}
      <br></br>
      Dietary Restrictions:
      <input
        name="restrictions"
        type="checkbox"
        value="Vegetarian"
        className="diningInput"
        onChange={changeDiningSettings}
      />{" "}
      Vegetarian
      <input
        name="restrictions"
        type="checkbox"
        value="Vegan"
        className="diningInput"
        onChange={changeDiningSettings}
      />{" "}
      Vegan
      <input
        name="restrictions"
        type="checkbox"
        value="Kosher"
        className="diningInput"
        onChange={changeDiningSettings}
      />{" "}
      Kosher
      <input
        name="restrictions"
        type="checkbox"
        value="Halal"
        className="diningInput"
        onChange={changeDiningSettings}
      />{" "}
      Halal
      <input
        name="restrictions"
        type="checkbox"
        value="Gluten-Free"
        className="diningInput"
        onChange={changeDiningSettings}
      />{" "}
      Gluten Free
      <br></br>
      <br></br>
      <input
        value="Save Changes"
        type="submit"
        onClick={() => updateData("dining-settings", diningSettings)}
      />
    </div>
  );

  let classContent = (
    <div>
      Current Classes:{" "}
      <KeywordInput
        data={classSettings.currentClasses}
        parentFXN={changeClasses}
        classNameUsed="classes-keywords"
      />
      Max Number of Finals per Semester:{" "}
      <input
        name="max_finals"
        type="number"
        placeholder="Max Finals"
        className="classInput"
        onInput={changeClassSettings}
        min={0}
      />
      <br></br>
      Max Number of Units per Semester:{" "}
      <input
        name="max_units"
        type="number"
        placeholder="Max Units"
        className="classInput"
        onInput={changeClassSettings}
        min={0}
      />
      <br></br>
      <br></br>
      <input
        value="Save Changes"
        type="submit"
        onClick={() => updateData("class-settings", classSettings)}
      />
    </div>
  );

  let eventContent = (
    <div>
      Favorite Keywords:{" "}
      <KeywordInput
        data={eventSettings.keywords}
        parentFXN={changeEventKeywords}
        classNameUsed="event-keywords"
      />
      <br></br>
      Allow Summary Emails:{" "}
      <input
        name="allowEmails"
        type="checkbox"
        className="eventInput"
        onChange={changeEventSettings}
      />
      <br></br>
      <br></br>
      <input
        value="Save Changes"
        type="submit"
        onClick={() => updateData("event-settings", eventSettings)}
      />
    </div>
  );

  return (
    <div className="accordion">
      <Accordian
        data={profile}
        title="Profile Details"
        content={profileContent}
        classNameUsed="profileInput"
      />
      <Accordian
        data={diningSettings}
        title="Dining Settings"
        content={diningContent}
        classNameUsed="diningInput"
      />
      <Accordian
        data={eventSettings}
        title="Event Settings"
        content={eventContent}
        classNameUsed="eventInput"
      />
      <Accordian
        data={classSettings}
        title="Class Settings"
        content={classContent}
        classNameUsed="classInput"
      />
    </div>
  );
};

export default Preferences;
