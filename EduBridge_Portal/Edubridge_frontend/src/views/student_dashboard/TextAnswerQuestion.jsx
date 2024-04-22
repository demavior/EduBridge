import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { showSuccessNotification, showErrorNotification } from '../../App';
import '../../assets/css/student_css/TextAnswerQuestion.scss';

const TextAnswerQuestion = ({ }) => {
    const [textData, setTextData] = useState(null);
    const [answers, setAnswers] = useState({});
    const { classroomId, sampleId } = useParams();
    const navigate = useNavigate();
    const token = Cookies.get('token');

    useEffect(() => {
        if (classroomId && sampleId) {
            fetchTextData(sampleId);
        } else {
        }
    }, [classroomId, sampleId]);
    

    const fetchTextData = async (textId = null) => {
        const params = textId ? `?text_number=${textId}` : '';
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/text/${classroomId}/samples/${sampleId}/${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data) {
                const { text_data, questions } = response.data;
                const combinedData = { ...text_data, questions };
                setTextData(combinedData);
            } else {
                throw new Error("Invalid data received from the server");
            }
        } catch (error) {
            const message = error.response ? error.response.data : 'Network error';
            showErrorNotification(message);
        }
    };
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('submitted answers:', answers);
        const formattedResponses = {};
        textData.questions.forEach(question => {
            const answer = answers[question.id];
            if (question.question_type === 'MC') {
                formattedResponses[question.id] = { answer: answer || [] };
            } else if (question.question_type === 'CB') {
                formattedResponses[question.id] = { checkboxAnswer: answer === 'true' };
            } else if (question.question_type === 'CM') {
                formattedResponses[question.id] = { text_answer: answer || '' };
            } else if (question.question_type === 'SC' || question.question_type === 'DD') {
                formattedResponses[question.id] = { answer: [Number(answer)] };
                
            } else {
                formattedResponses[question.id] = { answer: Number(answer) };
            }
        });

        console.log('Formatted Responses:', formattedResponses);
    
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/text/${classroomId}/samples/${sampleId}/`,
                formattedResponses, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 201) {
                showSuccessNotification('Answers submitted successfully');
                navigate('/enroll-in-classes');
            } else {
                throw new Error('Error submitting answers');
            }
        } catch (error) {
            const message = error.response ? error.response.data : 'Network error';
            showErrorNotification(message);
        }
    };

    if (!textData) return <div>Loading...</div>;

    return (
        <div className="text-answer-container">
            <h3>{textData.text}</h3>
            <div className="viewing-text-info">
                Viewing Text # {textData.sr_number} {textData.sample?.name} in {textData.classroom?.name}
                <p>Check out this <a href={`${window.location.origin}${textData.classroom.definitions_upload}`} target="_blank" rel="noopener noreferrer">reference</a></p>
            </div>
            <form onSubmit={handleSubmit}>
                {textData.questions.map((question, index) => (
                    <div key={index}>
                        <label className="question-label" style={{fontWeight: 'bold'}}>Question {index + 1}: {question.text}</label>
                        {question.question_type === 'DD' && (
                            <select
                                value={answers[question.id] || ''}
                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                            >
                                <option value="">Please select an option</option>
                                {question.choices.map(choice => (
                                    <option key={choice.id} value={choice.id}>{choice.text}</option>
                                ))}
                            </select>
                        )}
                        {question.question_type === 'MC' && question.choices.map(choice => (
                            <div key={choice.id}>
                                <input
                                    type="checkbox"
                                    name={question.id}
                                    value={choice.id}
                                    checked={answers[question.id]?.includes(choice.id) || false}
                                    onChange={(e) => {
                                        const newAnswers = [...(answers[question.id] || [])];
                                        if (e.target.checked) {
                                            newAnswers.push(choice.id);
                                        } else {
                                            const index = newAnswers.indexOf(choice.id);
                                            newAnswers.splice(index, 1);
                                        }
                                        setAnswers({ ...answers, [question.id]: newAnswers });
                                    }}
                                /> {choice.text}
                            </div>
                        ))}
                        {question.question_type === 'SC' && question.choices.map(choice => (
                            <div key={choice.id}>
                                <input
                                    type="radio"
                                    name={`question_${question.id}`}
                                    value={choice.id}
                                    checked={answers[question.id] == choice.id}  
                                    onChange={(e) => setAnswers({ ...answers, [question.id]: Number(e.target.value) })}
                                /> {choice.text}
                            </div>
                        ))}
                        {question.question_type === 'CM' && (
                            <textarea
                                value={answers[question.id] || ""}
                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                            />
                        )}
                    </div>
                ))}
                <button type="submit">Submit</button>
                <button type="button" className="back-button" onClick={() => navigate('/enroll-in-classes')}>Back to Enrollments</button>
            </form>
        </div>
    );     
};

export default TextAnswerQuestion;
