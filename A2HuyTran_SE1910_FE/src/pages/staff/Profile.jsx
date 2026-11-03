import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, Mail, CheckCircle2, AlertCircle, Save, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    accountID: '',
    accountName: '',
    accountEmail: '',
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await profileService.getProfile();
      setProfile(res.data);
    } catch (err) {
      setNotification({
        type: 'danger',
        message: 'Failed to load profile: ' + (err.response?.data?.message || err.message),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    if (!profile.accountName.trim()) {
      setNotification({ type: 'danger', message: 'Account name cannot be empty.' });
      return;
    }

    if (newPassword || currentPassword) {
      if (!currentPassword) {
        setNotification({ type: 'danger', message: 'Current password is required to change password.' });
        return;
      }
      if (newPassword !== confirmPassword) {
        setNotification({ type: 'danger', message: 'New password and confirmation do not match.' });
        return;
      }
      if (newPassword.length < 4) {
        setNotification({ type: 'danger', message: 'New password must be at least 4 characters.' });
        return;
      }
    }

    setSaving(true);
    try {
      const payload = {
        accountName: profile.accountName.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      };

      const res = await profileService.updateProfile(payload);
      setProfile((prev) => ({ ...prev, accountName: res.data.accountName }));
      updateUser({ accountName: res.data.accountName });

      // Clear password inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setNotification({
        type: 'success',
        message: 'Your profile has been updated successfully!',
      });
    } catch (err) {
      setNotification({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <User size={28} className="title-icon" />
            My Profile
          </h1>
          <p className="page-subtitle">
            Manage your personal staff account details and security settings.
          </p>
        </div>
      </div>

      {notification.message && (
        <div className={`alert alert-${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="profile-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-banner">
            <div className="avatar-circle">
              {profile.accountName ? profile.accountName.charAt(0).toUpperCase() : 'U'}
            </div>
            <h2 className="avatar-name">{profile.accountName || 'Staff Member'}</h2>
            <span className="role-pill role-staff">Staff Member (Role 2)</span>
          </div>

          <form onSubmit={handleUpdateProfile} className="profile-form">
            <div className="form-group">
              <label className="form-label" htmlFor="prof-id">Account ID</label>
              <input
                id="prof-id"
                type="text"
                disabled
                className="form-control"
                value={`#${profile.accountID}`}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-email">Email Address</label>
              <div className="input-group">
                <Mail className="input-icon" size={18} />
                <input
                  id="prof-email"
                  type="email"
                  disabled
                  className="form-control"
                  value={profile.accountEmail || ''}
                />
              </div>
              <small className="form-text-subtle">Email address cannot be changed.</small>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-name">Display Name *</label>
              <div className="input-group">
                <User className="input-icon" size={18} />
                <input
                  id="prof-name"
                  type="text"
                  required
                  className="form-control"
                  placeholder="Your full name"
                  value={profile.accountName || ''}
                  onChange={(e) => setProfile({ ...profile, accountName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-divider">
              <span className="divider-text">
                <KeyRound size={15} /> Change Password (Optional)
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prof-curr-pass">Current Password</label>
              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <input
                  id="prof-curr-pass"
                  type="password"
                  className="form-control"
                  placeholder="Enter current password to authorize change"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="prof-new-pass">New Password</label>
                <input
                  id="prof-new-pass"
                  type="password"
                  className="form-control"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label" htmlFor="prof-conf-pass">Confirm New Password</label>
                <input
                  id="prof-conf-pass"
                  type="password"
                  className="form-control"
                  placeholder="Re-type new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions-right">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                <Save size={18} />
                <span>{saving ? 'Saving Changes...' : 'Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
