using EmployeeApi.Domain;

namespace EmployeeApi.Repositories
{
    public interface ISessionRepository
    {
        Task<Session?> GetByIdAsync(Guid sessionId, CancellationToken ct = default);
        Task AddAsync(Session session, CancellationToken ct = default);
        Task SaveAsync(CancellationToken ct = default);
    }
}