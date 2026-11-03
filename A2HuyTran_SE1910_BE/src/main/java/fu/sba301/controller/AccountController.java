package fu.sba301.controller;

import fu.sba301.dto.AccountDTO;
import fu.sba301.entity.SystemAccount;
import fu.sba301.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@PreAuthorize("hasRole('ADMIN')")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<SystemAccount>> getAllAccounts(@RequestParam(required = false) String search) {
        return ResponseEntity.ok(accountService.getAllAccounts(search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SystemAccount> getAccountById(@PathVariable Short id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PostMapping
    public ResponseEntity<SystemAccount> createAccount(@Valid @RequestBody AccountDTO dto) {
        SystemAccount created = accountService.createAccount(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SystemAccount> updateAccount(@PathVariable Short id, @Valid @RequestBody AccountDTO dto) {
        SystemAccount updated = accountService.updateAccount(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteAccount(@PathVariable Short id) {
        accountService.deleteAccount(id);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}
