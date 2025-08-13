using EmployeeApi.Domain;
using EmployeeApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class CredentialRepository(AppDbContext db) : ICredentialRepository
{
    public Task<Credential?> GetLocalByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        db.Credentials.FirstOrDefaultAsync(c => c.UserId == userId && c.Provider == "local", ct);

    public async Task AddAsync(Credential credential, CancellationToken ct = default)
    {
        await db.Credentials.AddAsync(credential, ct);
        await db.SaveChangesAsync(ct);
    }
}
