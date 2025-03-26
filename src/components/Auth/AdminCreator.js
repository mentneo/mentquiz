import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

// This is a development-only component to help create admin users
// Remove or disable access to this in production

export default function AdminCreator() {
  const [email, setEmail] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const ADMIN_SECRET = 'quiz-admin-secret'; // Change this to your desired secret

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (adminSecret !== ADMIN_SECRET) {
      setMessage('Invalid admin secret key');
      setLoading(false);
      return;
    }

    try {
      // Find the user by email
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('email', '==', email).get();

      if (userQuery.empty) {
        setMessage('No user found with this email');
        setLoading(false);
        return;
      }

      const userDoc = userQuery.docs[0];
      
      // Update the user to admin role
      await updateDoc(doc(db, 'users', userDoc.id), {
        role: 'admin'
      });

      setMessage(`Success! User ${email} has been made an admin. Please log in again.`);
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage(`Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="card">
      <div className="card-header bg-warning text-white">
        <h5 className="mb-0">Admin Account Creator (Development Only)</h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.includes('Success') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="admin-email" className="form-label">User Email</label>
            <input
              type="email"
              className="form-control"
              id="admin-email"
              placeholder="Email address of user to promote"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="admin-secret" className="form-label">Admin Secret</label>
            <input
              type="password"
              className="form-control"
              id="admin-secret"
              placeholder="Secret key to authorize admin creation"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-warning"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Make User Admin'}
          </button>
        </form>
        
        <div className="mt-3">
          <small className="text-muted">
            Use this only in development. In production, use the Firebase Console directly.
          </small>
        </div>
      </div>
    </div>
  );
}
