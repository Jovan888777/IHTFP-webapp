import React from "react";
import {Link} from "@reach/router";
import "./NavBar.css";


const NavBar = () => {
    return (
        <nav className="navigation">
            <div className="nav-brand">
                <button className="navbtn">
                    <Link to ="/" className="logo"> Home </Link>
                </button>
            </div>
            
            <div className="dropdown">
                <button className="dropbtn">
                    Profile
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <Link to ="/general-profile/">
                        My Profile
                    </Link>
                    <Link to ="/profile-friends/">
                        Friends
                    </Link>
                    <Link to ="/profile-preferences/">
                        Preferences
                    </Link>
                    <a hred = "">Logout</a>
                </div>
            </div>
            
            <div className="dropdown">
                <button className="dropbtn">
                    Classes
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <Link to ="/automatic-course-road/">
                        Automatic Course Road
                    </Link>
                    <Link to ="/shared-classes/">
                        Shared Classes
                    </Link>
                </div>
            </div>
            <div className="dropdown">
                <button className="dropbtn">
                    Events
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <Link to ="/view-event/">
                        View Event
                    </Link>
                    <Link to ="/add-event/">
                        Add Event
                    </Link>
                    <Link to ="/my-events/">
                        My Events
                    </Link>
                </div>
            </div>
            <div className="dropdown">
                <button className="dropbtn">
                    Dining
                    <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                    <Link to ="/general-dining/">
                        General Dining
                    </Link>
                    <Link to ="/shared-dining/">
                        Shared Dining
                    </Link>
                </div>
            </div>
        </nav>
        
    );
}

export default NavBar;