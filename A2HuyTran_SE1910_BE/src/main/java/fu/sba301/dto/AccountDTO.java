package fu.sba301.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AccountDTO {
    private Short accountID;

    @NotBlank(message = "Account name is required")
    private String accountName;

    @NotBlank(message = "Account email is required")
    @Email(message = "Invalid email format")
    private String accountEmail;

    @NotNull(message = "Account role is required (1: Admin, 2: Staff)")
    private Integer accountRole;

    private String accountPassword;

    public AccountDTO() {
    }

    public AccountDTO(Short accountID, String accountName, String accountEmail, Integer accountRole, String accountPassword) {
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
        this.accountPassword = accountPassword;
    }

    public Short getAccountID() {
        return accountID;
    }

    public void setAccountID(Short accountID) {
        this.accountID = accountID;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public Integer getAccountRole() {
        return accountRole;
    }

    public void setAccountRole(Integer accountRole) {
        this.accountRole = accountRole;
    }

    public String getAccountPassword() {
        return accountPassword;
    }

    public void setAccountPassword(String accountPassword) {
        this.accountPassword = accountPassword;
    }
}
