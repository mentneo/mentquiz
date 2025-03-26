import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

export default function AttemptQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', id));
        
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          setQuiz(quizData);
          // Initialize answers array with -1 (no selection)
          setAnswers(new Array(quizData.questions.length).fill(-1));
          // Set default time (3 minutes per question)
          setTimeLeft(quizData.questions.length * 180);
        } else {
          setError('Quiz not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz');
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [id]);

  // Timer effect
  useEffect(() => {
    if (!loading && timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      // Time's up, submit quiz
      handleSubmitQuiz();
    }
  }, [loading, timeLeft, quizCompleted]);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === 'prev' && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    
    for (let i = 0; i < quiz.questions.length; i++) {
      if (answers[i] === quiz.questions[i].correctAnswer) {
        score++;
      }
    }
    
    return {
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100)
    };
  };

  const handleSubmitQuiz = async () => {
    if (quizCompleted) return;
    
    setQuizCompleted(true);
    
    const scoreResult = calculateScore();
    
    try {
      // Save attempt to Firestore
      const attemptRef = await addDoc(collection(db, 'attempts'), {
        quizId: id,
        quizTitle: quiz.title,
        studentId: currentUser.uid,
        studentEmail: currentUser.email,
        answers,
        score: scoreResult.score,
        total: scoreResult.total,
        percentage: scoreResult.percentage,
        attemptDate: serverTimestamp()
      });
      
      // Navigate to results page with state
      navigate('/performance', { 
        state: { 
          justCompleted: true, 
          quizId: id,
          score: scoreResult.score,
          total: scoreResult.total,
          percentage: scoreResult.percentage
        }
      });
    } catch (err) {
      console.error('Error saving quiz attempt:', err);
      setError('Failed to submit quiz. Please try again.');
      setQuizCompleted(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading quiz...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuizQuestion = quiz?.questions[currentQuestion];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2>{quiz.title}</h2>
        <div className="badge bg-primary fs-6">Time left: {formatTime(timeLeft)}</div>
      </div>
      
      <div className="progress mb-4">
        <div 
          className="progress-bar" 
          role="progressbar"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
          aria-valuenow={currentQuestion + 1} 
          aria-valuemin="0" 
          aria-valuemax={quiz.questions.length}
        >
          Question {currentQuestion + 1} of {quiz.questions.length}
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Question {currentQuestion + 1}</h5>
          <p className="card-text">{currentQuizQuestion.question}</p>
          
          <div className="list-group mt-3">
            {currentQuizQuestion.options.map((option, index) => (
              <button
                key={index}
                type="button"
                className={`list-group-item list-group-item-action ${
                  answers[currentQuestion] === index ? 'active' : ''
                }`}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          onClick={() => navigateQuestion('prev')}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={() => navigateQuestion('next')}
          >
            Next
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleSubmitQuiz}
            disabled={quizCompleted}
          >
            Submit Quiz
          </button>
        )}
      </div>
      
      <div className="mt-4">
        <h5>Question Navigation</h5>
        <div className="d-flex flex-wrap gap-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                index === currentQuestion
                  ? 'btn-primary'
                  : answers[index] >= 0
                  ? 'btn-outline-success'
                  : 'btn-outline-secondary'
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
