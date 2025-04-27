
// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Legal QA</Link>
        
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/monitoring">Monitoring</Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex">
            {user ? (
              <button className="btn btn-outline-light" onClick={logout}>Logout</button>
            ) : (<div>
                  <Link className="btn btn-outline-light me-2" to="/login">Login</Link>
                  <Link className="btn btn-outline-light" to="/register">Register</Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
