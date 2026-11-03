import React, { useState, useEffect } from 'react';
import { publicService } from '../services/api';
import Modal from '../components/Modal';
import { Search, Calendar, User, Tag as TagIcon, ExternalLink, RefreshCw, Folder } from 'lucide-react';

const PublicNews = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, catRes] = await Promise.all([
        publicService.getNews(searchQuery),
        publicService.getCategories(),
      ]);
      setArticles(newsRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to fetch public news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setIsDetailOpen(true);
  };

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory === 'ALL') return true;
    return art.category?.categoryID === Number(selectedCategory);
  });

  return (
    <div className="page-container">
      {/* Hero Header */}
      <div className="public-hero">
        <div className="hero-badge">University Portal</div>
        <h1 className="hero-title">Campus News & Announcements</h1>
        <p className="hero-subtitle">
          Stay informed with the latest updates, academic schedules, events, and student achievements.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-form-hero">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search active articles by title, headline, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter-bar">
        <button
          type="button"
          className={`filter-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('ALL')}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat.categoryID}
            type="button"
            className={`filter-pill ${selectedCategory === String(cat.categoryID) ? 'active' : ''}`}
            onClick={() => setSelectedCategory(String(cat.categoryID))}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      {loading ? (
        <div className="loading-state">
          <RefreshCw className="spin-icon" size={32} />
          <p>Loading latest articles...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="empty-state">
          <p>No active news articles found matching your criteria.</p>
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map((article) => (
            <article key={article.newsArticleID} className="news-card">
              <div className="card-top">
                <span className="card-category">
                  <Folder size={13} />
                  {article.category?.categoryName || 'General'}
                </span>
                <span className="card-date">
                  <Calendar size={13} />
                  {article.createdDate ? article.createdDate.substring(0, 10) : 'Recent'}
                </span>
              </div>

              <h2 className="card-title" onClick={() => handleViewArticle(article)}>
                {article.newsTitle}
              </h2>

              <p className="card-headline">{article.headline}</p>

              {article.tags && article.tags.length > 0 && (
                <div className="card-tags">
                  {article.tags.map((tag) => (
                    <span key={tag.tagID} className="tag-chip">
                      #{tag.tagName}
                    </span>
                  ))}
                </div>
              )}

              <div className="card-footer">
                <div className="author-info">
                  <User size={14} />
                  <span>{article.createdBy?.accountName || 'Staff Member'}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleViewArticle(article)}
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedArticle && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedArticle.newsTitle}
          maxWidth="modal-lg"
        >
          <div className="article-detail-content">
            <div className="detail-meta-bar">
              <span className="badge badge-primary">
                Category: {selectedArticle.category?.categoryName}
              </span>
              <span className="detail-meta-item">
                <Calendar size={15} />
                Published: {selectedArticle.createdDate}
              </span>
              <span className="detail-meta-item">
                <User size={15} />
                Author: {selectedArticle.createdBy?.accountName || 'Staff'}
              </span>
              {selectedArticle.newsSource && (
                <span className="detail-meta-item">
                  <ExternalLink size={15} />
                  Source: {selectedArticle.newsSource}
                </span>
              )}
            </div>

            <div className="detail-headline">
              <strong>{selectedArticle.headline}</strong>
            </div>

            <div className="detail-body">
              {selectedArticle.newsContent ? (
                selectedArticle.newsContent.split('\n').map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))
              ) : (
                <p>No content available.</p>
              )}
            </div>

            {selectedArticle.tags && selectedArticle.tags.length > 0 && (
              <div className="detail-tags-section">
                <div className="tags-label">
                  <TagIcon size={16} /> Related Tags:
                </div>
                <div className="tags-container">
                  {selectedArticle.tags.map((tag) => (
                    <span key={tag.tagID} className="tag-chip tag-chip-lg">
                      #{tag.tagName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PublicNews;
