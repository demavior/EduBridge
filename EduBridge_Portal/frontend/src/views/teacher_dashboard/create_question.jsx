import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionForm from './questionForm';
import Cookies from 'js-cookie';
import '../../assets/css/teacher_css/CreateQuestion.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';

const CreateQuestion = () => {
    const token = Cookies.get('token');
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();
    const { classroomId } = useParams();

    const addQuestion = () => {
        setQuestions([...questions, { text: '', question_type: '', choices: [], is_required: false }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const addChoiceToQuestion = (questionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].choices.push({ text: '' });
        setQuestions(newQuestions);
    };

    const handleChoiceChange = (questionIndex, choiceIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].choices[choiceIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Questions:', questions);
        const formattedQuestions = questions.map(q => ({
            text: q.text.trim(),
            question_type: q.question_type,
            is_required: q.is_required,
            choices: q.choices.map(c => ({ text: c.text.trim() })).filter(c => c.text)
        })).filter(q => q.text);


        try {
            console.log('Sending data:', { questions, classroomId });
            const response = await axios.post(`http://127.0.0.1:8000/api/create-question/${Number(classroomId)}/`, { questions: formattedQuestions }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                });

            console.log('Response:', response.data);
            showSuccessNotification('Questions added successfully');
            navigate('/manage-classroom');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            showErrorNotification('Failed to add questions');
        }
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, qIndex) => qIndex !== index));
    };
    

    
    return (
        <div className="create-question-container">
            <h2>Add Question for the classroom: {classroomId.name}</h2>
            <form onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <QuestionForm
                        key={index}
                        question={question}
                        onQuestionChange={(field, value) => handleQuestionChange(index, field, value)}
                        onAddChoice={() => addChoiceToQuestion(index)}
                        onChoiceChange={(choiceIndex, value) => handleChoiceChange(index, choiceIndex, value)}
                        onRemoveQuestion={() => removeQuestion(index)}
                    />
                ))}
                <div className="button-group">
                    <button type="button" className="add-question" onClick={addQuestion}>Add Question</button>
                    <button type="submit" className="submit-button">Submit Questions</button>
                </div>
                <button type="button" className="back-button" onClick={() => navigate('/manage-classroom')}>Back</button>
            </form>
        </div>
    );
}

export default CreateQuestion;
