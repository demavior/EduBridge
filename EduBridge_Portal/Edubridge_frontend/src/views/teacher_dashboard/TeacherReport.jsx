import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/teacher_css/TeacherReport.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';

const TeacherReport = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedSample, setSelectedSample] = useState(null);
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [grades, setGrades] = useState({});

    const token = Cookies.get('token');

    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/list-classrooms/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setClassrooms(response.data);
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            }
        };
        fetchClassrooms();
    }, [token]);

    const handleSampleClick = async (classroomId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/list-samples/${classroomId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedSample(response.data[0]);
            fetchStudents(response.data[0].id); 
        } catch (error) {
            console.error('Error fetching samples:', error);
        }
    };
    
    const fetchStudents = async (sampleId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/teacher/report/${sampleId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStudents(response.data.enrollments);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleStudentClick = async (sampleId, userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/teacher/report/${sampleId}/user/${userId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuestions(response.data);
            setSelectedStudent(userId);
        } catch (error) {
            console.error('Error fetching student responses:', error);
        }
    };
    
    const handleGradeChange = (responseId, updatedValues) => {
        setGrades({
            ...grades,
            [responseId]: {
                ...grades[responseId],
                ...updatedValues
            }
        });
    };

    const submitGrades = async () => {
        const requests = questions.map(response => {
            if (grades[response.id]) {
                return axios.put(`http://127.0.0.1:8000/api/teacher/grading/update-response/${response.id}/`, {
                    grade: {
                        score: grades[response.id].score.toString(),
                        feedback: grades[response.id].feedback
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
        }).filter(request => request !== undefined); 
    
        try {
            await Promise.all(requests);
            showSuccessNotification('Grades updated successfully');
            navegate('/teacher-dashboard');
        } catch (error) {
            showErrorNotification('Error updating grades');
            console.error('Error updating grades:', error);
        }
    };
     
        
    if (classrooms.length === 0) {
        return <div>Loading classrooms...</div>;
    }

    return (
        <div className="teacher-report">
            <h1>Teacher Report</h1>
            <table>
                <thead>
                    <tr>
                        <th>Classroom Name</th>
                        <th>Sample Name</th>
                    </tr>
                </thead>
                <tbody>
                {classrooms.map(({ id, name }) => (
                    <tr key={id}>
                        <td>{name}</td>
                        <td>
                            <button onClick={() => handleSampleClick(id)}>View Samples</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedSample && (
                <div className="student-list">
                    <h2>Students in Sample</h2>
                    <ul>
                        {students.map(enrollment => (
                            <li key={enrollment.id}>
                                <button onClick={() => handleStudentClick(selectedSample.id, enrollment.user_id)}>
                                    {enrollment.user_name}
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        )}
            {selectedStudent && (
                <div className="grading-section">
                    <h2>Student Details and Grading</h2>
                    {questions.map(response => (
                        <div key={response.id} className="response-item">
                            <p>Question: {response.question_text} - Answer: {response.user_answer}</p>
                            <div className="grading-inputs">
                                <input
                                    type="number"
                                    step="0.01" 
                                    placeholder="Enter grade out of 100"
                                    value={grades[response.id]?.score || ''}
                                    onChange={(e) => handleGradeChange(response.id, {
                                        ...grades[response.id],
                                        score: e.target.value
                                    })}
                                />
                                <textarea
                                    placeholder="Enter feedback"
                                    value={grades[response.id]?.feedback || ''}
                                    onChange={(e) => handleGradeChange(response.id, {
                                        ...grades[response.id],
                                        feedback: e.target.value
                                    })}
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={submitGrades}>Submit Grades</button>
                </div>
            )}
        </div>
    );          
};

export default TeacherReport;