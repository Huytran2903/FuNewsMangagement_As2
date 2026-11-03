package fu.sba301.security;

import fu.sba301.entity.SystemAccount;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final SystemAccount account;

    public CustomUserDetails(SystemAccount account) {
        this.account = account;
    }

    public SystemAccount getAccount() {
        return account;
    }

    public Short getAccountID() {
        return account.getAccountID();
    }

    public Integer getAccountRole() {
        return account.getAccountRole();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 1 = Admin, 2 = Staff
        if (account.getAccountRole() != null && account.getAccountRole() == 1) {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_STAFF"));
        }
    }

    @Override
    public String getPassword() {
        return account.getAccountPassword();
    }

    @Override
    public String getUsername() {
        return account.getAccountEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
