using EmployeeApi.Domain;
using EmployeeApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class ProfileRepository(AppDbContext db) : IProfileRepository
{
    public Task<Profile?> GetByUserIdAsync(Guid userId, CancellationToken ct = default) =>
        db.Profiles.FirstOrDefaultAsync(p => p.UserId == userId, ct);

    public Task<bool> HandleExistsAsync(string handle, CancellationToken ct = default) =>
        db.Profiles.AsNoTracking().AnyAsync(p => p.Handle == handle, ct);

    public async Task AddAsync(Profile profile, CancellationToken ct = default)
    {
        await db.Profiles.AddAsync(profile, ct);
        await db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Profile profile, CancellationToken ct = default)
    {
        db.Profiles.Update(profile);
        await db.SaveChangesAsync(ct);
    }

    public Task<Profile?> GetByHandle(string handle, CancellationToken ct = default) =>
        db.Profiles.FirstOrDefaultAsync(p => p.Handle == handle, ct);
}
