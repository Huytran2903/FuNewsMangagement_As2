import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Newspaper,
  Users,
  FolderTree,
  FileText,
  Clock,
  User,
  LogOut,
  LogIn,
  Shield,
  Briefcase
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Newspaper size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">FUNews</span>
            <span className="brand-subtitle">Management System</span>
          </div>
        </Link>

        {/* Navigation Links based on role */}
        <nav className="navbar-links">
          {/* Public Link */}
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            <Newspaper size={18} />
            <span>Public News</span>
          </Link>

          {/* Admin Navigation */}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin/accounts"
              className={`nav-link ${isActive('/admin/accounts') ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Accounts</span>
            </Link>
          )}

          {/* Staff Navigation */}
          {isAuthenticated && isStaff && (
            <>
              <Link
                to="/staff/categories"
                className={`nav-link ${isActive('/staff/categories') ? 'active' : ''}`}
              >
                <FolderTree size={18} />
                <span>Categories</span>
              </Link>
              <Link
                to="/staff/news"
                className={`nav-link ${isActive('/staff/news') ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>News Articles</span>
              </Link>
              <Link
                to="/staff/history"
                className={`nav-link ${isActive('/staff/history') ? 'active' : ''}`}
              >
                <Clock size={18} />
                <span>My History</span>
              </Link>
              <Link
                to="/staff/profile"
                className={`nav-link ${isActive('/staff/profile') ? 'active' : ''}`}
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
            </>
          )}
        </nav>

        {/* Auth / User Status */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="user-profile-badge">
              <div className="user-meta">
                <span className="user-name">{user?.accountName}</span>
                <span className={`role-pill ${isAdmin ? 'role-admin' : 'role-staff'}`}>
                  {isAdmin ? (
                    <>
                      <Shield size={12} /> Admin
                    </>
                  ) : (
                    <>
                      <Briefcase size={12} /> Staff
                    </>
                  )}
                </span>
              </div>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
