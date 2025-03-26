import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        // Fetch all quizzes
        const quizSnapshot = await getDocs(
          query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'))
        );
        
        const quizList = [];
        quizSnapshot.forEach((doc) => {
          quizList.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
          });
        });
        
        setQuizzes(quizList);
        
        // Fetch attempted quizzes by this student
        if (currentUser) {
          const attemptsSnapshot = await getDocs(
            query(
              collection(db, 'attempts'),
              where('studentId', '==', currentUser.uid)
            )
          );
          
          const attemptedIds = [];
          attemptsSnapshot.forEach((doc) => {
            attemptedIds.push(doc.data().quizId);
          });
          
          setAttemptedQuizzes(attemptedIds);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes');
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, [currentUser]);

  const hasAttempted = (quizId) => {
    return attemptedQuizzes.includes(quizId);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2>Available Quizzes</h2>
      
      {quizzes.length === 0 ? (
        <div className="alert alert-info">No quizzes available at the moment.</div>
      ) : (
        <div className="row">
          {quizzes.map((quiz) => (
            <div className="col-md-4 mb-4" key={quiz.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{quiz.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{quiz.category}</h6>
                  <p className="card-text">
                    {quiz.description || 'No description available.'}
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      {quiz.questions?.length || 0} questions
                    </small>
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  {hasAttempted(quiz.id) ? (
                    <>
                      <span className="badge bg-success me-2">Completed</span>
                      <Link to={`/performance?quiz=${quiz.id}`} className="btn btn-outline-info btn-sm">
                        View Result
                      </Link>
                    </>
                  ) : (
                    <Link to={`/quiz/${quiz.id}`} className="btn btn-primary">
                      Start Quiz
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4">
        <Link to="/performance" className="btn btn-outline-secondary">
          View All Past Results
        </Link>
      </div>
    </div>
  );
}