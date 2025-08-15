namespace EmployeeApi.Services;
public interface IEmailService
{
    Task SendVerificationEmailAsync(string toEmail, string verificationToken);
}
