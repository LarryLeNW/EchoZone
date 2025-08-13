using Microsoft.EntityFrameworkCore.Storage;

namespace EmployeeApi.Infrastructure;

public interface IUnitOfWork : IAsyncDisposable
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default);
    Task CommitAsync(IDbContextTransaction tx, CancellationToken ct = default);
    Task RollbackAsync(IDbContextTransaction tx, CancellationToken ct = default);
}

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    private readonly AppDbContext _db = db;

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => _db.SaveChangesAsync(ct);

    public Task<IDbContextTransaction> BeginTransactionAsync(CancellationToken ct = default)
        => _db.Database.BeginTransactionAsync(ct);

    public Task CommitAsync(IDbContextTransaction tx, CancellationToken ct = default)
        => tx.CommitAsync(ct);

    public Task RollbackAsync(IDbContextTransaction tx, CancellationToken ct = default)
        => tx.RollbackAsync(ct);

    public ValueTask DisposeAsync() => _db.DisposeAsync();
}
