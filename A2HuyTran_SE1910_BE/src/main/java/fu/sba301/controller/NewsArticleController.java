package fu.sba301.controller;

import fu.sba301.dto.NewsArticleDTO;
import fu.sba301.entity.NewsArticle;
import fu.sba301.security.CustomUserDetails;
import fu.sba301.service.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@PreAuthorize("hasRole('STAFF')")
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    public NewsArticleController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping
    public ResponseEntity<List<NewsArticle>> getAllNews(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(newsArticleService.getAllNewsArticles(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticle> getNewsById(@PathVariable String id) {
        return ResponseEntity.ok(newsArticleService.getNewsArticleById(id));
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<NewsArticle>> getMyNewsHistory(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Short accountId = userDetails != null ? userDetails.getAccountID() : null;
        return ResponseEntity.ok(newsArticleService.getNewsHistoryByAccount(accountId));
    }

    @PostMapping
    public ResponseEntity<NewsArticle> createNews(@Valid @RequestBody NewsArticleDTO dto,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        Short createdById = userDetails != null ? userDetails.getAccountID() : null;
        NewsArticle created = newsArticleService.createNewsArticle(dto, createdById);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticle> updateNews(@PathVariable String id,
                                                  @Valid @RequestBody NewsArticleDTO dto,
                                                  @AuthenticationPrincipal CustomUserDetails userDetails) {
        Short updatedById = userDetails != null ? userDetails.getAccountID() : null;
        NewsArticle updated = newsArticleService.updateNewsArticle(id, dto, updatedById);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNews(@PathVariable String id) {
        newsArticleService.deleteNewsArticle(id);
        return ResponseEntity.ok(Map.of("message", "News article deleted successfully"));
    }
}
