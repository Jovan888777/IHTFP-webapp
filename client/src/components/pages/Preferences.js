import React, { useState, useEffect } from "react";
import "./Preferences.css";
import { get, post } from "../../utilities";
import Accordian from "../modules/Accordian.js";

const Preferences = (props) => {
  const [profile, setProfile] = useState(undefined);
  const [diningSettings, setDiningSettings] = useState({});
  const [classSettings, setClassSettings] = useState({});
  const [eventSettings, setEventSettings] = useState({});
  const [profileContent, setProfileContent] = useState(<div></div>);
  const [diningContent, setDiningContent] = useState(<div></div>);
  const [classContent, setClassContent] = useState(<div></div>);
  const [eventContent, setEventContent] = useState(<div></div>);

  const loadProfile = () => {
    get("/api/profile-by-id", { userId: props.userId })
      .then((user) => {
        if (user) {
          let newData = {
            name: user.name,
            kerb: user.kerb,
            pronouns: user.pronouns,
            year: user.year,
            pic: user.pic,
            primaryMajor: user.primaryMajor,
            secondaryMajor: user.secondaryMajor,
            minorOne: user.minorOne,
            minorTwo: user.minorTwo,
            concentration: user.concentration,
          };
          setProfile(newData);
        }
      })
      .then(() => {
        if (profile) {
          setProfileContent(
            <div>
              Name:{" "}
              <input name="name" type="textbox" placeholder="Name" value={profile.name} required />
              Kerb:{" "}
              <input name="kerb" type="textbox" placeholder="Kerb" value={profile.kerb} required />
              Pronouns:{" "}
              <input
                name="name"
                type="textbox"
                placeholder="Pronouns"
                value={profile.pronouns}
                required
              />
            </div>
          );
        }
      })
      .catch((err) => {
        console.log(`failed to get profile:${err}`);
      });
  };

  const loadDiningSettings = () => {
    get("/api/dining-settings")
      .then((settings) => {
        if (settings) {
          setDiningSettings({
            restrictions: settings.restrictions,
            rankings: settings.rankings,
          });
        }
      })
      .then(() => setDiningContent(<div></div>))
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
      .then(() => {
        console.log(classSettings);
        if (classSettings) {
          setClassContent(
            <div>
              Max Number of Finals:{" "}
              <input
                name="max_finals"
                type="number"
                placeholder="Max Finals"
                value={classSettings.max_finals}
                required
              />
              <br></br>
              Max Number of Units:{" "}
              <input
                name="max_units"
                type="number"
                placeholder="Max Units"
                value={classSettings.max_units}
                required
              />
            </div>
          );
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
      .then(
        setEventContent(() => {
          <div></div>;
        })
      )
      .catch((err) => {
        console.log(`failed to get event settings:${err}`);
      });
  };

  useEffect(() => {
    loadProfile();
    loadDiningSettings();
    loadClassSettings();
    loadEventSettings();
  }, []);

  return (
    <div className="accordion">
      <Accordian
        data={profile}
        changing="update-user"
        title="Profile Details"
        content={profileContent}
        parentFXN={setProfile}
      />
      <Accordian
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
      />
    </div>
  );
};

export default Preferences;
