package fu.sba301.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "NewsArticle")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID", length = 50)
    private String newsArticleID;

    @NotBlank(message = "News title is required")
    @Column(name = "NewsTitle", length = 170, nullable = false)
    private String newsTitle;

    @NotBlank(message = "Headline is required")
    @Column(name = "Headline", length = 150, nullable = false)
    private String headline;

    @Column(name = "CreatedDate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", columnDefinition = "NVARCHAR(MAX)")
    private String newsContent;

    @Column(name = "NewsSource", length = 400)
    private String newsSource;

    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID", nullable = false)
    private Category category;

    @NotNull(message = "News status is required")
    @Column(name = "NewsStatus", nullable = false)
    private Boolean newsStatus = true; // 1 = Active, 0 = Inactive

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UpdatedByID")
    private SystemAccount updatedBy;

    @Column(name = "ModifiedDate")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "NewsTag",
        joinColumns = @JoinColumn(name = "NewsArticleID"),
        inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    private Set<Tag> tags = new HashSet<>();

    public NewsArticle() {
    }

    public NewsArticle(String newsArticleID, String newsTitle, String headline, LocalDateTime createdDate,
                       String newsContent, String newsSource, Category category, Boolean newsStatus,
                       SystemAccount createdBy, SystemAccount updatedBy, LocalDateTime modifiedDate, Set<Tag> tags) {
        this.newsArticleID = newsArticleID;
        this.newsTitle = newsTitle;
        this.headline = headline;
        this.createdDate = createdDate;
        this.newsContent = newsContent;
        this.newsSource = newsSource;
        this.category = category;
        this.newsStatus = newsStatus;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.modifiedDate = modifiedDate;
        this.tags = tags != null ? tags : new HashSet<>();
    }

    public String getNewsArticleID() {
        return newsArticleID;
    }

    public void setNewsArticleID(String newsArticleID) {
        this.newsArticleID = newsArticleID;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public String getNewsSource() {
        return newsSource;
    }

    public void setNewsSource(String newsSource) {
        this.newsSource = newsSource;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Boolean getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(Boolean newsStatus) {
        this.newsStatus = newsStatus;
    }

    public SystemAccount getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(SystemAccount createdBy) {
        this.createdBy = createdBy;
    }

    public SystemAccount getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(SystemAccount updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        NewsArticle that = (NewsArticle) o;
        return Objects.equals(newsArticleID, that.newsArticleID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(newsArticleID);
    }
}
