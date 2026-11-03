package fu.sba301.dto;

public class LoginResponse {
    private String token;
    private Short accountID;
    private String accountName;
    private String accountEmail;
    private Integer accountRole; // 1 = Admin, 2 = Staff

    public LoginResponse() {
    }

    public LoginResponse(String token, Short accountID, String accountName, String accountEmail, Integer accountRole) {
        this.token = token;
        this.accountID = accountID;
        this.accountName = accountName;
        this.accountEmail = accountEmail;
        this.accountRole = accountRole;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
}
