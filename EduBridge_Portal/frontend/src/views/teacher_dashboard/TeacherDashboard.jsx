import React, {useState, useEffect} from 'react';
import SideBar from './TeacherSideBar';
import '../../assets/css/Dashboard.scss';

const TeacherDashboard = () => {
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
            <h1>Teacher Dashboard</h1>
            <h3>Welcome {username}</h3>
                <p>This Dashboard will guide you on how to use your board and navigate to the pages correctly.</p>
                <p>The profile page is for you to change the user information</p>
                <p>The create classroom page is for you to create a classroom</p>
                <p>The manage classroom page is for you to update or edit the classroom you already created</p>
                <p>View Report to show you the Report for each classroom you created. </p>             
                </div>
        </div>
    );
};

export default TeacherDashboard;
