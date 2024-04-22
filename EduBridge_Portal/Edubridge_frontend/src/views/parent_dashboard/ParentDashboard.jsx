import React, {useState, useEffect} from 'react';
import SideBar from './ParentSideBar';
import '../../assets/css/parent_css/Dashboard.scss';

const ParentDashboard = () => {
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
            <h1>Parent Dashboard</h1>
            <h3>Welcome {username}</h3>
                <p>This Dashboard will guide you on how to use your board and navigate to the pages correctly.</p>
                <p>The profile page is for you to change the user information</p>
                <p>Add a student page allow you to add your kids (Student) to your your profile</p> 
                <p>Report page will show you the progress of your child in the classroom. </p>         
                </div>
        </div>
    );
};

export default ParentDashboard;