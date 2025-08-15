using EmployeeApi.Services;
using MailKit.Net.Smtp;
using MimeKit;

public class EmailService : IEmailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;

    public EmailService(IConfiguration configuration)
    {
        _smtpServer = configuration["Email:SMTP_SERVER"];
        _smtpPort = int.Parse(configuration["Email:SMTP_PORT"]);
        _smtpUsername = configuration["Email:SMTP_USERNAME"];
        _smtpPassword = configuration["Email:SMTP_PASSWORD"];
    }

    public async Task SendVerificationEmailAsync(string toEmail, string Text)
    {
        var emailMessage = new MimeMessage();
        emailMessage.From.Add(new MailboxAddress("Social Medias", _smtpUsername));
        emailMessage.To.Add(new MailboxAddress("Social Media", toEmail));
        emailMessage.Subject = "Email Verification";

        var body = new TextPart("plain")
        {
            Text = Text
        };
        emailMessage.Body = body;

        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpServer, _smtpPort, false);
        await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
        await client.SendAsync(emailMessage);
        await client.DisconnectAsync(true);
    }
}
