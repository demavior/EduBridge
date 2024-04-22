import React from 'react';
import '../assets/css/PasswordResetComplete.scss';
import { useNavigate } from 'react-router-dom';

function PasswordResetComplete() {
  const navigate = useNavigate();
  const redirectToLogin = () => {
    navigate('/login');
  };

  return (
    <div className='passwordresetcomplete-model'>
      <div className='passwordresetcomplete-model-content'>
        <button onClick={redirectToLogin} className="close-button">&times;</button>
        <h2>Password Reset Successful</h2>
        <p>Your password has been successfully reset. You can now log in with your new password.</p>
        <button onClick={redirectToLogin}>Log In</button>
      </div>
    </div>
  );
}

export default PasswordResetComplete;
