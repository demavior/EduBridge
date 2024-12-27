import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { showSuccessNotification, showErrorNotification } from '../../App';
import '../../assets/css/student_css/EnrollInClasses.scss';

const EnrollInClasses = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [tokenInput, setTokenInput] = useState('');
    const token = Cookies.get('token');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/enroll-classroom/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setEnrollments(response.data);
        } catch (error) {
            showErrorNotification('Error', 'Error while fetching enrollments');
            console.error(error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/enroll-classroom/', { token: tokenInput }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.data.sampleType === 'TX') {
                navigate(`/text-answer-question/${response.data.sample.classroomId}/sample/${response.data.sample.id}`);
            } else if (response.data.sampleType === 'VDUP') {
                navigate(`/video-answer-question/${response.data.sample.classroomId}/sample/${response.data.sample.id}`);
            }
            fetchEnrollments();
        } catch (error) {
            showErrorNotification('Error', error.response ? error.response.data.error : 'Error while enrolling');
            console.error(error);
        }
    };
    

    const handleClassroomClick = (enrollment) => {
        if (enrollment.sample_type === 'TX') {
            navigate(`/text-answer-question/${enrollment.classroom_id}/sample/${enrollment.sample.id}`);
        } else if (enrollment.sample_type === 'VDUP') {
            navigate(`/video-answer-question/${enrollment.classroom_id}/sample/${enrollment.sample.id}`);
        } else {
            showErrorNotification('Error', 'Access Denied: Unknown sample type.');
        }
    };
    
    

    const handleDrop = async (sampleId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/drop-enrolled-classroom/${sampleId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            showSuccessNotification('Success', 'Dropped from the classroom successfully');
            fetchEnrollments();
        } catch (error) {
            showErrorNotification('Error', 'Error while dropping from the classroom');
            console.error(error);
        }
    };

    return (
        <div className="enroll-page">
            <div className="enroll-container">
                <h4>Enroll in Classroom</h4>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="token">Enter Sample Token:</label>
                        <input type="text" id="token" name="token" className="form-control" value={tokenInput} onChange={e => setTokenInput(e.target.value)}/>
                    </div>
                    <button type="submit" className="enroll-button">Enroll</button>
                </form>
            </div>
            <div className="table-container">
                <h4>Your Enrolled Classrooms</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Classroom Name</th>
                            <th scope="col">Start Time</th>
                            <th scope="col">End Time</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map(enrollment => (
                            <tr key={enrollment.id}>
                                <td className="clickable" onClick={() => handleClassroomClick(enrollment)}>{enrollment.sample.name}</td>
                                <td>{new Date(enrollment.start_time).toLocaleString()}</td>
                                <td>{enrollment.end_time ? new Date(enrollment.end_time).toLocaleString() : 'N/A'}</td>
                                <td><button onClick={() => handleDrop(enrollment.sample.id)}>Drop</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button type="button" className="back-button" onClick={() => navigate('/student-dashboard')}>Back</button>
        </div>
    );
};

export default EnrollInClasses;
