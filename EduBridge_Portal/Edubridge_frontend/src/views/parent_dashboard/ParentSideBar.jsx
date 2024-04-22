import React from "react";
import { NavLink } from "react-router-dom";
import "../../assets/css/parent_css/SideBar.scss";


const ParentSideBar = () => {
    return (
        <div className="sidebar">
            <NavLink
                to="/profile"
                className={({ isActive }) => isActive ? "active" : undefined}
            >
                Profile
            </NavLink>
            <NavLink
                to="/add-student"
                className={({ isActive }) => isActive ? "active" : undefined}
            >
                Add Student
            </NavLink>
            <NavLink
                to="/view-report"
                className={({ isActive }) => isActive ? "active" : undefined}
            >
                View Report
            </NavLink>
        </div>
    );
}

export default ParentSideBar;