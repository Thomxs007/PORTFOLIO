import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useScrollReveal from '../hooks/useScrollReveal';
import './Login.css';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const ref = useScrollReveal();

  const handleLogin = (e) => {
    e.preventDefault();
    // A simple, hardcoded password for the frontend-only SPA
    if (password === 'admin123') {
      localStorage.setItem('portfolio_admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="page" ref={ref}>
      <div className="container login-container animate-in">
        <div className="login-card glass-card">
          <div className="login-header">
            <div className="login-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h2>Admin Access</h2>
            <p>Please enter the password to access the admin panel.</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {error && <div className="login-error"><i className="fas fa-exclamation-circle"></i> {error}</div>}
            <button type="submit" className="btn btn-primary btn-full">
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
