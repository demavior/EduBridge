import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../../assets/css/teacher_css/UpdateQuestion.scss';
import { showSuccessNotification, showErrorNotification } from '../../App';

const Updatequestion = () => {
    const [classroom, setClassroom] = useState(null);
    const { classroomId  } = useParams();
    const token = Cookies.get('token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/classroom-questions/${classroomId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` },   
                });
                setClassroom({ questions: response.data });
            } catch (error) {
                showErrorNotification('Failed to fetch questions');
            }
        };
    
        fetchQuestions();
    }, [classroomId, token]);
    

   

    const handleQuestionChange = (questionId, e) => {
        const newQuestions = classroom.questions.map(question => {
            if (question.id === questionId) {
                return { ...question, text: e.target.value };
            }
            return question;
        });
        setClassroom({ ...classroom, questions: newQuestions });
    };

    const handleChoiceChange = (questionId, choiceId, e) => {
        const newQuestions = classroom.questions.map(question => {
            if (question.id === questionId) {
                const newChoices = question.choices.map(choice => {
                    if (choice.id === choiceId) {
                        return { ...choice, text: e.target.value };
                    }
                    return choice;
                });
                return { ...question, choices: newChoices };
            }
            return question;
        });
        setClassroom({ ...classroom, questions: newQuestions });
    };

    const handleUpdateAllQuestionsAndChoices = async () => {
        for (const question of classroom.questions) {
            try {
                await axios.put(`http://127.0.0.1:8000/api/update-question/${question.id}/`, question, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                console.log(`Successfully updated question with ID ${question.id}`);
            } catch (error) {
                console.error(`Failed to update question with ID ${question.id}:`, error);
                showErrorNotification(`Failed to update question and choices for question ID ${question.id}`);
                break;
            }
        }
        showSuccessNotification('All questions and choices updated successfully');
    };

    const handleDelete = async (questionId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/delete-questions/${questionId}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            setClassroom({
                ...classroom,
                questions: classroom.questions.filter(question => question.id !== questionId)
            });
            showSuccessNotification('Question deleted successfully');
        } catch (error) {
            showErrorNotification('Failed to delete question');
        }
    };
    

    if (!classroom) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-question-container">
            <h2>Manage Questions for Classroom: {classroom.name}</h2>
            {classroom && classroom.questions && classroom.questions.map((question, index) => (
                <div key={question.id} className="question-block">
                    <h3>Question {index + 1}:</h3>
                    <input
                        type="text"
                        value={question.text}
                        onChange={(e) => handleQuestionChange(question.id, e)}
                    />
                    {question.choices && question.choices.map((choice, choiceIndex) => (
                        <div key={choice.id}>
                            <label>Choice {choiceIndex + 1}:</label>
                            <input
                                type="text"
                                value={choice.text}
                                onChange={(e) => handleChoiceChange(question.id, choice.id, e)}
                            />
                        </div>
                    ))}
                    <button onClick={() => handleDelete(question.id)}>Delete This Question</button>
                </div>
            ))}
            <button onClick={handleUpdateAllQuestionsAndChoices}>Update All Questions</button>
            {/* <button onClick={() => handleDelete()}>Delete Question</button> */}
            <button onClick={() => navigate('/manage-classroom')}>Back to Classroom</button>
        </div>
    );
};

export default Updatequestion;