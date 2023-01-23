import React from "react";
import "./Profile.css";

const Profile = () => {
  /// Use flex to make picture and data nicer
  /// Picture link apparently not working because need to load from API

  const [profile, setProfile] = useState({
    name: "String",
    googleid: "String",
    kerb: "String",
    pronouns: 0,
    year: 0,
    pic: "String",
    primaryMajor: 0,
    secondaryMajor: 0,
    minorOne: "Number",
    minorTwo: "Number",
    concentration: "String",
    friends: [0],
  });

  //profile setProfile
  const loadProfile = (user_id) => {
    get("api/Profile", {userid:user_id}).then(
      (user) => {setProfile(user)}
    );
  }

  return (
    <div>
      <div class="container">
        <div className="Profile-avatar"></div>

        <ul>
          <li>Name Surname</li>
          <li>Pronouns</li>
          <li>Kerb + Contact Info</li>
          <li>Class Year</li>
          <li>Major</li>
        </ul>
      </div>

      <h2>Mutual Friends</h2>
    </div>
  );
};

export default Profile;
