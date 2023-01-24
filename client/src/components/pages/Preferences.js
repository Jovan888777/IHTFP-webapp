import React from "react";
import "./Preferences.css";
import { get, post } from "../../utilities";
// import Accordian from "./modules/Accordian.js";

const Preferences = () => {
  const [profile, setProfile] = useState(undefined);
  const [diningSettings, setDiningSettings] = useState(undefined);
  const [classSettings, setClassSettings] = useState(undefined);
  const [eventSettings, setEventSettings] = useState(undefined);

  const loadProfile = () => {
    get("/api/profile-by-id", { userId: props.profileId })
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
      .catch((err) => {
        console.log(`failed to get dining settings:${err}`);
      });
  };

  const loadClassSettings = () => {
    get("/api/class-settings")
      .then((settings) => {
        if (settings) {
          setClassSettings({
            max_finals: settings.max_finals,
            max_units: settings.max_units,
          });
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
  }, []);

  let profileContent = (
    <div>
      Name:{" "}
      <input
        name="name"
        type="textbox"
        placeholder="Name"
        value={profile.name}
        onChange={(event) => updateVals(event)}
        required
      />
      Kerb:{" "}
      <input
        name="kerb"
        type="textbox"
        placeholder="Kerb"
        value={profile.kerb}
        onChange={(event) => updateVals(event)}
        required
      />
      Pronouns:{" "}
      <input
        name="name"
        type="textbox"
        placeholder="Pronouns"
        value={profile.pronouns}
        onChange={(event) => updateVals(event)}
        required
      />
    </div>
  );

  let diningContent = <div></div>;
  let eventContent = (
    <div>
      Max Number of Finals:{" "}
      <input
        name="max_finals"
        type="number"
        placeholder="Max Finals"
        value={eventSettings.max_finals}
        onChange={(event) => updateVals(event)}
        required
      />
      Max Number of Units:{" "}
      <input
        name="max_units"
        type="number"
        placeholder="Max Units"
        value={eventSettings.max_units}
        onChange={(event) => updateVals(event)}
        required
      />
    </div>
  );
  let classContent = <div></div>;

  return (
    <div class="accordion">
      {/* <Accordian
        data={profile}
        changing="update-user"
        title="Profile Details"
        content={profileContent}
      />
      <Accordian
        data={diningSettings}
        changing="dining-settings"
        title="Dining Settings"
        content={diningContent}
      />
      <Accordian
        data={eventSettings}
        changing="event-settings"
        title="Event Settings"
        content={eventContent}
      />
      <Accordian
        data={classSettings}
        changing="class-settings"
        title="Class Settings"
        content={classContent}
      /> */}
    </div>
  );
};

export default Preferences;
