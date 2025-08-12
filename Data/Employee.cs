using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeApi.Data;

public class Employee
{
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string EmployeeCode { get; set; } = default!; // Mã nhân viên

    [Required, MaxLength(100)]
    public string FullName { get; set; } = default!;

    [Required, MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = default!;

    [MaxLength(100)]
    public string? Department { get; set; } // Phòng ban

    [MaxLength(100)]
    public string? Title { get; set; } // Chức danh (VD: Senior Developer)

    [Required, MaxLength(100)]
    public string Position { get; set; } = default!; // Vị trí công việc

    public bool IsActive { get; set; } = true; // Đang làm việc hay không

    [Range(0, 1_000_000)]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Salary { get; set; }

    public DateTimeOffset HiredAt { get; set; } = DateTime.UtcNow; // Ngày nhận việc
}
