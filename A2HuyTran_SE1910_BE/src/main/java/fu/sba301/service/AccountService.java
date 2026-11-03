package fu.sba301.service;

import fu.sba301.dto.AccountDTO;
import fu.sba301.entity.SystemAccount;
import fu.sba301.exception.BusinessRuleException;
import fu.sba301.exception.ResourceNotFoundException;
import fu.sba301.repository.AccountRepository;
import fu.sba301.repository.NewsArticleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountService(AccountRepository accountRepository,
                          NewsArticleRepository newsArticleRepository,
                          PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<SystemAccount> getAllAccounts(String query) {
        if (StringUtils.hasText(query)) {
            return accountRepository.searchAccounts(query.trim());
        }
        return accountRepository.findAll();
    }

    public SystemAccount getAccountById(Short id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + id));
    }

    @Transactional
    public SystemAccount createAccount(AccountDTO dto) {
        if (accountRepository.existsByAccountEmail(dto.getAccountEmail())) {
            throw new BusinessRuleException("Email '" + dto.getAccountEmail() + "' is already registered");
        }

        if (!StringUtils.hasText(dto.getAccountPassword())) {
            throw new BusinessRuleException("Password is required for new accounts");
        }

        SystemAccount account = new SystemAccount();
        account.setAccountName(dto.getAccountName());
        account.setAccountEmail(dto.getAccountEmail());
        account.setAccountRole(dto.getAccountRole());
        account.setAccountPassword(passwordEncoder.encode(dto.getAccountPassword()));

        return accountRepository.save(account);
    }

    @Transactional
    public SystemAccount updateAccount(Short id, AccountDTO dto) {
        SystemAccount account = getAccountById(id);

        if (!account.getAccountEmail().equalsIgnoreCase(dto.getAccountEmail())) {
            if (accountRepository.existsByAccountEmail(dto.getAccountEmail())) {
                throw new BusinessRuleException("Email '" + dto.getAccountEmail() + "' is already taken");
            }
            account.setAccountEmail(dto.getAccountEmail());
        }

        account.setAccountName(dto.getAccountName());
        account.setAccountRole(dto.getAccountRole());

        if (StringUtils.hasText(dto.getAccountPassword())) {
            account.setAccountPassword(passwordEncoder.encode(dto.getAccountPassword()));
        }

        return accountRepository.save(account);
    }

    @Transactional
    public void deleteAccount(Short id) {
        SystemAccount account = getAccountById(id);

        // Business rule from PDF: cannot delete if account has created any news articles
        if (newsArticleRepository.existsByCreatedBy_AccountID(id)) {
            throw new BusinessRuleException("Cannot delete account '" + account.getAccountName() +
                    "' (ID: " + id + ") because it has created news articles.");
        }

        accountRepository.delete(account);
    }
}
