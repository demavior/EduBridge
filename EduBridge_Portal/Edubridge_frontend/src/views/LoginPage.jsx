import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterationPage from './RegistrationPage';
import ForgotPasswordPage from '../components/ForgotPasswordPage';
import '../assets/css/LoginPage.scss';
import Cookies from 'js-cookie';
import { showSuccessNotification, showErrorNotification } from '../App';
import { useAuth } from '../AuthContext';


function LoginPage({ toggleModal, onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toggleRegister = () => setShowRegister(!showRegister);
  const toggleForgotPassword = () => setShowForgotPassword(!showForgotPassword);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/user/login/', credentials,  {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { access_token, refresh_token, role } = response.data;
      Cookies.set('username', credentials.username);
      Cookies.set('role', role);
      Cookies.set('token', access_token);
      Cookies.set('refreshToken', refresh_token);
      Cookies.set('isLoggedIn', 'true');

      showSuccessNotification('Login successful!');

      let dashboardPath = '/';
      switch(role) {
        case 'student':
          dashboardPath = '/student-dashboard';
          break;
        case 'teacher':
          dashboardPath = '/teacher-dashboard';
          break;
        case 'parent':
          dashboardPath = '/parent-dashboard';
          break;
      }
      onLoginSuccess();
      navigate(dashboardPath);
      toggleModal();
    } catch (error) {
      let errorMessage = 'Failed to login. Please check your username and password.';
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      showErrorNotification(errorMessage);
    }
  };


  return (
    <>
      <div className="login-modal">
        <div className="login-modal-content">
          <button onClick={toggleModal} className="close-button">&times;</button>
          <h2>Login to EduBridge</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input type="text" name="username" id="username" required onChange={handleChange} value={credentials.username} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" required onChange={handleChange} value={credentials.password} />
            </div>
            <button type="submit" className="login-button">Login</button>
          </form>
          <p className="register-link">Don't have an account? <button className="register-button" onClick={toggleRegister}> Register here.</button></p>
          <p className="forgot-password-link">Forgot your password? <button className="forgot-password-button" onClick={toggleForgotPassword}> Forgot Password.</button></p>
        </div>
      </div>
      {showRegister && <RegisterationPage toggleModal={toggleRegister} />}
      {showForgotPassword && <ForgotPasswordPage toggleModal={toggleForgotPassword} />}
    </>
  );
}

export default LoginPage;