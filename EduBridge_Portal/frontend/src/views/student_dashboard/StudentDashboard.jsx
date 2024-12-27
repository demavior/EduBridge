import React, { useState, useEffect } from 'react';
import SideBar from './StudentSideBar';
import '../../assets/css/Dashboard.scss';

const Dashboard = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); 

  return (
    <div className="dashboard">
      <SideBar />
      <div className="content">
        <h1>Student Dashboard</h1>
        <h3>Welcome {username}</h3>
        <p>This Dashboard will guid you on how to use your board and navigate to the pages correctly.</p>
        <p>The profile page is for you to change the the user information</p>
        <p>The classes page is for you to see the classes you are enrolled in</p>  
        <p>The enrollment page is for you to enroll in classes</p>
        <p>The grades page is for you to see your grades</p>

      </div>
    </div>
  );
};

export default Dashboard;
