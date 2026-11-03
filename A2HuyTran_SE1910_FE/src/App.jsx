import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PublicNews from './pages/PublicNews';
import Login from './pages/Login';
import AccountManagement from './pages/admin/AccountManagement';
import CategoryManagement from './pages/staff/CategoryManagement';
import NewsManagement from './pages/staff/NewsManagement';
import NewsHistory from './pages/staff/NewsHistory';
import Profile from './pages/staff/Profile';

// Protected Route Guard for Admin (Role 1)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loading">Checking authorization...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

// Protected Route Guard for Staff (Role 2)
const StaffRoute = ({ children }) => {
  const { isAuthenticated, isStaff, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loading">Checking authorization...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isStaff) return <Navigate to="/" replace />;

  return children;
};

// Protected Route for Authenticated Users (Admin or Staff)
const AuthenticatedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-loading">Checking authorization...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public News View */}
          <Route path="/" element={<PublicNews />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/accounts"
            element={
              <AdminRoute>
                <AccountManagement />
              </AdminRoute>
            }
          />

          {/* Staff Routes */}
          <Route
            path="/staff/categories"
            element={
              <StaffRoute>
                <CategoryManagement />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/news"
            element={
              <StaffRoute>
                <NewsManagement />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/history"
            element={
              <StaffRoute>
                <NewsHistory />
              </StaffRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <p>© 2026 FUNewsManagementSystem — SBA301 Assignment 02 by HuyTran (SE1910)</p>
          <p className="footer-sub">Spring Boot 3 RESTful API & ReactJS Architecture</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
