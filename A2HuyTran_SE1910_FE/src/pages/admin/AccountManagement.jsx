import React, { useState, useEffect } from 'react';
import { accountService } from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Shield,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

const AccountManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states for Create / Update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountName: '',
    accountEmail: '',
    accountRole: 2, // Default Staff
    accountPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Confirm delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Alert message banner
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchAccounts = async (query = searchQuery) => {
    setLoading(true);
    try {
      const res = await accountService.getAll(query);
      setAccounts(res.data || []);
    } catch (err) {
      showNotification('danger', 'Failed to load accounts: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [searchQuery]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingAccount(null);
    setFormData({
      accountName: '',
      accountEmail: '',
      accountRole: 2,
      accountPassword: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (account) => {
    setEditingAccount(account);
    setFormData({
      accountName: account.accountName,
      accountEmail: account.accountEmail,
      accountRole: account.accountRole,
      accountPassword: '', // blank unless changing
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.accountName.trim()) {
      errors.accountName = 'Account name is required';
    }
    if (!formData.accountEmail.trim()) {
      errors.accountEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.accountEmail)) {
      errors.accountEmail = 'Invalid email address format';
    }
    if (!editingAccount && !formData.accountPassword) {
      errors.accountPassword = 'Password is required for new accounts';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    try {
      if (editingAccount) {
        await accountService.update(editingAccount.accountID, formData);
        showNotification('success', `Account '${formData.accountName}' updated successfully.`);
      } else {
        await accountService.create(formData);
        showNotification('success', `Account '${formData.accountName}' created successfully.`);
      }
      setIsModalOpen(false);
      fetchAccounts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save account';
      showNotification('danger', msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDeleteDialog = (account) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!accountToDelete) return;
    setDeleteLoading(true);
    try {
      await accountService.delete(accountToDelete.accountID);
      showNotification('success', `Account '${accountToDelete.accountName}' deleted successfully.`);
      setIsDeleteDialogOpen(false);
      setAccountToDelete(null);
      fetchAccounts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot delete account.';
      showNotification('danger', msg);
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Title & Actions */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={28} className="title-icon" />
            Account Management
          </h1>
          <p className="page-subtitle">
            Create, update, search, and manage system accounts with role assignments.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <UserPlus size={18} />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Notification banner */}
      {notification.message && (
        <div className={`alert alert-${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search accounts by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => fetchAccounts()}
          title="Refresh table"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Accounts Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Account Name</th>
              <th>Email</th>
              <th style={{ width: '130px' }}>Role</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-loading">
                  <RefreshCw className="spin-icon" size={24} />
                  <span>Loading accounts...</span>
                </td>
              </tr>
            ) : accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="table-empty">
                  No accounts found.
                </td>
              </tr>
            ) : (
              accounts.map((acc) => (
                <tr key={acc.accountID}>
                  <td className="font-mono">#{acc.accountID}</td>
                  <td className="font-semibold">{acc.accountName}</td>
                  <td>{acc.accountEmail}</td>
                  <td>
                    <span className={`role-pill ${acc.accountRole === 1 ? 'role-admin' : 'role-staff'}`}>
                      {acc.accountRole === 1 ? (
                        <>
                          <Shield size={12} /> Admin (1)
                        </>
                      ) : (
                        <>
                          <Briefcase size={12} /> Staff (2)
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        title="Edit Account"
                        onClick={() => handleOpenEditModal(acc)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        title="Delete Account"
                        onClick={() => handleOpenDeleteDialog(acc)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Popup Dialog: Create / Update Account */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAccount ? `Update Account #${editingAccount.accountID}` : 'Create New Account'}
        maxWidth="modal-md"
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="acc-name">Account Name *</label>
            <input
              id="acc-name"
              type="text"
              className={`form-control ${formErrors.accountName ? 'is-invalid' : ''}`}
              placeholder="e.g. John Doe"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            />
            {formErrors.accountName && (
              <span className="invalid-feedback">{formErrors.accountName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="acc-email">Email Address *</label>
            <input
              id="acc-email"
              type="email"
              className={`form-control ${formErrors.accountEmail ? 'is-invalid' : ''}`}
              placeholder="e.g. jdoe@funews.com"
              value={formData.accountEmail}
              onChange={(e) => setFormData({ ...formData, accountEmail: e.target.value })}
            />
            {formErrors.accountEmail && (
              <span className="invalid-feedback">{formErrors.accountEmail}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="acc-role">Account Role *</label>
            <select
              id="acc-role"
              className="form-control"
              value={formData.accountRole}
              onChange={(e) => setFormData({ ...formData, accountRole: Number(e.target.value) })}
            >
              <option value={1}>Admin (Role 1)</option>
              <option value={2}>Staff (Role 2)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="acc-password">
              {editingAccount ? 'New Password (leave empty to keep current)' : 'Password *'}
            </label>
            <input
              id="acc-password"
              type="password"
              className={`form-control ${formErrors.accountPassword ? 'is-invalid' : ''}`}
              placeholder="••••••••"
              value={formData.accountPassword}
              onChange={(e) => setFormData({ ...formData, accountPassword: e.target.value })}
            />
            {formErrors.accountPassword && (
              <span className="invalid-feedback">{formErrors.accountPassword}</span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : editingAccount ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Popup Confirmation Dialog: Delete Account */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Account Deletion"
        message={
          accountToDelete
            ? `Are you sure you want to delete account '${accountToDelete.accountName}' (ID: ${accountToDelete.accountID})? If this account has created any news articles, the deletion will be rejected.`
            : 'Are you sure you want to delete this account?'
        }
        confirmText="Yes, Delete"
        cancelText="No, Keep Account"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default AccountManagement;
