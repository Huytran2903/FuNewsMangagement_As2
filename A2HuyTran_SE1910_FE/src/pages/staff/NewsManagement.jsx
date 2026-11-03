import React, { useState, useEffect } from 'react';
import { newsService, categoryService, tagService } from '../../services/api';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import {
  FileText,
  FilePlus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Tag as TagIcon,
  Plus,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const NewsManagement = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Article Modal states (Create / Update)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    newsArticleID: '',
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryID: '',
    newsStatus: true,
    tagIDs: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Quick Tag Creation Modal inside News Management
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagNote, setNewTagNote] = useState('');
  const [tagError, setTagError] = useState('');

  // Delete Article confirmation dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification banner
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchData = async (query = searchQuery) => {
    setLoading(true);
    try {
      const [artRes, catRes, tagRes] = await Promise.all([
        newsService.getAll(query),
        categoryService.getAll(),
        tagService.getAll(),
      ]);
      setArticles(artRes.data || []);
      setCategories(catRes.data || []);
      setTags(tagRes.data || []);
    } catch (err) {
      showNotification('danger', 'Failed to load news articles: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 5000);
  };

  const handleOpenCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      newsArticleID: 'NA' + Math.floor(1000 + Math.random() * 9000),
      newsTitle: '',
      headline: '',
      newsContent: '',
      newsSource: '',
      categoryID: categories.length > 0 ? String(categories[0].categoryID) : '',
      newsStatus: true,
      tagIDs: [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (art) => {
    setEditingArticle(art);
    setFormData({
      newsArticleID: art.newsArticleID,
      newsTitle: art.newsTitle,
      headline: art.headline,
      newsContent: art.newsContent || '',
      newsSource: art.newsSource || '',
      categoryID: art.category ? String(art.category.categoryID) : '',
      newsStatus: art.newsStatus !== undefined ? art.newsStatus : true,
      tagIDs: art.tags ? art.tags.map((t) => t.tagID) : [],
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const toggleTagSelection = (tagID) => {
    setFormData((prev) => {
      const exists = prev.tagIDs.includes(tagID);
      return {
        ...prev,
        tagIDs: exists ? prev.tagIDs.filter((id) => id !== tagID) : [...prev.tagIDs, tagID],
      };
    });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.newsArticleID.trim()) {
      errors.newsArticleID = 'Article ID is required';
    }
    if (!formData.newsTitle.trim()) {
      errors.newsTitle = 'Article title is required';
    }
    if (!formData.headline.trim()) {
      errors.headline = 'Headline is required';
    }
    if (!formData.categoryID) {
      errors.categoryID = 'Category is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitLoading(true);
    const payload = {
      newsArticleID: formData.newsArticleID.trim(),
      newsTitle: formData.newsTitle.trim(),
      headline: formData.headline.trim(),
      newsContent: formData.newsContent.trim(),
      newsSource: formData.newsSource.trim(),
      categoryID: Number(formData.categoryID),
      newsStatus: Boolean(formData.newsStatus),
      tagIDs: formData.tagIDs,
    };

    try {
      if (editingArticle) {
        await newsService.update(editingArticle.newsArticleID, payload);
        showNotification('success', `News article '${payload.newsTitle}' updated successfully.`);
      } else {
        await newsService.create(payload);
        showNotification('success', `News article '${payload.newsTitle}' created successfully.`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save news article';
      showNotification('danger', msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleCreateNewTag = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) {
      setTagError('Tag name is required');
      return;
    }
    try {
      const res = await tagService.create({
        tagName: newTagName.trim(),
        note: newTagNote.trim(),
      });
      const createdTag = res.data;
      setTags((prev) => [...prev, createdTag]);
      // Auto select the new tag in formData
      setFormData((prev) => ({
        ...prev,
        tagIDs: [...prev.tagIDs, createdTag.tagID],
      }));
      setNewTagName('');
      setNewTagNote('');
      setTagError('');
      setIsTagModalOpen(false);
      showNotification('success', `Tag '#${createdTag.tagName}' created!`);
    } catch (err) {
      setTagError(err.response?.data?.message || 'Failed to create tag');
    }
  };

  const handleOpenDeleteDialog = (art) => {
    setArticleToDelete(art);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleteLoading(true);
    try {
      await newsService.delete(articleToDelete.newsArticleID);
      showNotification('success', `News article '${articleToDelete.newsTitle}' deleted successfully.`);
      setIsDeleteDialogOpen(false);
      setArticleToDelete(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete article.';
      showNotification('danger', msg);
      setIsDeleteDialogOpen(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FileText size={28} className="title-icon" />
            News Article Management
          </h1>
          <p className="page-subtitle">
            Create, edit, publish, categorize, and tag news articles across the university portal.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenCreateModal}
        >
          <FilePlus size={18} />
          <span>Create New Article</span>
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
            placeholder="Search news by title, headline, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => fetchData()}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* News Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>ID</th>
              <th>Article Title & Headline</th>
              <th>Category</th>
              <th style={{ width: '130px' }}>Status</th>
              <th>Tags</th>
              <th>Created By</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-loading">
                  <RefreshCw className="spin-icon" size={24} />
                  <span>Loading news articles...</span>
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  No news articles found.
                </td>
              </tr>
            ) : (
              articles.map((art) => (
                <tr key={art.newsArticleID}>
                  <td className="font-mono">{art.newsArticleID}</td>
                  <td>
                    <div className="font-semibold text-primary">{art.newsTitle}</div>
                    <div className="text-muted text-sm">{art.headline}</div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">
                      {art.category?.categoryName || 'Unassigned'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${art.newsStatus ? 'status-active' : 'status-inactive'}`}>
                      {art.newsStatus ? (
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
                    <div className="table-tags-wrapper">
                      {art.tags && art.tags.length > 0 ? (
                        art.tags.map((t) => (
                          <span key={t.tagID} className="tag-chip">
                            #{t.tagName}
                          </span>
                        ))
                      ) : (
                        <span className="text-subtle">No tags</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm font-medium">{art.createdBy?.accountName || 'Unknown'}</div>
                    <div className="text-subtle text-xs">
                      {art.createdDate ? art.createdDate.substring(0, 10) : ''}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        type="button"
                        className="btn-action btn-action-edit"
                        title="Edit Article"
                        onClick={() => handleOpenEditModal(art)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-action-delete"
                        title="Delete Article"
                        onClick={() => handleOpenDeleteDialog(art)}
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

      {/* Popup Dialog: Create / Update Article */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingArticle ? `Update Article [${editingArticle.newsArticleID}]` : 'Create News Article'}
        maxWidth="modal-lg"
      >
        <form onSubmit={handleFormSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label" htmlFor="art-id">News Article ID *</label>
              <input
                id="art-id"
                type="text"
                disabled={!!editingArticle}
                className={`form-control ${formErrors.newsArticleID ? 'is-invalid' : ''}`}
                placeholder="e.g. NA1004"
                value={formData.newsArticleID}
                onChange={(e) => setFormData({ ...formData, newsArticleID: e.target.value })}
              />
              {formErrors.newsArticleID && (
                <span className="invalid-feedback">{formErrors.newsArticleID}</span>
              )}
            </div>

            <div className="form-group flex-1">
              <label className="form-label" htmlFor="art-category">Category *</label>
              <select
                id="art-category"
                className={`form-control ${formErrors.categoryID ? 'is-invalid' : ''}`}
                value={formData.categoryID}
                onChange={(e) => setFormData({ ...formData, categoryID: e.target.value })}
              >
                <option value="">-- Select Category --</option>
                {categories.map((c) => (
                  <option key={c.categoryID} value={c.categoryID}>
                    {c.categoryName} {c.isActive ? '' : '(Inactive)'}
                  </option>
                ))}
              </select>
              {formErrors.categoryID && (
                <span className="invalid-feedback">{formErrors.categoryID}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="art-title">Article Title *</label>
            <input
              id="art-title"
              type="text"
              className={`form-control ${formErrors.newsTitle ? 'is-invalid' : ''}`}
              placeholder="e.g. FPT University Global Exchange Program 2026"
              value={formData.newsTitle}
              onChange={(e) => setFormData({ ...formData, newsTitle: e.target.value })}
            />
            {formErrors.newsTitle && (
              <span className="invalid-feedback">{formErrors.newsTitle}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="art-headline">Headline / Summary *</label>
            <input
              id="art-headline"
              type="text"
              className={`form-control ${formErrors.headline ? 'is-invalid' : ''}`}
              placeholder="Brief introductory hook or catchphrase..."
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />
            {formErrors.headline && (
              <span className="invalid-feedback">{formErrors.headline}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="art-source">News Source</label>
            <input
              id="art-source"
              type="text"
              className="form-control"
              placeholder="e.g. Office of International Programs"
              value={formData.newsSource}
              onChange={(e) => setFormData({ ...formData, newsSource: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="art-content">News Content (Detailed Article)</label>
            <textarea
              id="art-content"
              rows={5}
              className="form-control"
              placeholder="Write the full news story here..."
              value={formData.newsContent}
              onChange={(e) => setFormData({ ...formData, newsContent: e.target.value })}
            />
          </div>

          {/* Tags Section with quick create button */}
          <div className="form-group">
            <div className="tags-header-flex">
              <label className="form-label" style={{ marginBottom: 0 }}>
                Tags ({formData.tagIDs.length} selected)
              </label>
              <button
                type="button"
                className="btn btn-outline-secondary btn-xs"
                onClick={() => setIsTagModalOpen(true)}
              >
                <Plus size={12} /> Add New Tag
              </button>
            </div>
            <div className="tags-selection-grid">
              {tags.map((tag) => {
                const isSelected = formData.tagIDs.includes(tag.tagID);
                return (
                  <button
                    key={tag.tagID}
                    type="button"
                    className={`tag-selectable ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleTagSelection(tag.tagID)}
                  >
                    <TagIcon size={12} />
                    <span>#{tag.tagName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Publication Status */}
          <div className="form-group">
            <label className="form-label">Publication Status</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="newsStatus"
                  checked={formData.newsStatus === true}
                  onChange={() => setFormData({ ...formData, newsStatus: true })}
                />
                <span>Active (1) - Published publicly</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="newsStatus"
                  checked={formData.newsStatus === false}
                  onChange={() => setFormData({ ...formData, newsStatus: false })}
                />
                <span>Inactive (0) - Draft / Hidden from public</span>
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
              {submitLoading ? 'Saving...' : editingArticle ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Sub-Modal: Quick Create Tag */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        title="Create New Tag"
        maxWidth="modal-sm"
      >
        <form onSubmit={handleCreateNewTag} className="modal-form">
          {tagError && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              <span>{tagError}</span>
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="new-tag-name">Tag Name *</label>
            <input
              id="new-tag-name"
              type="text"
              required
              className="form-control"
              placeholder="e.g. Cybersecurity"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="new-tag-note">Tag Note (Optional)</label>
            <input
              id="new-tag-note"
              type="text"
              className="form-control"
              placeholder="e.g. Information security articles"
              value={newTagNote}
              onChange={(e) => setNewTagNote(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsTagModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Tag
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog: Delete Article */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm News Deletion"
        message={
          articleToDelete
            ? `Are you sure you want to permanently delete news article '${articleToDelete.newsTitle}' (ID: ${articleToDelete.newsArticleID})?`
            : 'Are you sure you want to delete this article?'
        }
        confirmText="Yes, Delete Article"
        cancelText="No, Keep Article"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default NewsManagement;
