import React from 'react';

function QuestionForm({ question, onQuestionChange, onAddChoice, onChoiceChange, onRemoveQuestion}) {
    return (
        <div>
            <input
                type="text"
                placeholder="Enter a question"
                value={question.text}
                onChange={(e) => onQuestionChange('text', e.target.value)}
                required
            />
            <select
                value={question.question_type}
                onChange={(e) => onQuestionChange('question_type', e.target.value)}
                required
            >
                <option value="" disabled>Please select the question type</option>
                <option value="SC">Single Choice</option>
                <option value="MC">Multiple Choice</option>
                <option value="CM">Comment</option>
                <option value="DD">Dropdown</option>
                {/*<option value="CB">Checkbox</option> */}
            </select>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    checked={question.is_required}
                    onChange={(e) => onQuestionChange('is_required', e.target.checked)}
                />
                <label htmlFor={`is_required_$`}>Is this question required?</label> {}
            </div>
            {question.choices.map((choice, index) => (
                <div key={index}>
                    <input
                        type="text"
                        placeholder="Enter choice text"
                        value={choice.text}
                        onChange={(e) => onChoiceChange(index, e.target.value)}
                        required
                    />
                </div>
            ))}
            <button type="button" onClick={onAddChoice} className='add-button'>Add Choice</button>
            <br></br>
            <button type="button" onClick={onRemoveQuestion} className="delete-button">Remove Question</button>
        </div>

    );
}

export default QuestionForm;
