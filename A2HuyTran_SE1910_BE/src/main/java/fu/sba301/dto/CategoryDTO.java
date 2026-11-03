package fu.sba301.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoryDTO {
    private Short categoryID;

    @NotBlank(message = "Category name is required")
    private String categoryName;

    private String categoryDesciption;

    private Short parentCategoryID;

    @NotNull(message = "isActive is required")
    private Boolean isActive = true;

    public CategoryDTO() {
    }

    public CategoryDTO(Short categoryID, String categoryName, String categoryDesciption, Short parentCategoryID, Boolean isActive) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.categoryDesciption = categoryDesciption;
        this.parentCategoryID = parentCategoryID;
        this.isActive = isActive;
    }

    public Short getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Short categoryID) {
        this.categoryID = categoryID;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDesciption() {
        return categoryDesciption;
    }

    public void setCategoryDesciption(String categoryDesciption) {
        this.categoryDesciption = categoryDesciption;
    }

    public String getCategoryDescription() {
        return categoryDesciption;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDesciption = categoryDescription;
    }

    public Short getParentCategoryID() {
        return parentCategoryID;
    }

    public void setParentCategoryID(Short parentCategoryID) {
        this.parentCategoryID = parentCategoryID;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
