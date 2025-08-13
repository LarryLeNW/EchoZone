using EmployeeApi.Domain;

namespace EmployeeApi.Repositories
{
    public interface ICredentialRepository
    {
        Task<Credential?> GetLocalByUserIdAsync(Guid userId, CancellationToken ct = default);
        Task AddAsync(Credential credential, CancellationToken ct = default);
    }
}