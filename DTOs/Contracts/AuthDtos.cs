namespace EmployeeApi.Contracts;

public record RegisterRequest(string Email, string Password, string DisplayName);
public record LoginRequest(string Email, string Password);
public record RefreshRequest(string RefreshToken, Guid SessionId);

public record TokenResponse(
    string AccessToken,
    DateTime AccessExpiresAt,
    string RefreshToken,
    DateTime RefreshExpiresAt,
    Guid SessionId
);

public record ProfileResponse(
    Guid UserId,
    string DisplayName,
    string Handle,
    string? Bio,
    string? AvatarUrl,
    bool IsPrivate
);

public class UpdateProfileRequest
{
    public string? DisplayName { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public bool? IsPrivate { get; set; }
}
