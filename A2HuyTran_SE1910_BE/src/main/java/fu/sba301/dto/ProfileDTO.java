package fu.sba301.dto;

import jakarta.validation.constraints.NotBlank;

public class ProfileDTO {
    private Short accountID;
    private String accountEmail;

    @NotBlank(message = "Account name is required")
    private String accountName;

    private String currentPassword;
    private String newPassword;

    public ProfileDTO() {
    }

    public ProfileDTO(Short accountID, String accountEmail, String accountName) {
        this.accountID = accountID;
        this.accountEmail = accountEmail;
        this.accountName = accountName;
    }

    public Short getAccountID() {
        return accountID;
    }

    public void setAccountID(Short accountID) {
        this.accountID = accountID;
    }

    public String getAccountEmail() {
        return accountEmail;
    }

    public void setAccountEmail(String accountEmail) {
        this.accountEmail = accountEmail;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
