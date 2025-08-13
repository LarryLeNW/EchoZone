using System.Security.Claims;
using EmployeeApi.Contracts;
using EmployeeApi.Domain;
using EmployeeApi.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Services;

public class AuthService(
    IUserRepository users,
    IProfileRepository profiles,
    ICredentialRepository creds,
    ISessionRepository sessions,
    IPasswordService pwd,
    ITokenService tokens,
    Infrastructure.AppDbContext db
) : IAuthService
{
    public async Task<TokenResponse> RegisterAsync(RegisterRequest req, string? ip, string? ua, CancellationToken ct = default)
    {
        if (await profiles.HandleExistsAsync(req.Handle, ct))
            throw new InvalidOperationException("Handle đã tồn tại");

        if (await db.UserEmails.AnyAsync(e => e.Email == req.Email, ct))
            throw new InvalidOperationException("Email đã tồn tại");

        var user = new User { UserId = Guid.NewGuid(), Status = 1 };
        var profile = new Profile { UserId = user.UserId, DisplayName = req.DisplayName, Handle = req.Handle };
        var email = new UserEmail { EmailId = Guid.NewGuid(), UserId = user.UserId, Email = req.Email, IsPrimary = true, IsVerified = false };
        var cred = new Credential
        {
            CredentialId = Guid.NewGuid(),
            UserId = user.UserId,
            Provider = "local",
            ProviderSubject = "local",
            PasswordHash = pwd.Hash(req.Password),
            PasswordAlgo = "PBKDF2",
            PasswordUpdatedAt = DateTime.UtcNow
        };

        // transaction
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

        return new TokenResponse(pair.AccessToken, pair.AccessExpiresAt, pair.RefreshToken, pair.RefreshExpiresAt, session.SessionId);
    }

    public async Task<TokenResponse> LoginAsync(LoginRequest req, string? ip, string? ua, CancellationToken ct = default)
    {
        var user = await users.GetByEmailAsync(req.Email.Trim(), ct);
        if (user is null) throw new InvalidOperationException("Sai email hoặc mật khẩu");

        var cred = await creds.GetLocalByUserIdAsync(user.UserId, ct);
        if (cred is null || cred.PasswordHash is null || !pwd.Verify(req.Password, cred.PasswordHash))
            throw new InvalidOperationException("Sai email hoặc mật khẩu");

        var profile = await profiles.GetByUserIdAsync(user.UserId, ct) ?? throw new InvalidOperationException("Profile không tồn tại");

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
}
