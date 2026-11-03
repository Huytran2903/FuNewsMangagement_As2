import React, { useState, useEffect } from 'react';
import { newsService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Clock,
  Calendar,
  Folder,
  Tag as TagIcon,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';

const NewsHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await newsService.getMyHistory();
      setHistory(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load your news creation history: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Clock size={28} className="title-icon" />
            My News Creation History
          </h1>
          <p className="page-subtitle">
            Chronological audit log of all news articles authored by <strong>{user?.accountName}</strong>.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchHistory}
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{history.length}</div>
          <div className="stat-label">Total Articles Created</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success">
            {history.filter((h) => h.newsStatus).length}
          </div>
          <div className="stat-label">Active / Published</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-warning">
            {history.filter((h) => !h.newsStatus).length}
          </div>
          <div className="stat-label">Draft / Inactive</div>
        </div>
      </div>

      {/* History Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '90px' }}>ID</th>
              <th>Article Title & Headline</th>
              <th>Category</th>
              <th style={{ width: '120px' }}>Status</th>
              <th>Created Date</th>
              <th>Last Modified</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="table-loading">
                  <RefreshCw className="spin-icon" size={24} />
                  <span>Loading creation history...</span>
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  You have not authored any news articles yet.
                </td>
              </tr>
            ) : (
              history.map((art) => (
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
                    <div className="text-sm font-medium">
                      <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
                      {art.createdDate || '—'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-subtle">
                      {art.modifiedDate ? (
                        <>
                          <div>{art.modifiedDate}</div>
                          {art.updatedBy && <div>by {art.updatedBy.accountName}</div>}
                        </>
                      ) : (
                        'Not modified'
                      )}
                    </div>
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
                        <span className="text-subtle">None</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsHistory;
