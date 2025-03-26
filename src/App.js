import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Admin components
import AdminDashboard from './components/Admin/AdminDashboard';
import QuizCreate from './components/Admin/QuizCreate';
import QuizEdit from './components/Admin/QuizEdit';
import StudentResults from './components/Admin/StudentResults';

// Student components
import StudentDashboard from './components/Student/StudentDashboard';
import AttemptQuiz from './components/Student/AttemptQuiz';
import PastPerformance from './components/Student/PastPerformance';

// Common components
import Header from './components/Common/Header';
import NotFound from './components/Common/NotFound';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, userRole } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <div className="container mt-4">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/create-quiz" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <QuizCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/edit-quiz/:id" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <QuizEdit />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/results" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <StudentResults />
                </ProtectedRoute>
              } 
            />
            
            {/* Student routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:id" 
              element={
                <ProtectedRoute requiredRole="student">
                  <AttemptQuiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/performance" 
              element={
                <ProtectedRoute requiredRole="student">
                  <PastPerformance />
                </ProtectedRoute>
              } 
            />
            
            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
