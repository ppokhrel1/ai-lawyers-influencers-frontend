// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthPage';
import Dashboard from './components/Dashboard';
import PublicAsk from './components/PublicAsk';
import MonitoringPage from './components/Monitoring';
import { AuthProvider, useAuth } from './context/AuthContext';

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-75 py-5 w-100">
      {children}
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(user || token);

  return (
    <Routes>
      <Route path="/" element={<Centered><PublicAsk /></Centered>} />

      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Centered><AuthForm type="login" /></Centered>
        }
      />

      <Route
        path="/register"
        element={
          isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Centered><AuthForm type="register" /></Centered>
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/monitoring"
        element={
          isAuthenticated
            ? <MonitoringPage />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100 bg-white w-100">
          <Navbar />

          <main className="flex-grow-1 d-flex flex-column w-100">
            <div className="flex-grow-1 d-flex flex-column w-100">
              <AppRoutes />
            </div>
          </main>

          <footer className="bg-light py-3 w-100">
            <Container fluid className="flex-grow-1">
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