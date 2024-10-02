import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Results.css';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quiz, correctAnswers, userAnswers } = location.state;

  // Calculate score
  const totalQuestions = quiz.length;
  const score = quiz.reduce((acc, question, index) => {
    return acc + (userAnswers[index] === correctAnswers[index] ? 1 : 0);
  }, 0);

  // Determine background color based on score
  const scoreBackgroundColor = score <= 1 ? 'red' : score <= 3 ? 'yellow' : 'green';

  const handleNewQuiz = () => {
    navigate('/'); // Redirect to QuizMaker
  };

  // Function to decode HTML entities
  const decodeHtml = (html) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  };

  return (
    <div className="results-container">
      <h2>Results</h2>
      <ul className="results-list">
        {quiz.map((question, index) => (
          <li key={index} className="result-item">
            <p>{decodeHtml(question.question)}</p>
            <div className="answers">
              {question.answers.map((answer, i) => {
                const isCorrect = answer === correctAnswers[index];
                const isSelected = answer === userAnswers[index];
                return (
                  <button
                    key={i}
                    className={`answer-button ${isCorrect ? 'correct' : isSelected ? 'incorrect' : ''}`}
                    disabled
                  >
                    {decodeHtml(answer)}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
      <div className="score" style={{ backgroundColor: scoreBackgroundColor }}>
        You scored {score} out of {totalQuestions}
      </div>
      <button onClick={handleNewQuiz} className="new-quiz-button">Create a new quiz</button>
    </div>
  );
};

export default Results;
