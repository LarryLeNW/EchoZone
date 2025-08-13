using EmployeeApi.Domain;
using EmployeeApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class SessionRepository(AppDbContext db) : ISessionRepository
{
    public Task<Session?> GetByIdAsync(Guid sessionId, CancellationToken ct = default) =>
        db.Sessions.FirstOrDefaultAsync(s => s.SessionId == sessionId, ct);

    public async Task AddAsync(Session session, CancellationToken ct = default)
    {
        await db.Sessions.AddAsync(session, ct);
        await db.SaveChangesAsync(ct);
    }

    public Task SaveAsync(CancellationToken ct = default) => db.SaveChangesAsync(ct);
}
