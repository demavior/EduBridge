import React, { useState } from 'react';
import axios from 'axios';
import '../assets/css/ForgotPasswordPage.scss';
import { showSuccessNotification, showErrorNotification } from '../App';

function ForgotPassword({ toggleModal }) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/user/forgot-password/',
        { email }
      );
      showSuccessNotification("If an account exists with the email you entered, we've sent a password reset link.");
    } catch (error) {
      showErrorNotification('The email you entered is not correct please enter a valid email.');
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="forgot-password-button">Send Reset Link</button>
      </form>
    );
  };

  return (
    <div className="forgot-password-modal">
      <div className="forgot-password-modal-content">
        <button onClick={toggleModal} className="close-button">&times;</button>
        <h2>Reset Your Password</h2>
        {renderForm()}
      </div>
    </div>
  );
}

export default ForgotPassword;
