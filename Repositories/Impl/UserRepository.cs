using EmployeeApi.Domain;
using EmployeeApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public Task<User?> GetByIdAsync(Guid userId, CancellationToken ct = default) =>
        db.Users.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId, ct);

    public async Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        var ue = await db.UserEmails.AsNoTracking().FirstOrDefaultAsync(x => x.Email == email, ct);
        if (ue is null) return null;
        return await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == ue.UserId, ct);
    }

    public async Task AddAsync(User user, CancellationToken ct = default)
    {
        await db.Users.AddAsync(user, ct);
        await db.SaveChangesAsync(ct);
    }
}
