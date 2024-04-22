import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/teacher_css/CreateClassroom.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';

const CreateQuestion = () => {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [required, setRequired] = useState('TRUE');
    const [numberOptions, setNumberOptions] = useState('');

    const handleCreateQuestion = async (e) => {
        e.preventDefault();

        if (!questionText.trim() || !questionType) {
            showErrorNotification('Please provide a question and choose question type.');
            return;
        }

        const formData = new FormData();
        formData.append('text', questionText);
        formData.append('question_type', questionType);
        formData.append('is_required', required);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/create-question/14/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log(response.data);
            showSuccessNotification('Question Created Successfully');
            //navigate('/create-sample', { state: { dataSet: dataSet, classroomId: response.data.id } });
            Cookies.set('classroomId', response.data.id);
        } catch (error) {
            if (error.response && error.response.data) {
                let errorMessage = '';
                const errorData = error.response.data;
                for (const key in errorData) {
                    if (errorData.hasOwnProperty(key)) {
                        errorMessage += `${key}: ${errorData[key].join(' ')} `;
                    }
                }
                showErrorNotification(errorMessage.trim());
            } else {
                showErrorNotification('An unexpected error occurred. Please try again later.');
            }
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    let tableComponent = null;



    return (
        <div className="createClassroom-container">
            <h1>Create Question</h1>
            <div className="createClassroom-content">
                <div className="form-group">
                    <h3>Enter a question:*
                        <span className="tooltip">
                            <span className="tooltip-text">Please enter a question.</span>
                        </span>
                    </h3>
                    <input
                        type="text"
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group radio-group">
                    <h3>
                        Question Type:*
                        <span className="tooltip">
                            <span className="tooltip-text">Choose whether to upload a file for definitions or not.</span>
                        </span>
                    </h3>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="question_type"
                            value="MC"
                            checked={questionType === 'MC'}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Multiple Choice
                    </div>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="question_type"
                            value="SC"
                            checked={questionType === 'SC'}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Single Choice
                    </div>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="question_type"
                            value="CM"
                            checked={questionType === 'CM'}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Comment
                    </div>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="question_type"
                            value="DD"
                            checked={questionType === 'DD'}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Dropdown
                    </div>
                    <div className="radio-label">
                        <input
                            type="radio"
                            name="question_type"
                            value="CB"
                            checked={questionType === 'CB'}
                            onChange={(e) => setQuestionType(e.target.value)}
                        /> Checkbox
                    </div>
                </div>
                {['MC','SC','DD'].includes(questionType) && (
                    <div className="form-group">
                        <h3>Number of Options:*
                            <span className="tooltip">
                                <span className="tooltip-text">Enter the number of options for the question.</span>
                            </span>
                        </h3>
                        <input
                            type="text"
                            value={numberOptions}
                            onChange={(e) => setNumberOptions(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="form-group checkbox">
                    <h3>
                        Is the question required?:*
                        <span className="tooltip">
                            <span className="tooltip-text">Indicate if the question is required.</span>
                        </span>
                    </h3>
                    <label>
                        <input type="checkbox" name="required" checked={required === 'TRUE'} onChange={(e) => setRequired(e.target.checked ? 'TRUE' : 'FALSE')} />
                        Required
                    </label>
                </div>
                {tableComponent}
                <button className="submit-button" onClick={handleCreateQuestion}>Create Question</button>
            </div>
        </div>
    );
};

export default CreateQuestion;