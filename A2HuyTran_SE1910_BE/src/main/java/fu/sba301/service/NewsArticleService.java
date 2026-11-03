package fu.sba301.service;

import fu.sba301.dto.NewsArticleDTO;
import fu.sba301.entity.Category;
import fu.sba301.entity.NewsArticle;
import fu.sba301.entity.SystemAccount;
import fu.sba301.entity.Tag;
import fu.sba301.exception.BusinessRuleException;
import fu.sba301.exception.ResourceNotFoundException;
import fu.sba301.repository.AccountRepository;
import fu.sba301.repository.CategoryRepository;
import fu.sba301.repository.NewsArticleRepository;
import fu.sba301.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final TagRepository tagRepository;

    public NewsArticleService(NewsArticleRepository newsArticleRepository,
                              CategoryRepository categoryRepository,
                              AccountRepository accountRepository,
                              TagRepository tagRepository) {
        this.newsArticleRepository = newsArticleRepository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.tagRepository = tagRepository;
    }

    public List<NewsArticle> getAllNewsArticles(String query) {
        if (StringUtils.hasText(query)) {
            return newsArticleRepository.searchNewsArticles(query.trim());
        }
        return newsArticleRepository.findAll();
    }

    public List<NewsArticle> getActiveNewsArticles(String query) {
        if (StringUtils.hasText(query)) {
            return newsArticleRepository.searchActiveNewsArticles(query.trim());
        }
        return newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc();
    }

    public NewsArticle getNewsArticleById(String id) {
        return newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with ID: " + id));
    }

    public List<NewsArticle> getNewsHistoryByAccount(Short accountID) {
        return newsArticleRepository.findByCreatedBy_AccountIDOrderByCreatedDateDesc(accountID);
    }

    @Transactional
    public NewsArticle createNewsArticle(NewsArticleDTO dto, Short createdByID) {
        String articleId = dto.getNewsArticleID();
        if (!StringUtils.hasText(articleId)) {
            // Generate clean ID, e.g., "NA" + last 6 digits of timestamp
            articleId = "NA" + (System.currentTimeMillis() % 1000000);
        } else {
            articleId = articleId.trim();
            if (newsArticleRepository.existsById(articleId)) {
                throw new BusinessRuleException("News Article ID '" + articleId + "' already exists");
            }
        }

        Category category = categoryRepository.findById(dto.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryID()));

        SystemAccount createdBy = null;
        if (createdByID != null) {
            createdBy = accountRepository.findById(createdByID).orElse(null);
        }

        NewsArticle article = new NewsArticle();
        article.setNewsArticleID(articleId);
        article.setNewsTitle(dto.getNewsTitle());
        article.setHeadline(dto.getHeadline());
        article.setCreatedDate(LocalDateTime.now());
        article.setNewsContent(dto.getNewsContent());
        article.setNewsSource(dto.getNewsSource());
        article.setCategory(category);
        article.setNewsStatus(dto.getNewsStatus() != null ? dto.getNewsStatus() : true);
        article.setCreatedBy(createdBy);

        if (dto.getTagIDs() != null && !dto.getTagIDs().isEmpty()) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(dto.getTagIDs()));
            article.setTags(tags);
        } else {
            article.setTags(new HashSet<>());
        }

        return newsArticleRepository.save(article);
    }

    @Transactional
    public NewsArticle updateNewsArticle(String id, NewsArticleDTO dto, Short updatedByID) {
        NewsArticle article = getNewsArticleById(id);

        Category category = categoryRepository.findById(dto.getCategoryID())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryID()));

        SystemAccount updatedBy = null;
        if (updatedByID != null) {
            updatedBy = accountRepository.findById(updatedByID).orElse(null);
        }

        article.setNewsTitle(dto.getNewsTitle());
        article.setHeadline(dto.getHeadline());
        article.setNewsContent(dto.getNewsContent());
        article.setNewsSource(dto.getNewsSource());
        article.setCategory(category);
        article.setNewsStatus(dto.getNewsStatus() != null ? dto.getNewsStatus() : true);
        article.setUpdatedBy(updatedBy);
        article.setModifiedDate(LocalDateTime.now());

        if (dto.getTagIDs() != null) {
            Set<Tag> tags = new HashSet<>(tagRepository.findAllById(dto.getTagIDs()));
            article.setTags(tags);
        }

        return newsArticleRepository.save(article);
    }

    @Transactional
    public void deleteNewsArticle(String id) {
        NewsArticle article = getNewsArticleById(id);
        article.getTags().clear();
        newsArticleRepository.delete(article);
    }
}
