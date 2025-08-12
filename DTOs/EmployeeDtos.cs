namespace EmployeeApi.DTOs;

public record EmployeeDto(
    int Id,
    string EmployeeCode,
    string FullName,
    string Email,
    string? Department,
    string? Title,
    string Position,
    bool IsActive,
    decimal Salary,
    DateTimeOffset HiredAt
);
public record CreateEmployeeDto(string FullName, string Position, decimal Salary);
public record UpdateEmployeeDto(int Id, string FullName, string Position, decimal Salary);
public class EmployeeQuery : PagingQuery
{
    public string? Keyword { get; set; }         
    public string? Department { get; set; }       
    public string? Title { get; set; }           
    public bool? IsActive { get; set; }           
    public decimal? MinSalary { get; set; }
    public decimal? MaxSalary { get; set; }
    public DateTimeOffset? HiredFrom { get; set; }
    public DateTimeOffset? HiredTo { get; set; }
}
