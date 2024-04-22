import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { showSuccessNotification, showErrorNotification } from '../../App';
import '../../assets/css/student_css/VideoAnswerQuestion.scss';


const VideoUploadAnswerQuestion = ({  }) => {
    const [videoData, setVideoData] = useState(null);
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

    const fetchVideoData = async (videoId = null) => {
        const params = videoId ? `?video_id=${videoId}` : '';
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/video/${classroomId}/samples/${sampleId}/${params}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                const {video_data, questions } = response.data;
                const combinedData = { ...video_data, questions };
                setVideoData(combinedData);
            } else {
                throw new Error('Invalid data received from the server');
            }
        } catch (error) {
            const message = error.response ? error.response.data : 'Network error';
            showErrorNotification(message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        for (const questionId in answers) {
            const question = textData.questions.find(q => q.id === parseInt(questionId));
            if (question && question.type === 'DD' && Array.isArray(answers[questionId]) && answers[questionId].length > 1) {
                showErrorNotification('Only one choice is allowed for dropdown questions.');
                return; 
            }
        }
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/video/${classroomId}/samples/${sampleId}/`, { answers }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 201) {
                showSuccessNotification('Answers submitted successfully');
                navigate('/enroll-in-classes'); 
                fetchVideoData();
                setAnswers({});
            } else {
                throw new Error('Error submitting answers');
            }
        } catch (error) {
            const message = error.response ? error.response.data : 'Error submitting answers';
            showErrorNotification(message);
        }
    };

    if (!videoData) return <div>Loading...</div>;

    return (
        <div className="video-answer-container">
            <video controls src={videoData.url}></video>
            <div className="viewing-video-info">
                Viewing Video # {videoData.sr_number} {videoData.sample?.name} in {videoData.classroom?.name}
                <p>Check out this <a href={`${window.location.origin}${textData.classroom.definitions_upload}`} target="_blank" rel="noopener noreferrer">reference</a></p>
            <form onSubmit={handleSubmit}>
                {videoData.questions.map((question, index) => (
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
                        {question.question_type === 'MC' || question.question_type === 'SC' ? (
                            question.choices.map(choice => (
                                <div key={choice.id}>
                                    <input
                                        type="radio"
                                        name={question.id}
                                        value={choice.id}
                                        checked={answers[question.id] === choice.id}
                                        onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                    /> {choice.text}
                                </div>
                            ))
                        ) : question.question_type === 'CB' ? (
                            <input
                                type="checkbox"
                                checked={answers[question.id] || false}
                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.checked })}
                            />
                        ) : question.question_type === 'CM' ? (
                            <textarea
                                value={answers[question.id] || ""}
                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                            />
                        ) : null}
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
            <button className="back-button" onClick={() => navigate('/enroll-in-classes')}>Back to Enrollments</button>
            </div>
        </div>
    );
};

export default VideoUploadAnswerQuestion;