package fu.sba301.service;

import fu.sba301.dto.ProfileDTO;
import fu.sba301.entity.SystemAccount;
import fu.sba301.exception.BusinessRuleException;
import fu.sba301.exception.ResourceNotFoundException;
import fu.sba301.repository.AccountRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ProfileService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(AccountRepository accountRepository, PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ProfileDTO getProfile(Short accountID) {
        SystemAccount account = accountRepository.findById(accountID)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));
        return new ProfileDTO(account.getAccountID(), account.getAccountEmail(), account.getAccountName());
    }

    @Transactional
    public ProfileDTO updateProfile(Short accountID, ProfileDTO dto) {
        SystemAccount account = accountRepository.findById(accountID)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        if (StringUtils.hasText(dto.getAccountName())) {
            account.setAccountName(dto.getAccountName());
        }

        // If user wants to change password
        if (StringUtils.hasText(dto.getNewPassword())) {
            if (!StringUtils.hasText(dto.getCurrentPassword())) {
                throw new BusinessRuleException("Current password is required to change password");
            }
            if (!passwordEncoder.matches(dto.getCurrentPassword(), account.getAccountPassword())) {
                throw new BusinessRuleException("Incorrect current password");
            }
            account.setAccountPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        accountRepository.save(account);
        return new ProfileDTO(account.getAccountID(), account.getAccountEmail(), account.getAccountName());
    }
}
