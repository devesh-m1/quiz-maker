import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './QuizMaker.css';

const QuizMaker = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [quiz, setQuiz] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState(Array(5).fill(null));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://opentdb.com/api_category.php');
        setCategories(response.data.trivia_categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const createQuiz = async () => {
    try {
      const response = await axios.get(`https://opentdb.com/api.php?amount=5&category=${selectedCategory}&difficulty=${difficulty}`);
      const quizData = response.data.results.map(question => {
        const answers = shuffleArray([...question.incorrect_answers, question.correct_answer]);
        return {
          ...question,
          answers, // Store shuffled answers
        };
      });

      setQuiz(quizData);
      setCorrectAnswers(quizData.map(question => question.correct_answer));
      setUserAnswers(Array(quizData.length).fill(null)); // Reset for new quiz
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  const handleAnswerClick = (questionIndex, answer) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionIndex] = answer;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    navigate('/results', {
      state: {
        quiz,
        correctAnswers,
        userAnswers,
      },
    });
  };

  const allAnswered = userAnswers.every(answer => answer !== null); // Check if all questions are answered

  // Function to decode HTML entities
  const decodeHtml = (html) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    return textArea.value;
  };

  return (
    <div className="quiz-maker">
      <h1>Quiz Maker</h1>
      <div className="controls">
        <select id="categorySelect" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <select id="difficultySelect" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button id="createBtn" onClick={createQuiz} className="create-quiz-button">Create Quiz</button>
      </div>
      {quiz.length > 0 && (
        <div className="quiz-container">
          <h2>Quiz</h2>
          <ul>
            {quiz.map((question, index) => (
              <li key={index}>
                <p>{decodeHtml(question.question)}</p>
                <div className="answers">
                  {question.answers.map((answer, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerClick(index, answer)}
                      className={`answer-button ${userAnswers[index] === answer ? 'selected' : ''}`}
                    >
                      {decodeHtml(answer)}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          {allAnswered && (
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizMaker;
