package fu.sba301.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Set;

public class NewsArticleDTO {
    private String newsArticleID;

    @NotBlank(message = "News title is required")
    private String newsTitle;

    @NotBlank(message = "Headline is required")
    private String headline;

    private String newsContent;

    private String newsSource;

    @NotNull(message = "Category ID is required")
    private Short categoryID;

    @NotNull(message = "News status is required")
    private Boolean newsStatus = true;

    private Set<Integer> tagIDs;

    public NewsArticleDTO() {
    }

    public NewsArticleDTO(String newsArticleID, String newsTitle, String headline, String newsContent,
                          String newsSource, Short categoryID, Boolean newsStatus, Set<Integer> tagIDs) {
        this.newsArticleID = newsArticleID;
        this.newsTitle = newsTitle;
        this.headline = headline;
        this.newsContent = newsContent;
        this.newsSource = newsSource;
        this.categoryID = categoryID;
        this.newsStatus = newsStatus;
        this.tagIDs = tagIDs;
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

    public Short getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Short categoryID) {
        this.categoryID = categoryID;
    }

    public Boolean getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(Boolean newsStatus) {
        this.newsStatus = newsStatus;
    }

    public Set<Integer> getTagIDs() {
        return tagIDs;
    }

    public void setTagIDs(Set<Integer> tagIDs) {
        this.tagIDs = tagIDs;
    }
}
