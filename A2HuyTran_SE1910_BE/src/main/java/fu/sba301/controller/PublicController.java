package fu.sba301.controller;

import fu.sba301.entity.Category;
import fu.sba301.entity.NewsArticle;
import fu.sba301.exception.ResourceNotFoundException;
import fu.sba301.service.CategoryService;
import fu.sba301.service.NewsArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {

    private final NewsArticleService newsArticleService;
    private final CategoryService categoryService;

    public PublicController(NewsArticleService newsArticleService, CategoryService categoryService) {
        this.newsArticleService = newsArticleService;
        this.categoryService = categoryService;
    }

    @GetMapping("/news")
    public ResponseEntity<List<NewsArticle>> getActiveNews(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(newsArticleService.getActiveNewsArticles(search));
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<NewsArticle> getActiveNewsDetail(@PathVariable String id) {
        NewsArticle article = newsArticleService.getNewsArticleById(id);
        if (article.getNewsStatus() == null || !article.getNewsStatus()) {
            throw new ResourceNotFoundException("Active news article not found with ID: " + id);
        }
        return ResponseEntity.ok(article);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getActiveCategories() {
        return ResponseEntity.ok(categoryService.getActiveCategories());
    }
}
