import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/css/PasswordResetConfirm.scss';
import { showSuccessNotification, showErrorNotification } from '../App';

function PasswordResetConfirm({ toggleModal }) {
  const [newPassword, setNewPassword] = useState('');
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://127.0.0.1:8000/password-reset-confirm/`, { uid, token, newPassword });
      showSuccessNotification('Password reset successful');
      navigate('/password-reset-complete');
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      showErrorNotification('Password reset failed');
    }
    toggleModal();
  };

  return (
    <div className='passwordconfirm-model'>
      <div className='passwordconfirm-model-content'>
        <button onClick={toggleModal} className="close-button">&times;</button>
        <h2>Reset Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label>
              New Password:
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </label>
          </div>
          <button type="submit" className='passwordconfirm-button'>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default PasswordResetConfirm;
