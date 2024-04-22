import React from 'react';

const ParentGradeDetails = ({ gradeDetails, onBack }) => {
    console.log("Grade Details:", gradeDetails);  // Debugging statement

    if (!gradeDetails || !gradeDetails.grades) {
        return <p>Loading grade details or no grade details available...</p>;
    }

    return (
        <>
            <h2>Grades for {gradeDetails.sample_name} in {gradeDetails.classroom_name}</h2>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Questions</th>
                            <th>Answers</th>
                            <th>Grade</th>
                            <th>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gradeDetails.grades.map((grade) => (
                            <tr key={grade.id}>
                                <td>{grade.question_text}</td>
                                <td>{grade.user_answer}</td>
                                <td>{grade.grade.score}</td>
                                <td>{grade.grade.feedback}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={onBack}>Back</button>
        </>
    );
};

export default ParentGradeDetails;
