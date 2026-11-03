import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  FolderTree,
  FolderPlus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal states for Create / Update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDesciption: '',
    parentCategoryID: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Confirm delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notifications
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchCategories = async (query = searchQuery) => {
    setLoading(true);
    try {
      const res = await categoryService.getAll(query);
      setCategories(res.data || []);
    } catch (err) {
      showNotification('danger', 'Failed to load categories: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      categoryName: '',
      categoryDesciption: '',
      parentCategoryID: '',
      isActive: true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      categoryName: cat.categoryName,
      categoryDesciption: cat.categoryDesciption || '',
      parentCategoryID: cat.parentCategory ? String(cat.parentCategory.categoryID) : '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const payload = {
      categoryName: formData.categoryName.trim(),
      categoryDesciption: formData.categoryDesciption.trim(),
      parentCategoryID: formData.parentCategoryID ? Number(formData.parentCategoryID) : null,
      isActive: Boolean(formData.isActive),
    };

    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.categoryID, payload);
        showNotification('success', `Category '${payload.categoryName}' updated successfully.`);
      } else {
        await categoryService.create(payload);
        showNotification('success', `Category '${payload.categoryName}' created successfully.`);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category';
      showNotification('danger', msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenDeleteDialog = (cat) => {
    setCategoryToDelete(cat);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    try {
      await categoryService.delete(categoryToDelete.categoryID);
      showNotification('success', `Category '${categoryToDelete.categoryName}' deleted successfully.`);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot delete category.';
      showNotification('danger', msg);
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FolderTree size={28} className="title-icon" />
            Category Management
          </h1>
          <p className="page-subtitle">
            Manage news categories, hierarchical parent categories, and publication visibility.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <FolderPlus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Notification banner */}
      {notification.message && (
        <div className={`alert alert-${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search categories by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => fetchCategories()}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Categories Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Parent Category</th>
              <th style={{ width: '120px' }}>Status</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="table-loading">
                  <RefreshCw className="spin-icon" size={24} />
                  <span>Loading categories...</span>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.categoryID}>
                  <td className="font-mono">#{cat.categoryID}</td>
                  <td className="font-semibold">{cat.categoryName}</td>
                  <td className="text-muted">{cat.categoryDesciption || '—'}</td>
                  <td>
                    {cat.parentCategory ? (
                      <span className="badge badge-secondary">
                        {cat.parentCategory.categoryName}
                      </span>
                    ) : (
                      <span className="text-subtle">None (Root)</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${cat.isActive ? 'status-active' : 'status-inactive'}`}>
                      {cat.isActive ? (
                        <>
                          <CheckCircle2 size={12} /> Active (1)
                        </>
                      ) : (
                        <>
                          <XCircle size={12} /> Inactive (0)
                        </>
                      )}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        title="Edit Category"
                        onClick={() => handleOpenEditModal(cat)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        title="Delete Category"
                        onClick={() => handleOpenDeleteDialog(cat)}
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

      {/* Popup Dialog: Create / Update Category */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Update Category #${editingCategory.categoryID}` : 'Create New Category'}
        maxWidth="modal-md"
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label" htmlFor="cat-name">Category Name *</label>
            <input
              id="cat-name"
              type="text"
              className={`form-control ${formErrors.categoryName ? 'is-invalid' : ''}`}
              placeholder="e.g. Artificial Intelligence"
              value={formData.categoryName}
              onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            />
            {formErrors.categoryName && (
              <span className="invalid-feedback">{formErrors.categoryName}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cat-desc">Category Description</label>
            <textarea
              id="cat-desc"
              rows={3}
              className="form-control"
              placeholder="Brief summary of articles in this category..."
              value={formData.categoryDesciption}
              onChange={(e) => setFormData({ ...formData, categoryDesciption: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="cat-parent">Parent Category (Optional)</label>
            <select
              id="cat-parent"
              className="form-control"
              value={formData.parentCategoryID}
              onChange={(e) => setFormData({ ...formData, parentCategoryID: e.target.value })}
            >
              <option value="">None (Top-level Category)</option>
              {categories
                .filter((c) => !editingCategory || c.categoryID !== editingCategory.categoryID)
                .map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>
                    {c.categoryName}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Publication Status</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === true}
                  onChange={() => setFormData({ ...formData, isActive: true })}
                />
                <span>Active (1) - Visible to Public</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="isActive"
                  checked={formData.isActive === false}
                  onChange={() => setFormData({ ...formData, isActive: false })}
                />
                <span>Inactive (0) - Hidden</span>
              </label>
            </div>
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
              {submitLoading ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog: Delete Category */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Category Deletion"
        message={
          categoryToDelete
            ? `Are you sure you want to delete category '${categoryToDelete.categoryName}' (ID: ${categoryToDelete.categoryID})? If any news article belongs to this category, the deletion will be rejected.`
            : 'Are you sure you want to delete this category?'
        }
        confirmText="Yes, Delete"
        cancelText="No, Keep Category"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default CategoryManagement;
