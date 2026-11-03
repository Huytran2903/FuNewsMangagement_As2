package fu.sba301.repository;

import fu.sba301.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<SystemAccount, Short> {

    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    boolean existsByAccountEmail(String accountEmail);

    @Query("SELECT a FROM SystemAccount a WHERE " +
           "LOWER(a.accountName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.accountEmail) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<SystemAccount> searchAccounts(@Param("query") String query);
}
