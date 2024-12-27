import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/RegistrationPage.scss';
import Cookies from 'js-cookie';
import { showSuccessNotification, showErrorNotification } from '../App';

function RegistrationPage({ toggleModal }) {
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      password: '',
    },
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name in formData.user) {
      setFormData({ ...formData, user: { ...formData.user, [e.target.name]: e.target.value } });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/register/', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Cookies.set('role', formData.role); 
      const message =
        formData.role === 'teacher'
          ? 'Registration successful! Your account is pending approval.'
          : 'Registration successful! Please login.';
  
      showSuccessNotification(message);
      setFormData({
        user: {
          username: '',
          email: '',
          password: '',
        },
        role: '',
      });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
  
      toggleModal();
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let errMsg = 'Registration failed! Please try again.';
        if (errors.username) {
          errMsg = `Username: ${errors.username.join(" ")}`;
        } else if (errors.email) {
          errMsg = `Email: ${errors.email.join(" ")}`;
        } else if (errors.password) {
          errMsg = `Password: ${errors.password.join(" ")}`;
        } else if (errors.role) {
          errMsg = `Role: ${errors.role.join(" ")}`;
        } else if (errors.non_field_errors) {
          errMsg = errors.non_field_errors.join(" ");
        }
        
        showErrorNotification(errMsg);
      } else {
        console.error('Error without response data:', error);
        showErrorNotification('An unexpected error occurred. Please try again later.');
      }
    }
  };
      

  return (
    <div className="registration-modal">
      <div className="registration-modal-content">
        <button onClick={toggleModal} className="close-button">&times;</button>
        <h2>Register to EduBridge</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" name="username" id="username" value={formData.user.username} required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" id="email" value={formData.user.email} required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" id="password" value={formData.user.password} required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select name="role" id="role" value={formData.role} required onChange={handleChange}>
              <option value="">Select role</option>
              <option value="teacher">Teacher</option>
              <option value="parent">Parent</option>
              <option value="student">Student</option>
            </select>
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
