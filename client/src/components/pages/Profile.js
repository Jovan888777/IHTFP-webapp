import React from "react";
import "./Profile.css";

const Profile = () => {
  /// Use flex to make picture and data nicer
  /// Picture link apparently not working because need to load from API
  return (
    <div>
      <div class="container">
        <img src="/pic.jpg" alt="profilePic"/>

        <ul>
          <li>Name Surname</li>
          <li>Pronouns</li>
          <li>Kerb + Contact Info</li>
          <li>Class Year</li>
          <li>Major</li>
        </ul>
      </div>

      <h2>
        Mutual Friends
      </h2>
    </div>
  );
};

export default Profile;
