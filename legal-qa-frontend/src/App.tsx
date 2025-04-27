import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthPage';
import Dashboard from './components/Dashboard';
import PublicAsk from './components/PublicAsk';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Full width layout with white background */}
        <div className="d-flex flex-column min-vh-100 bg-white">
          {/* Navigation bar */}
          <Navbar />
          
          {/* Main content area - takes all available space */}
          <main className="flex-grow-1">
            {/* Full-width container with centered content */}
            <Container fluid className="px-0">
              <Routes>
                <Route path="/" element={
                  <div className="d-flex justify-content-center align-items-center min-vh-75 py-5">
                    <PublicAsk />
                  </div>
                } />
                <Route path="/login" element={
                  <div className="d-flex justify-content-center align-items-center min-vh-75 py-5">
                    <AuthForm type="login" />
                  </div>
                } />
                <Route path="/register" element={
                  <div className="d-flex justify-content-center align-items-center min-vh-75 py-5">
                    <AuthForm type="register" />
                  </div>
                } />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Container>
          </main>
          
          {/* Footer */}
          <footer className="bg-light py-3">
            <Container>
              <p className="text-center text-muted mb-0">
                © {new Date().getFullYear()} Legal QA System
              </p>
            </Container>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export default App;
