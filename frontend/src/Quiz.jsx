'use client'

import React, { useState, useEffect, useRef } from 'react';
import './Quiz.css';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationResult, setValidationResult] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultLoading, setResultLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [userIP, setUserIP] = useState('');
  const selectedAnswerRef = useRef('');

  useEffect(() => {
    fetchQuestions();
    fetchUserIP();
  }, []);

  useEffect(() => {
    if (currentStep > 0 && currentStep <= questions.length) {
      setStartTime(Date.now());
    }
  }, [currentStep, questions.length]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz/questions');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.message);
      } else {
        setQuestions(data.data);
        setAnswers(new Array(data.data.length).fill(''));
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      setUserIP(data.ip);
    } catch (error) {
      console.error("Error fetching user IP:", error);
    }
  };

  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentStep - 1] = option;
    setAnswers(newAnswers);
    selectedAnswerRef.current = option;
  };

  const handleNext = async () => {
    updateAnswer(selectedAnswerRef.current);

    if (currentStep === questions.length) {
      const finalPayload = {
        ipAddress: userIP,
        Answers: answers,
      };

      try {
        setResultLoading(true);
        const response = await fetch('http://localhost:5000/api/quiz/answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalPayload),
        });

        const result = await response.json();
        if (result.error) {
          throw new Error(result.message);
        }

        fetchResult();
      } catch (error) {
        console.error("Error submitting final answers:", error);
        setResultLoading(false);
      }
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
      setStartTime(Date.now());
    }
  };

  const updateAnswer = (answer) => {
    if (answer) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentStep - 1] = answer;
      setAnswers(updatedAnswers);
    }
  };

  const fetchResult = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quiz/');
      const data = await response.json();

      if (data.error || !data.data) {
        throw new Error(data.message || 'Invalid data received');
      }
      
      const correctAnswers = [
        "HyperText Markup Language",
        "15",
        "React.js",
        "Cascading"
      ];

      const validation = data.data[0].Answers.map((answer, index) => ({
        question: questions[index]?.Question || "Question not available",
        answer: answer,
        correct: answer === correctAnswers[index],
        weight: 1,
      }));

      const correctCount = validation.filter((v) => v.correct).length;
      const score = (correctCount / validation.length) * 100;

      setValidationResult(validation);
      setResult({
        score: Math.round(score),
        correctCount,
        incorrectCount: questions.length - correctCount,
      });

      setCurrentStep(questions.length + 1);
    } catch (error) {
      console.error("Error fetching result:", error);
    } finally {
      setResultLoading(false);
    }
  };

  const handleStartAgain = () => {
    setCurrentStep(0);
    setAnswers(new Array(questions.length).fill(''));
    setResult(null);
    setValidationResult([]);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

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

