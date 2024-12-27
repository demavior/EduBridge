import React from 'react';
import {NavLink} from 'react-router-dom';
import '../../assets/css/teacher_css/SideBar.scss';

const TeacherSideBar = () => {
    return (
        <div className="sidebar">
            <NavLink
                to="/profile"
                className={({isActive}) => isActive ? "active" : undefined}
            >
                Profile
            </NavLink>
            <NavLink
                to="/create-classroom"
                className={({isActive}) => isActive ? "active" : undefined}
            >
                Create Classroom
            </NavLink>
            <NavLink
                to="/manage-classroom"
                className={({isActive}) => isActive ? "active" : undefined}
            >
                Manage Classroom
            </NavLink>
            <NavLink
                to="/teacher-report"
                className={({isActive}) => isActive ? "active" : undefined}
            >
                View Report
            </NavLink>
        </div>
    );
}

export default TeacherSideBar;