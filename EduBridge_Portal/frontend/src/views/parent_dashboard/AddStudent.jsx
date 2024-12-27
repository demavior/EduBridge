import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { showSuccessNotification, showErrorNotification } from '../../App';
import '../../assets/css/parent_css/AddStudent.scss';

const AddStudent = () => {

    const [studentUser, setStudentUser] = useState({ });
    const [errors, setErrors] = useState({});
    const logintoken = Cookies.get('token');
    const navigate = useNavigate()

    const handleChange = (e) => {
        setStudentUser({student_username : e.target.value});
        setErrors({});
      };

    

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!studentUser || studentUser.length < 1) {
            setErrors({ studentUser: "Student Username is required" });
            showErrorNotification(errors)
            return;
        }
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/user/assign-student-parent/', studentUser, {
                headers: {
                    'Authorization': `Bearer ${logintoken}`,
                },
            });

            if (response.status === 200) {
                showSuccessNotification('Student added successful');
                navigate('/view-report');
            } else {
                setErrors(response.data);
            }

        } catch(error) {

            console.log(error.response.data.error)
            if (error.response) {
                console.error('Response error:', error.response.status);
                showErrorNotification(error.response.data.error);
            } else if (error.request) {
                console.error('No response received:', error.request);
                showErrorNotification('No response received. Please check your internet connection.');
            } else {
                console.error('Request error:', error.message);
                showErrorNotification('An unexpected error occurred. Please try again later.');
            }

        }
        setStudentUser({});
    };


    

    return (
        <div className="addStudent-container">
            <h1>Add Student</h1>
            <p>You can add a student to manage their information and contact with a teacher. Please enter the student username below to add the student.</p>
            <input type="text" placeholder="Student Username" onChange={handleChange}/><br />
            <form onSubmit={handleAddStudent} className="form-group">
                <button className='submit-button' type="submit">Add Student</button>
            </form>
            <Link to="/view-report">
                <button className='submit-button'> View Students</button>
            </Link>
        </div>
    );
}

export default AddStudent;
