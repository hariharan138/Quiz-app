'use client'

import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';

// Main Quiz component
export default function Quiz() {
  // State variables to manage data and UI flow
  const [questions, setQuestions] = useState([]); // Stores quiz questions
  const [answers, setAnswers] = useState([]); // Tracks user's answers
  const [currentStep, setCurrentStep] = useState(0); // Tracks the current step/question
  const [validationResult, setValidationResult] = useState([]); // Stores validation of answers
  const [result, setResult] = useState(null); // Stores the final result
  const [loading, setLoading] = useState(true); // Manages loading state for fetching questions
  const [resultLoading, setResultLoading] = useState(false); // Loading state for result submission
  const [startTime, setStartTime] = useState(null); // Tracks when a question is started
  const [userIP, setUserIP] = useState(''); // Stores user's IP address
  const selectedAnswerRef = useRef(''); // Tracks the currently selected answer

  // Effect to fetch quiz questions and user IP when the component loads
  useEffect(() => {
    fetchQuestions();
    fetchUserIP();
  }, []);

  // Effect to set the start time whenever the current step changes
  useEffect(() => {
    if (currentStep > 0 && currentStep <= questions.length) {
      setStartTime(Date.now());
    }
  }, [currentStep, questions.length]);

  // Fetch quiz questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz/questions');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message);
      } else {
        setQuestions(data.data); // Populate the questions
        setAnswers(new Array(data.data.length).fill('')); // Initialize answers array
        setLoading(false); // Loading completed
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false); // Stop loading on error
    }
  };

  // Fetch user's IP address using a public API
  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIP(data.ip); // Set the user's IP
    } catch (error) {
      console.error("Error fetching user IP:", error);
    }
  };

  // Update user's answer for the current question
  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = option;
    setAnswers(newAnswers);
    selectedAnswerRef.current = option; // Store the selected answer
  };

  // Handle the "Next" button click
  const handleNext = async () => {
    updateAnswer(selectedAnswerRef.current); // Save the selected answer

    if (currentStep === questions.length) {
      // If the user has answered the last question, submit all answers
      const finalPayload = {
        ipAddress: userIP,
        Answers: answers,
      };

      try {
        setResultLoading(true); // Indicate loading during submission
        const response = await fetch('http://localhost:5000/api/quiz/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });

        const result = await response.json();
        if (result.error) {
          throw new Error(result.message);
        }

        fetchResult(); // Fetch and process the result
      } catch (error) {
        console.error("Error submitting final answers:", error);
        setResultLoading(false);
      }
    } else {
      // Move to the next question
      setCurrentStep((prevStep) => prevStep + 1);
      setStartTime(Date.now());
    }
  };

  // Helper function to update an answer in the answers array
  const updateAnswer = (answer) => {
    if (answer) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentStep - 1] = answer;
      setAnswers(updatedAnswers);
    }
  };

  // Fetch and calculate the quiz result
  const fetchResult = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz/');
      const data = await response.json();

      if (data.error || !data.data) {
        throw new Error(data.message || 'Invalid data received');
      }
      
      // Predefined correct answers (could be dynamic in real scenarios)
      const correctAnswers = [
        "HyperText Markup Language",
        "15",
        "React.js",
        "Cascading"
      ];

      // Validate answers and calculate the score
      const validation = data.data[0].Answers.map((answer, index) => ({
        question: questions[index]?.Question || "Question not available",
        answer: answer,
        correct: answer === correctAnswers[index],
        weight: 1, // Assuming equal weight for all questions
      }));

      const correctCount = validation.filter((v) => v.correct).length;
      const score = (correctCount / validation.length) * 100;

      setValidationResult(validation); // Save validation results
      setResult({
        score: Math.round(score),
        correctCount,
        incorrectCount: questions.length - correctCount,
      });

      setCurrentStep(questions.length + 1); // Move to the result screen
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setResultLoading(false);
    }
  };

  // Restart the quiz
  const handleStartAgain = () => {
    setCurrentStep(0); // Reset step
    setAnswers(new Array(questions.length).fill('')); // Clear answers
    setResult(null); // Clear results
    setValidationResult([]); // Reset validation
  };

  // Render loading state
  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Render start screen
  if (currentStep === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-card start-card">
          <img src="https://miro.medium.com/v2/resize:fit:1400/0*cUILfzmk0ieO-K-i.png" alt="Upraised" className="logo" />
          <div className="Quiz-round">
            <h3>Quiz</h3>
          </div>
          <button className="start-button" onClick={() => setCurrentStep(1)}>
            Start
          </button>
        </div>
      </div>
    );
  }

  // Render result screen
  if (currentStep > questions.length) {
    if (resultLoading || !result) {
      return (
        <div className="quiz-container">
          <div className="quiz-card result-card">
            <h2>Loading results...</h2>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-container">
        <div className="quiz-card result-card">
          <h2>Your result</h2>
          <div className="gauge-wrapper">
            <div className="gauge">
              <div className="ofcircle">
                <div className="gauge-value">{result.score}%</div>
              </div>
            </div>
          </div>
          <div className="result-stats">
            <div className="stat correct">
              <span className="stat-number">{result.correctCount}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="stat incorrect">
              <span className="stat-number">{result.incorrectCount}</span>
              <span className="stat-label">Incorrect</span>
            </div>
          </div>

          <button className="start-again-button" onClick={handleStartAgain}>
            Start Again
          </button>
        </div>
      </div>
    );
  }

  // Render the current question
  const currentQuestion = questions[currentStep - 1];

  return (
    <div className="quiz-container">
      <div className="quiz-card question-card">
        <div className="step-indicator">
          <span className="current-step">{currentStep}</span>
          <span className="total-steps">/{questions.length}</span>
        </div>
        <h2>{currentQuestion?.Question}</h2>
        {currentQuestion?.image && (
          <img src={currentQuestion.image} alt="Question" className="question-image" />
        )}
        <div className="options">
          {currentQuestion?.options.map((option, index) => (
            <label
              key={index}
              className={`option ${answers[currentStep - 1] === option ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion._id}`}
                value={option}
                checked={answers[currentStep - 1] === option}
                onChange={() => handleAnswer(option)}
              />
              <span className="option-text">{option}</span>
              {answers[currentStep - 1] === option && <span className="checkmark">✓</span>}
            </label>
          ))}
        </div>
        <button
          className="next-button"
          onClick={handleNext}
          disabled={!answers[currentStep - 1]}
        >
          {currentStep === questions.length ? 'Submit' : 'Next'}
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
