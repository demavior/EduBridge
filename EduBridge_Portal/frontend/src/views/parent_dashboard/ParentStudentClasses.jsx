import React from 'react';

const ParentStudentClasses = ({ student, classes, onBack, onSelectClass }) => {
    return (
        <>
            <h2>{student.user.username}'s Classes</h2>
            <div className="studentClasses">
                <table>
                    <thead>
                        <tr>
                        <th>Class Name</th>
                        <th>Sample</th>
                        <th>Teacher</th>
                        <th>Grades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((classs) => (
                            <tr key={classs.classroom.id}>
                                <td>{classs.classroom.name}</td>
                                <td>{classs.classroom.sample}</td>
                                <td>{classs.classroom.teacher}</td>
                                <td><button className="back-btn" onClick={() => onSelectClass(classs)}>See details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button className="back-btn" onClick={onBack}>Back to Students</button>
        </>
    );
};

export default ParentStudentClasses;