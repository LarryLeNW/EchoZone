using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed minimal data (optional)
        modelBuilder.Entity<Employee>().HasData(
                new Employee {
            Id = 1,
            EmployeeCode = "E0001",
            FullName = "Nguyen Van A",
            Email = "a@example.com",
            Department = "HR",
            Title = "HR Officer",
            Position = "HR",
            IsActive = true,
            Salary = 15000000m,
            HiredAt = new DateTime(2023, 1, 2)
        },
        new Employee {
            Id = 2,
            EmployeeCode = "E0002",
            FullName = "Tran Thi B",    
            Email = "b@example.com",
            Department = "IT",
            Title = "Developer",
            Position = "Backend",
            IsActive = true,
            Salary = 30000000m,
            HiredAt = new DateTime(2023, 5, 10)
        }
        );
    }
}
