using EmployeeApi.Contracts;

namespace EmployeeApi.Services;

public interface IProfileService
{
    Task<ProfileResponse?> GetMeAsync(Guid userId, CancellationToken ct = default);
    Task UpdateMeAsync(Guid userId, UpdateProfileRequest req, CancellationToken ct = default);
}
