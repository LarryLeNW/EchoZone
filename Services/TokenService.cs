using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeApi.Services;

public class JwtOptions
{
    public string Issuer { get; set; } = default!;
    public string Audience { get; set; } = default!;
    public string Key { get; set; } = default!;
    public int AccessTokenMinutes { get; set; } = 15;
    public int RefreshTokenDays { get; set; } = 14;
}

public record TokenPair(string AccessToken, string RefreshToken, DateTime AccessExpiresAt, DateTime RefreshExpiresAt);

public interface ITokenService
{
    TokenPair IssueTokens(Guid userId, string handle, IEnumerable<Claim> extraClaims);
    static byte[] HashRefresh(string token) => SHA256.HashData(Encoding.UTF8.GetBytes(token));
}

public class TokenService(IOptions<JwtOptions> opts) : ITokenService
{
    private readonly JwtOptions _o = opts.Value;

    public TokenPair IssueTokens(Guid userId, string handle, IEnumerable<Claim> extraClaims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_o.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var now = DateTime.UtcNow;
        var accessExpires = now.AddMinutes(_o.AccessTokenMinutes);
        var refreshExpires = now.AddDays(_o.RefreshTokenDays);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new("handle", handle)
        };
        claims.AddRange(extraClaims);

        var jwt = new JwtSecurityToken(
            issuer: _o.Issuer,
            audience: _o.Audience,
            claims: claims,
            notBefore: now,
            expires: accessExpires,
            signingCredentials: creds);

        var access = new JwtSecurityTokenHandler().WriteToken(jwt);
        var refresh = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

        return new TokenPair(access, refresh, accessExpires, refreshExpires);
    }
}


public static class ClaimsExtensions
{
    public static Guid? GetUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue("sub")
                  ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(sub, out var id) ? id : null;
    }
}
