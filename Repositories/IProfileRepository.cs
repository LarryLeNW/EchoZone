using EmployeeApi.Domain;

namespace EmployeeApi.Repositories
{
    public interface IProfileRepository
    {
        Task<Profile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task<bool> HandleExistsAsync(string handle, CancellationToken ct = default);
        Task AddAsync(Profile profile, CancellationToken ct = default);
        Task UpdateAsync(Profile profile, CancellationToken ct = default);
    }
}