using System.Security.Claims;
using EmployeeApi.Constants;
using EmployeeApi.Contracts;
using EmployeeApi.Domain;
using EmployeeApi.Extensions;
using EmployeeApi.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
namespace EmployeeApi.Services;

public class AuthService(
    IUserRepository users,
    IProfileRepository profiles,
    ICredentialRepository creds,
    ISessionRepository sessions,
    IPasswordService pwd,
    IEmailService emailService,
    ITokenService tokens,
    Infrastructure.AppDbContext db,
    IHttpContextAccessor _httpContextAccessor
) : IAuthService
{
    public async Task<TokenResponse> RegisterAsync(RegisterRequest req, string? ip, string? ua, CancellationToken ct = default)
    {
        if (await db.UserEmails.AnyAsync(e => e.Email == req.Email, ct))
        {
            throw new EntityException([new FieldError("email", "Email đã này đã được sử dụng")]);
        }

        var user = new User { UserId = Guid.NewGuid(), Status = 1 };
        var profile = new Profile { UserId = user.UserId, DisplayName = req.DisplayName, Handle = GenerateHandle(req.DisplayName) };
        var email = new UserEmail { EmailId = Guid.NewGuid(), UserId = user.UserId, Email = req.Email, IsPrimary = true, IsVerified = false };
        var cred = new Credential
        {
            CredentialId = Guid.NewGuid(),
            UserId = user.UserId,
            Provider = "local",
            ProviderSubject = req.Email,
            PasswordHash = pwd.Hash(req.Password),
            PasswordAlgo = "PBKDF2",
            PasswordUpdatedAt = DateTime.UtcNow
        };

        using var tx = await db.Database.BeginTransactionAsync(ct);
        await db.Users.AddAsync(user, ct);
        await db.Profiles.AddAsync(profile, ct);
        await db.UserEmails.AddAsync(email, ct);
        await db.Credentials.AddAsync(cred, ct);
        await db.SaveChangesAsync(ct);

        var pair = tokens.IssueTokens(user.UserId, profile.Handle, Array.Empty<Claim>());
        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            RefreshTokenHash = ITokenService.HashRefresh(pair.RefreshToken),
            ExpiresAt = pair.RefreshExpiresAt,
            IpAddress = ip,
            UserAgent = ua
        };
        await db.Sessions.AddAsync(session, ct);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        SetCookie("accessToken", pair.AccessToken, pair.AccessExpiresAt);
        SetCookie("refreshToken", pair.RefreshToken, pair.RefreshExpiresAt);
        await emailService.SendVerificationEmailAsync(req.Email, "Cảm ơn bạn đã đến, chào mình đến với EchoZone.");
        return new TokenResponse(pair.AccessToken, pair.AccessExpiresAt, pair.RefreshToken, pair.RefreshExpiresAt, session.SessionId);
    }

    public async Task<TokenResponse> LoginAsync(LoginRequest req, string? ip, string? ua, CancellationToken ct = default)
    {
        var user = await users.GetByEmailAsync(req.Email.Trim(), ct);
        if (user is null) throw new EntityException([new FieldError("email", "Email không tồn tại")]);

        var cred = await creds.GetLocalByUserIdAsync(user.UserId, ct);
        if (cred is null || cred.PasswordHash is null || !pwd.Verify(req.Password, cred.PasswordHash))
            throw new EntityException([new FieldError("password", "Email hoặc mật khẩu không đúng")]);

        var profile = await profiles.GetByUserIdAsync(user.UserId, ct) ?? throw new AuthException("Tài khoản không hợp lệ, vui lòng liên hệ admin");

        var pair = tokens.IssueTokens(user.UserId, profile.Handle, Array.Empty<Claim>());

        var session = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = user.UserId,
            RefreshTokenHash = ITokenService.HashRefresh(pair.RefreshToken),
            ExpiresAt = pair.RefreshExpiresAt,
            IpAddress = ip,
            UserAgent = ua
        };
        await sessions.AddAsync(session, ct);

        var u = await db.Users.FindAsync([user.UserId], ct);
        if (u != null) u.LastLoginAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        SetCookie("accessToken", pair.AccessToken, pair.AccessExpiresAt);
        SetCookie("refreshToken", pair.RefreshToken, pair.RefreshExpiresAt);
        return new TokenResponse(pair.AccessToken, pair.AccessExpiresAt, pair.RefreshToken, pair.RefreshExpiresAt, session.SessionId);
    }

    public async Task<TokenResponse> RefreshAsync(RefreshRequest req, string? ip, string? ua, CancellationToken ct = default)
    {
        var session = await sessions.GetByIdAsync(req.SessionId, ct) ?? throw new InvalidOperationException("Session không tồn tại");
        if (session.RevokedAt != null || session.ExpiresAt < DateTime.UtcNow)
            throw new InvalidOperationException("Refresh token hết hạn/đã thu hồi");

        var hash = ITokenService.HashRefresh(req.RefreshToken);
        if (!hash.SequenceEqual(session.RefreshTokenHash))
            throw new InvalidOperationException("Refresh token không hợp lệ (rotation)");

        var profile = await profiles.GetByUserIdAsync(session.UserId, ct) ?? throw new InvalidOperationException("Profile không tồn tại");

        var pair = tokens.IssueTokens(session.UserId, profile.Handle, Array.Empty<Claim>());
        var newSession = new Session
        {
            SessionId = Guid.NewGuid(),
            UserId = session.UserId,
            RefreshTokenHash = ITokenService.HashRefresh(pair.RefreshToken),
            ExpiresAt = pair.RefreshExpiresAt,
            IpAddress = ip,
            UserAgent = ua,
            ParentSessionId = session.SessionId
        };
        await db.Sessions.AddAsync(newSession, ct);

        session.ReplacedBySessionId = newSession.SessionId;
        session.RevokedAt = DateTime.UtcNow;
        session.LastUsedAt = DateTime.UtcNow;

        await db.SaveChangesAsync(ct);
        return new TokenResponse(pair.AccessToken, pair.AccessExpiresAt, pair.RefreshToken, pair.RefreshExpiresAt, newSession.SessionId);
    }

    public async Task LogoutAsync(RefreshRequest req, CancellationToken ct = default)
    {
        var session = await sessions.GetByIdAsync(req.SessionId, ct);
        if (session is null) return;
        session.RevokedAt = DateTime.UtcNow;
        await sessions.SaveAsync(ct);
    }

    private string GenerateHandle(string displayName)
    {
        string baseHandle = displayName
            .ToLower()
            .Replace(" ", "_")
            .Replace("-", "_");

        if (baseHandle.Length > 20)
            baseHandle = baseHandle.Substring(0, 20);

        string uuidSuffix = Guid.NewGuid().ToString("N").Substring(0, 8);

        string handle = $"{baseHandle}{uuidSuffix}";

        return handle;
    }


    private void SetCookie(string name, string value, DateTime expires)
    {
        var cookies = _httpContextAccessor.HttpContext.Response.Cookies;
        cookies.Append(name, value, new CookieOptions
        {
            Expires = expires,
            HttpOnly = true,
            Secure = false,                // dev HTTP
            SameSite = SameSiteMode.Lax,   // cùng site 
            Path = "/"
        });
    }
}
