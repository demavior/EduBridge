import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showSuccessNotification, showErrorNotification } from '../../App';

const Enrollment = () => {

    const [classToken, setClassToken] = useState({ });
    const [errors, setErrors] = useState({});
    const logintoken = Cookies.get('token');
    const navigate = useNavigate()

    const handleChange = (e) => {
        setClassToken({token : e.target.value});
        // clear errors when input changes
        setErrors({});
      };

    

    const handleEnrollment = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!classToken || classToken.length < 1) {
            setErrors({ classToken: "Class Token is required" });
            showErrorNotification(errors)
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/enroll-classroom/', classToken, {
                headers: {
                    'Authorization': `Bearer ${logintoken}`,
                },
            });

            if (response.status === 200) {
                showSuccessNotification('Enrollment successful');
                navigate('/classes');
            } else {
                throw new Error('Failed to enroll in class');
            }

        } catch(error) {

            if (error.response) {
                console.error('Response error:', error.response.status);
                showErrorNotification('An error occurred. Please try again later.');
            } else if (error.request) {
                console.error('No response received:', error.request);
                showErrorNotification('No response received. Please check your internet connection.');
            } else {
                console.error('Request error:', error.message);
                showErrorNotification('An unexpected error occurred. Please try again later.');
            }

        }
        setClassToken({});
    };


    

    return (
        <div className="createClassroom-container">
            <h1>Enrollment</h1>
            <p>Welcome to the Enrollment Page. You can enroll in classes here. Please enter the class token below to enroll in a class.</p>
            <input type="text" placeholder="Token" onChange={handleChange}/><br />
            <form onSubmit={handleEnrollment} className="form-group">
                <button className='submit-button' type="submit">Enroll</button>
            </form>
            <Link to="/classes">
                <button className='submit-button'> View Enrollments</button>
            </Link>
        </div>
    );
}

export default Enrollment;
