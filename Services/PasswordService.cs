using Microsoft.AspNetCore.Identity;

namespace EmployeeApi.Services;
public interface IPasswordService
{
    byte[] Hash(string password);
    bool Verify(string password, byte[] hash);
}

public class PasswordService : IPasswordService
{
    private readonly PasswordHasher<object> _hasher = new();
    private readonly object _dummy = new();

    public byte[] Hash(string password)
    {
        var s = _hasher.HashPassword(_dummy, password); // string base64
        return System.Text.Encoding.UTF8.GetBytes(s);
    }

    public bool Verify(string password, byte[] hash)
    {
        var s = System.Text.Encoding.UTF8.GetString(hash);
        var result = _hasher.VerifyHashedPassword(_dummy, s, password);
        return result is PasswordVerificationResult.Success or PasswordVerificationResult.SuccessRehashNeeded;
    }
}
