import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/student_css/ViewStudentGrade.scss';

function GradeComponent() {
    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [grades, setGrades] = useState([]);
    const token = Cookies.get('token');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/student-enrollments/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEnrollments(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            setError('Failed to fetch enrollments.');
        }
        setIsLoading(false);
    };

    const fetchGrades = async (enrollmentId) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/student-grades/?enrollmentId=${enrollmentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGrades(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching grades:', error);
            setError('Failed to fetch grades.');
        }
        setIsLoading(false);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='student-grade'>
            <h1>Your Enrollments</h1>
            {enrollments.map((enrollment) => (
                <button key={enrollment.id} onClick={() => {
                    setSelectedEnrollment(enrollment);
                    fetchGrades(enrollment.id);
                }} className="enrollment-selector">
                    <h2>{enrollment.sample_name}</h2>
                </button>
            ))}
            
            {selectedEnrollment && grades.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Answers</th>
                            <th>Grade</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade) => (
                            <tr key={grade.id}>
                                <td>{grade.question_text}</td>
                                <td>{grade.user_answer}</td>
                                <td>{grade.grade.score}</td>
                                <td>{grade.grade.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GradeComponent;
