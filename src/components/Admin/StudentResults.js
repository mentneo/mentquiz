import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [indexNeeded, setIndexNeeded] = useState(false);
  const [indexUrl, setIndexUrl] = useState('');

  useEffect(() => {
    async function fetchResults() {
      try {
        // Simple query without ordering to avoid index requirements
        const resultsSnapshot = await getDocs(collection(db, 'attempts'));
        
        const resultsList = [];
        resultsSnapshot.forEach((doc) => {
          resultsList.push({
            id: doc.id,
            ...doc.data(),
            attemptDate: doc.data().attemptDate?.toDate().toLocaleString() || 'N/A'
          });
        });
        
        // Sort on client side
        resultsList.sort((a, b) => {
          if (!a.attemptDate || !b.attemptDate) return 0;
          return new Date(b.attemptDate) - new Date(a.attemptDate);
        });
        
        setResults(resultsList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching results:', err);
        
        // Extract index URL if that's the error
        if (err.message && err.message.includes('requires an index')) {
          const urlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
          if (urlMatch) {
            setIndexNeeded(true);
            setIndexUrl(urlMatch[0]);
          }
        }
        
        setError('Failed to load student results');
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading results...</div>;
  }

  return (
    <div>
      <h2>Student Quiz Results</h2>
      
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
      
      {results.length === 0 ? (
        <div className="alert alert-info">No quiz attempts have been recorded yet.</div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td>{result.studentEmail}</td>
                      <td>{result.quizTitle}</td>
                      <td>
                        {result.score} / {result.total}
                      </td>
                      <td>
                        <span className={`badge ${
                          result.percentage >= 70
                            ? 'bg-success'
                            : result.percentage >= 50
                            ? 'bg-warning'
                            : 'bg-danger'
                        }`}>
                          {result.percentage}%
                        </span>
                      </td>
                      <td>{result.attemptDate}</td>
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
