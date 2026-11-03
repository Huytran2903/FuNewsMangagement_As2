package fu.sba301.controller;

import fu.sba301.dto.LoginRequest;
import fu.sba301.dto.LoginResponse;
import fu.sba301.entity.SystemAccount;
import fu.sba301.exception.BusinessRuleException;
import fu.sba301.repository.AccountRepository;
import fu.sba301.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(AccountRepository accountRepository,
                          PasswordEncoder passwordEncoder,
                          JwtUtils jwtUtils) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        SystemAccount account = accountRepository.findByAccountEmail(request.getEmail().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), account.getAccountPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(
                account.getAccountEmail(),
                account.getAccountID(),
                account.getAccountRole(),
                account.getAccountName()
        );

        LoginResponse response = new LoginResponse(
                token,
                account.getAccountID(),
                account.getAccountName(),
                account.getAccountEmail(),
                account.getAccountRole()
        );

        return ResponseEntity.ok(response);
    }
}
