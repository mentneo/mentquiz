import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Engineering Quiz App
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {currentUser ? (
              <>
                {userRole === 'admin' ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/results">
                        Results
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/">
                        Quizzes
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/performance">
                        My Results
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    {currentUser.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a onClick={handleLogout} className="dropdown-item" href="#">
                        Logout
                      </a>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
