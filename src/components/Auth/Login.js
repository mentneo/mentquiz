import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (error) {
      console.error(error);
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Invalid login credentials. Please try again.');
      } else {
        setError('Failed to sign in. Check your credentials.');
      }
    }
    
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await googleSignIn();
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Failed to sign in with Google. Please try again later.');
    }
    
    setLoading(false);
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-center mb-4">Login</h2>
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
          </div>
          <button disabled={loading} className="btn btn-primary w-100" type="submit">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <button 
          onClick={handleGoogleSignIn} 
          className="btn btn-outline-secondary w-100 mt-3"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Sign in with Google'}
        </button>
        <div className="text-center mt-3">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
