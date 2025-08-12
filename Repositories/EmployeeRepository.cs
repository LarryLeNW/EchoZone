using EmployeeApi.Data;
using EmployeeApi.DTOs;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Repositories;

public interface IEmployeeRepository
{
    Task<(List<Employee> Items, int Total)> GetAllAsync(EmployeeQuery query, CancellationToken ct = default);
    Task<Employee?> GetByIdAsync(int id);
    Task<Employee> AddAsync(Employee entity);
    Task UpdateAsync(Employee entity);
    Task DeleteAsync(Employee entity);
    Task<bool> ExistsAsync(int id);
}

public class EmployeeRepository : IEmployeeRepository
{
    private readonly AppDbContext _db;
    public EmployeeRepository(AppDbContext db) { _db = db; }

    public async Task<(List<Employee> Items, int Total)> GetAllAsync(EmployeeQuery q, CancellationToken ct = default)
    {
        IQueryable<Employee> query = _db.Employees.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(q.Keyword))
        {
            var kw = q.Keyword.Trim().ToLower();
            query = query.Where(x =>
                x.FullName.ToLower().Contains(kw) ||
                x.Email.ToLower().Contains(kw) ||
                x.EmployeeCode.ToLower().Contains(kw));
        }
        if (!string.IsNullOrWhiteSpace(q.Department))
            query = query.Where(x => x.Department == q.Department);

        if (!string.IsNullOrWhiteSpace(q.Title))
            query = query.Where(x => x.Title == q.Title);

        if (q.IsActive.HasValue)
            query = query.Where(x => x.IsActive == q.IsActive.Value);

        if (q.MinSalary.HasValue)
            query = query.Where(x => x.Salary >= q.MinSalary.Value);

        if (q.MaxSalary.HasValue)
            query = query.Where(x => x.Salary <= q.MaxSalary.Value);

        if (q.HiredFrom.HasValue)
            query = query.Where(x => x.HiredAt >= q.HiredFrom.Value);

        if (q.HiredTo.HasValue)
            query = query.Where(x => x.HiredAt <= q.HiredTo.Value);

        var total = await query.CountAsync(ct);

        var sortBy = (q.SortBy ?? "hiredAt").ToLower();
        var desc = string.Equals(q.SortDir, "desc", StringComparison.OrdinalIgnoreCase);

        query = sortBy switch
        {
            "name" or "fullname" => desc ? query.OrderByDescending(x => x.FullName) : query.OrderBy(x => x.FullName),
            "salary"             => desc ? query.OrderByDescending(x => x.Salary)   : query.OrderBy(x => x.Salary),
            "department"         => desc ? query.OrderByDescending(x => x.Department): query.OrderBy(x => x.Department),
            "title"              => desc ? query.OrderByDescending(x => x.Title)     : query.OrderBy(x => x.Title),
            "isactive"           => desc ? query.OrderByDescending(x => x.IsActive)  : query.OrderBy(x => x.IsActive),
            _                    => desc ? query.OrderByDescending(x => x.HiredAt) : query.OrderBy(x => x.HiredAt)
        };

        var skip = (q.Page - 1) * q.PageSize;
        var items = await query.Skip(skip).Take(q.PageSize).ToListAsync(ct);

        return (items, total);
    }
    public Task<Employee?> GetByIdAsync(int id) => _db.Employees.FindAsync(id).AsTask();

    public async Task<Employee> AddAsync(Employee entity)
    {
        _db.Employees.Add(entity);
        await _db.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(Employee entity)
    {
        _db.Entry(entity).State = EntityState.Modified;
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Employee entity)
    {
        _db.Employees.Remove(entity);
        await _db.SaveChangesAsync();
    }

    public Task<bool> ExistsAsync(int id) => _db.Employees.AnyAsync(e => e.Id == id);

}
