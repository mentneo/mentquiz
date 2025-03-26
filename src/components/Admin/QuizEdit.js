import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function QuizEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const quizDoc = await getDoc(doc(db, 'quizzes', id));
        
        if (quizDoc.exists()) {
          const quizData = quizDoc.data();
          setTitle(quizData.title || '');
          setCategory(quizData.category || '');
          setDescription(quizData.description || '');
          setQuestions(quizData.questions || []);
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

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!title.trim()) {
      return setError('Quiz title is required');
    }
    
    if (!category.trim()) {
      return setError('Category is required');
    }
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) {
        return setError(`Question ${i + 1} text is missing`);
      }
      
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].trim()) {
          return setError(`Option ${j + 1} for question ${i + 1} is missing`);
        }
      }
    }
    
    try {
      setSaving(true);
      setError('');
      
      await updateDoc(doc(db, 'quizzes', id), {
        title,
        category,
        description,
        questions
      });
      
      navigate('/admin');
    } catch (err) {
      console.error('Error updating quiz:', err);
      setError('Failed to update quiz');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading quiz data...</div>;
  }

  return (
    <div>
      <h2>Edit Quiz</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Quiz Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          ></textarea>
        </div>

        <h3 className="mt-4">Questions</h3>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Question {qIndex + 1}</h5>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeQuestion(qIndex)}
                disabled={questions.length === 1}
              >
                Remove
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor={`question-${qIndex}`} className="form-label">Question Text</label>
                <input
                  type="text"
                  className="form-control"
                  id={`question-${qIndex}`}
                  value={question.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Options</label>
                {question.options.map((option, oIndex) => (
                  <div key={oIndex} className="input-group mb-2">
                    <div className="input-group-text">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                        required
                      />
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      required
                    />
                  </div>
                ))}
                <small className="form-text text-muted">Select the radio button next to the correct answer.</small>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-secondary mb-4" onClick={addQuestion}>
          Add Question
        </button>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
