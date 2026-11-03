package fu.sba301.service;

import fu.sba301.dto.CategoryDTO;
import fu.sba301.entity.Category;
import fu.sba301.exception.BusinessRuleException;
import fu.sba301.exception.ResourceNotFoundException;
import fu.sba301.repository.CategoryRepository;
import fu.sba301.repository.NewsArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryService(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    public List<Category> getAllCategories(String query) {
        if (StringUtils.hasText(query)) {
            return categoryRepository.searchCategories(query.trim());
        }
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    public Category getCategoryById(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
    }

    @Transactional
    public Category createCategory(CategoryDTO dto) {
        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setCategoryDesciption(dto.getCategoryDesciption());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getParentCategoryID() != null) {
            Category parent = getCategoryById(dto.getParentCategoryID());
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Short id, CategoryDTO dto) {
        Category category = getCategoryById(id);
        category.setCategoryName(dto.getCategoryName());
        category.setCategoryDesciption(dto.getCategoryDesciption());
        category.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        if (dto.getParentCategoryID() != null) {
            if (dto.getParentCategoryID().equals(id)) {
                throw new BusinessRuleException("A category cannot be its own parent");
            }
            Category parent = getCategoryById(dto.getParentCategoryID());
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Short id) {
        Category category = getCategoryById(id);

        // Business rule from PDF: cannot delete if category belongs to any news articles
        if (newsArticleRepository.existsByCategory_CategoryID(id)) {
            throw new BusinessRuleException("Cannot delete category '" + category.getCategoryName() +
                    "' (ID: " + id + ") because it is associated with news articles.");
        }

        categoryRepository.delete(category);
    }
}
