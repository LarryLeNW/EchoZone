using EmployeeApi.Contracts;

namespace EmployeeApi.Services;

public interface IAuthService
{
    Task<TokenResponse> RegisterAsync(RegisterRequest req, string? ip, string? ua, CancellationToken ct = default);
    Task<TokenResponse> LoginAsync(LoginRequest req, string? ip, string? ua, CancellationToken ct = default);
    Task<TokenResponse> RefreshAsync(RefreshRequest req, string? ip, string? ua, CancellationToken ct = default);
    Task LogoutAsync(RefreshRequest req, CancellationToken ct = default);
}
