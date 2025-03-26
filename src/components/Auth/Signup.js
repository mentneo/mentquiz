import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
      
      // Provide more specific error messages
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please provide a valid email address.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    }
    
    setLoading(false);
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <small className="form-text text-muted">Password must be at least 6 characters long</small>
          </div>
          <div className="mb-3">
            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button disabled={loading} className="btn btn-primary w-100" type="submit">
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
}
