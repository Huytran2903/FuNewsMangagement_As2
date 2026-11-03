package fu.sba301.repository;

import fu.sba301.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {

    List<Category> findByIsActiveTrue();

    @Query("SELECT c FROM Category c WHERE " +
           "LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.categoryDesciption) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Category> searchCategories(@Param("query") String query);
}
