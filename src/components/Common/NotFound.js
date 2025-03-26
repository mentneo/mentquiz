import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center my-5">
      <h1 className="display-1">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-3">
        Go to Homepage
      </Link>
    </div>
  );
}
