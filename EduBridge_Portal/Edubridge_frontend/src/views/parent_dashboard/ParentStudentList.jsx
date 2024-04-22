import React from 'react';

const StudentList = ({ students, onViewClasses }) => {
    return (
        <>
            <h2>Students</h2>
            {students.length > 0 ? (
            <div className="parentStudents">
                {students.map((student) => (
                    <div key={student.user.username} className="contact-card">
                        <h3>{student.user.username}</h3>
                        <p>Email: {student.user.email}</p>
                        <button className="view-classes-btn" onClick={() => onViewClasses(student)}>
                            View Classes
                        </button>
                    </div>
                ))}
            </div>
            ) : (
                <div className="no-students">
                <p>There are no students assigned.</p>
                </div>
            )}
        </>
    );
};

export default StudentList;
