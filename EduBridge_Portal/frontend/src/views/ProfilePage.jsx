import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/ProfilePage.scss';
import Cookies from 'js-cookie';
import { showSuccessNotification, showErrorNotification } from '../App';

function ProfilePage() {
  const token = Cookies.get('token');
  const role = Cookies.get('role');
  const [userProfile, setUserProfile] = useState({ username: '', email: '', role: role });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);

  const handleChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://127.0.0.1:8000/user/profile/', userProfile, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      showSuccessNotification('Profile updated successfully.');
    } catch (error) {
      showErrorNotification('Failed to update profile. ' + (error.response ? error.response.data : 'Please try again later.'));
    }
  };
  

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const payload = {
        old_password: passwords.oldPassword,
        new_password: passwords.newPassword,
    };

    try {
        await axios.post('http://127.0.0.1:8000/user/change-password/', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        showSuccessNotification('Password changed successfully.');
      } catch (error) {
        showErrorNotification('Failed to change password. ' + (error.response ? error.response.data : 'Please try again later.'));
      }
    };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/user/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        const profileData = response.data;
        setUserProfile({
          username: profileData.user.username,
          email: profileData.user.email,
          role: profileData.role
        });
      } catch (error) {
        showErrorNotification('Failed to fetch profile. ' + (error.response ? error.response.data : 'Please try again later.'));
      }
    };
  
    if (token) {
      fetchProfile();
    }
  }, [token]); 
  
  
  

  return (
    <>
      <div className="profile-page">
        <div className="profile-page-content">
          <h2>Profile Page</h2>
          <p>Username: {userProfile.username}</p>
          <p>Email: {userProfile.email}</p>
          <p>The user Role: {userProfile.role}</p>
          <button onClick={() => setShowUpdateProfile(!showUpdateProfile)} className='updateInfoButton'>Update user info</button>
          <button onClick={() => setShowUpdatePassword(!showUpdatePassword)} className='updatePasswordButton'>Update your password</button>
          
          {showUpdateProfile && (
            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" name="username" id="username" required onChange={handleChange} value={userProfile.username} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" name="email" id="email" required onChange={handleChange} value={userProfile.email} />
              </div>
              <button type="submit" className='updateInfoButton'>Update Profile Information</button>
            </form>
          )}

          {showUpdatePassword && (
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="oldPassword">Old Password:</label>
                <input type="password" name="oldPassword" id="oldPassword" required onChange={handlePasswordChange} value={passwords.oldPassword} />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password:</label>
                <input type="password" name="newPassword" id="newPassword" required onChange={handlePasswordChange} value={passwords.newPassword} />
              </div>
              <button type="submit" className='updatePasswordButton'>Update Your Password</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
