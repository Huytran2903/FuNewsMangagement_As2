package fu.sba301.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "Category")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryID;

    @NotBlank(message = "Category name is required")
    @Column(name = "CategoryName", length = 100, nullable = false)
    private String categoryName;

    @Column(name = "CategoryDesciption", length = 255)
    private String categoryDesciption;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ParentCategoryID")
    @JsonIgnoreProperties({"parentCategory"})
    private Category parentCategory;

    @NotNull(message = "Active status is required")
    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    public Category() {
    }

    public Category(Short categoryID, String categoryName, String categoryDesciption, Category parentCategory, Boolean isActive) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.categoryDesciption = categoryDesciption;
        this.parentCategory = parentCategory;
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

    // Alias for common spelling
    public String getCategoryDescription() {
        return categoryDesciption;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDesciption = categoryDescription;
    }

    public Category getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(Category parentCategory) {
        this.parentCategory = parentCategory;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Category category = (Category) o;
        return Objects.equals(categoryID, category.categoryID);
    }

    @Override
    public int hashCode() {
        return Objects.hash(categoryID);
    }
}
