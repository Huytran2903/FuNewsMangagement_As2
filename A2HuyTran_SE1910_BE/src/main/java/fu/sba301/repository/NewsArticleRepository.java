package fu.sba301.repository;

import fu.sba301.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    boolean existsByCreatedBy_AccountID(Short accountID);

    boolean existsByCategory_CategoryID(Short categoryID);

    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    List<NewsArticle> findByCreatedBy_AccountIDOrderByCreatedDateDesc(Short accountID);

    @Query("SELECT n FROM NewsArticle n WHERE " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(n.newsSource) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchNewsArticles(@Param("query") String query);

    @Query("SELECT n FROM NewsArticle n WHERE n.newsStatus = true AND " +
           "(:query IS NULL OR :query = '' OR " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(n.newsSource) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchActiveNewsArticles(@Param("query") String query);
}
