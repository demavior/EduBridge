import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParentStudentClasses from './ParentStudentClasses';
import ParentStudentList from './ParentStudentList';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/parent_css/ParentReport.scss';
import { showErrorNotification } from '../../App';
import ParentGradeDetails from './ParentGradeDetails';


const ParentReport = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState(null);


    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/user/parent-student/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setStudents(response.data);

        } catch (error) {
            showErrorNotification('Failed to fetch Students');
        }
    };


    const handleViewClasses = async (student) => {

        setSelectedStudent(student);

        try {
            const response = await axios.get('http://127.0.0.1:8000/api/list-student-enrollments/'+ student.user.username +'/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setClasses(response.data);

        } catch (error) {
            showErrorNotification('Failed to fetch Classes');
        }

    };

    const handleBack = () => {
        if (selectedClass) {
            setSelectedClass(null); 
        } else {
            setSelectedStudent(null); 
        }
    };

    const handleSelectClass = async (classData) => {
        const enrollmentId = classData.id; 
        console.log("Selected class data:", classData);
        console.log(`Fetching grades for enrollment ID: ${enrollmentId}`);
        try {
            if (!enrollmentId) {
                throw new Error("Enrollment ID is missing from the selected class data");
            }
            const response = await axios.get(`http://127.0.0.1:8000/api/parent-view-grades/${enrollmentId}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setSelectedClass(response.data);
        } catch (error) {
            console.error('Failed to fetch grade details:', error);
            showErrorNotification('Failed to fetch grade details');
        }
    };   

    return (
        <div className="parentReport-container">
            <h1>Parent Report</h1>
            {!selectedStudent ? (
                <ParentStudentList students={students} onViewClasses={handleViewClasses} />
            ) : !selectedClass ? (
                <ParentStudentClasses student={selectedStudent} classes={classes} onBack={handleBack} onSelectClass={handleSelectClass} />
            ) : (
                <ParentGradeDetails gradeDetails={selectedClass} onBack={handleBack} />
            )}
            <button type="button" className="back-btn" onClick={() => navigate('/add-student')}>Add Student</button>
        </div>
    );
};

export default ParentReport;
