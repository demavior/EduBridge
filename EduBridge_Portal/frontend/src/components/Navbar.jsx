import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/css/Navbar.scss'; 
import logo from '../assets/logo/logo.jpg';
import LoginPage from '../views/LoginPage';
import {LogoutPage } from '../views/LogoutPage';
import { useAuth } from '../AuthContext';
import Cookies from 'js-cookie';

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = Cookies.get('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  const handleLoginToggle = () => {
    setShowLogin(!showLogin);
  };

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setShowLogin(false); 
  }, [setIsLoggedIn, setShowLogin]);

  const handleLogout = () => {
    LogoutPage(navigate).then(() => {
      setIsLoggedIn(false);
      Cookies.remove('isLoggedIn');
  
      setTimeout(() => {
        alert("You have been logged out!");
        navigate('/');
      }, 2000);
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="EduBridge Logo" height="50" />
            EduBridge
          </Link>
          <div className="navbar-nav">
            <Link to="/" className="nav-link">Home</Link>
            {isLoggedIn && userRole === 'admin' && (
              <Link to="/django-admin" className="nav-link">Admin</Link>
            )}
            {isLoggedIn && userRole === 'student' && (
              <Link to="/student-dashboard" className="nav-link">Student Dashboard</Link>
            )}
            {isLoggedIn && userRole === 'teacher' && (
              <Link to="/teacher-dashboard" className="nav-link">Teacher Dashboard</Link>
            )}
            {isLoggedIn && userRole === 'parent' && (
              <Link to="/parent-dashboard" className="nav-link">Parent Dashboard</Link>
            
            )}
            {isLoggedIn ? (
              <button onClick={handleLogout} className='nav-link'>Logout</button>
            ) : (
              <button onClick={handleLoginToggle} className="nav-link">Login|Register</button> 
            )}
            <Link to="FAQ" className="nav-link">FAQ</Link>
          </div>
        </div>
      </nav>
      {showLogin && <LoginPage toggleModal={handleLoginToggle} onLoginSuccess={handleLoginSuccess} />}
    </>
  );
}

export default Navbar;