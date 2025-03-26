import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

export default function PastPerformance() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [indexNeeded, setIndexNeeded] = useState(false);
  const [indexUrl, setIndexUrl] = useState('');
  const { currentUser } = useAuth();
  const location = useLocation();
  
  const justCompleted = location.state?.justCompleted || false;
  const justCompletedQuizId = location.state?.quizId || null;
  
  useEffect(() => {
    async function fetchAttempts() {
      if (!currentUser) return;
      
      try {
        // Simplified query without orderBy to avoid index requirements
        const q = query(
          collection(db, 'attempts'),
          where('studentId', '==', currentUser.uid)
        );
        
        const attemptsSnapshot = await getDocs(q);
        
        const attemptsList = [];
        attemptsSnapshot.forEach((doc) => {
          const data = doc.data();
          attemptsList.push({
            id: doc.id,
            ...data,
            attemptDate: data.attemptDate?.toDate().toLocaleString() || 'N/A',
            isRecent: justCompleted && data.quizId === justCompletedQuizId
          });
        });
        
        // Sort on client side instead of in query
        attemptsList.sort((a, b) => {
          if (!a.attemptDate || !b.attemptDate) return 0;
          return new Date(b.attemptDate) - new Date(a.attemptDate);
        });
        
        setAttempts(attemptsList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching attempts:', err);
        
        // Extract index URL if that's the error
        if (err.message && err.message.includes('requires an index')) {
          const urlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
          if (urlMatch) {
            setIndexNeeded(true);
            setIndexUrl(urlMatch[0]);
          }
        }
        
        setError('Failed to load your quiz history');
        setLoading(false);
      }
    }

    fetchAttempts();
  }, [currentUser, justCompleted, justCompletedQuizId]);

  if (loading) {
    return <div className="text-center mt-5">Loading your results...</div>;
  }

  return (
    <div>
      <h2>My Quiz Performance</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
          {indexNeeded && (
            <div className="mt-2">
              <p>You need to create a Firestore index for this feature to work properly.</p>
              <a 
                href={indexUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-warning"
              >
                Create Required Index
              </a>
              <p className="mt-2 small">After creating the index, please refresh this page.</p>
            </div>
          )}
        </div>
      )}
      
      {justCompleted && (
        <div className="alert alert-success">
          Your quiz has been submitted successfully!
        </div>
      )}
      
      {attempts.length === 0 ? (
        <div className="alert alert-info">You haven't attempted any quizzes yet.</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr 
                      key={attempt.id}
                      className={attempt.isRecent ? 'table-primary' : ''}
                    >
                      <td>{attempt.quizTitle}</td>
                      <td>
                        {attempt.score} / {attempt.total}
                      </td>
                      <td>
                        <span className={`badge ${
                          attempt.percentage >= 70
                            ? 'bg-success'
                            : attempt.percentage >= 50
                            ? 'bg-warning'
                            : 'bg-danger'
                        }`}>
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td>{attempt.attemptDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
