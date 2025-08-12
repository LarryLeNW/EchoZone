using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeApi.Controllers.Auth;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    public AuthController(IConfiguration config) { _config = config; }

    public record LoginRequest(string Username, string Password);

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var demoUser = _config["Auth:DemoUser:Username"] ?? "admin";
        var demoPass = _config["Auth:DemoUser:Password"] ?? "password";

        if (req.Username != demoUser || req.Password != demoPass)
            return Unauthorized(new { message = "Invalid credentials" });

        var issuer = _config["Jwt:Issuer"] ?? "EmployeeApi";
        var audience = _config["Jwt:Audience"] ?? "EmployeeApiAudience";
        var key = _config["Jwt:Key"] ?? "SuperSecretKey_ChangeMe";

        var tokenHandler = new JwtSecurityTokenHandler();
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, req.Username),
                new Claim(ClaimTypes.Role, "Admin")
            }),
            Expires = DateTime.UtcNow.AddHours(6),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwt = tokenHandler.WriteToken(token);
        return Ok(new { access_token = jwt, expires_in = 6 * 3600 });
    }
}
