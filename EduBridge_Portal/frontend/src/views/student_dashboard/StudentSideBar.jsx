import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../assets/css/SideBar.scss';

const SideBar = () => {
  return (
    <div className="sidebar">
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? "active" : undefined}
      >
        Profile
      </NavLink>
      <NavLink
      to="/enroll-in-classes"
      className= {({ isActive }) => isActive ? "active" : undefined}
      >

      Enroll in classes
      </NavLink>
      <NavLink 
        to="/student-grade" 
        className={({ isActive }) => isActive ? "active" : undefined}
      >
       
        Grades
      </NavLink>
    </div>
  );
};

export default SideBar;
