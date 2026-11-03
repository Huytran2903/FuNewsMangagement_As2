import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, Shield, Briefcase } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login(email.trim(), password);
      if (loggedUser.accountRole === 1) {
        navigate('/admin/accounts');
      } else if (loggedUser.accountRole === 2) {
        navigate('/staff/news');
      } else {
        navigate(from);
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (quickEmail, quickPassword) => {
    setEmail(quickEmail);
    setPassword(quickPassword);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-badge">
            <LogIn size={28} />
          </div>
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">
            Access FUNewsManagementSystem with your member account
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-group">
              <Mail className="input-icon" size={18} />
              <input
                id="login-email"
                type="email"
                required
                className="form-control"
                placeholder="name@funews.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-group">
              <Lock className="input-icon" size={18} />
              <input
                id="login-password"
                type="password"
                required
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="demo-credentials-box">
          <span className="demo-title">Quick Demo Sign In:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn btn-outline-secondary btn-xs"
              onClick={() => handleQuickLogin('admin@funews.com', 'admin123')}
            >
              <Shield size={12} /> Admin (admin@funews.com)
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-xs"
              onClick={() => handleQuickLogin('staff@funews.com', 'staff123')}
            >
              <Briefcase size={12} /> Staff (staff@funews.com)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
