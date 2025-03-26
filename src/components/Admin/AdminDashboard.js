import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const quizSnapshot = await getDocs(collection(db, 'quizzes'));
        const quizList = [];
        quizSnapshot.forEach((doc) => {
          quizList.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setQuizzes(quizList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes');
        setLoading(false);
      }
    }

    fetchQuizzes();
  }, []);

  async function handleDeleteQuiz(id) {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteDoc(doc(db, 'quizzes', id));
        setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      } catch (err) {
        console.error('Error deleting quiz:', err);
        setError('Failed to delete quiz');
      }
    }
  }

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Link to="/admin/create-quiz" className="btn btn-primary">
          Create New Quiz
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-header">
          <h3>My Quizzes</h3>
        </div>
        <div className="card-body">
          {quizzes.length === 0 ? (
            <p>No quizzes available. Create your first quiz!</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Questions</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id}>
                      <td>{quiz.title}</td>
                      <td>{quiz.category}</td>
                      <td>{quiz.questions?.length || 0}</td>
                      <td>{quiz.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
                      <td>
                        <Link to={`/admin/edit-quiz/${quiz.id}`} className="btn btn-sm btn-info me-2">
                          Edit
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link to="/admin/results" className="btn btn-outline-primary">
          View Student Results
        </Link>
      </div>
    </div>
  );
}
