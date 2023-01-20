import React from "react";
import "./NavBar.css";


const NavBar = () => {
    return (
        <nav className="navigation">
            <div className="dropdown">
                <button className="dropbtn">
                    Classes
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <a href = "">Automatic Course-Road</a>
                    <a hred = "">Shared Classes</a>
                </div>
            </div>
            <div className="dropdown">
                <button className="dropbtn">
                    Events
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <a href = "">View Event</a>
                    <a hred = "">Add Event</a>
                </div>
            </div>
            <div className="dropdown">
                <button className="dropbtn">
                    Dining
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <a href = "">General Dining</a>
                    <a hred = "">Shared Dining</a>
                </div>
            </div>
            <div className="dropdown">
                <button className="dropbtn">
                    Profile
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <a href = "">My Profile</a>
                    <a hred = "">Friends</a>
                    <a href = "">Preferences</a>
                    <a hred = "">Logout</a>
                </div>
            </div>
        </nav>
        
    );
}

export default NavBar;