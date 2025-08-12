using AutoMapper;
using EmployeeApi.Data;
using EmployeeApi.DTOs;
using EmployeeApi.Repositories;

namespace EmployeeApi.Services;

public interface IEmployeeService
{
    Task<PagedResult<EmployeeDto>> GetAllAsync(EmployeeQuery query);
    Task<EmployeeDto?> GetByIdAsync(int id);
    Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto);
    Task<bool> UpdateAsync(UpdateEmployeeDto dto);
    Task<bool> DeleteAsync(int id);
}

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repo;
    private readonly IMapper _mapper;

    public EmployeeService(IEmployeeRepository repo, IMapper mapper)
    {
        _repo = repo;
        _mapper = mapper;
    }

    public async Task<PagedResult<EmployeeDto>> GetAllAsync(EmployeeQuery query)
     {
        var (items, total) = await _repo.GetAllAsync(query);
        var dtos = _mapper.Map<List<EmployeeDto>>(items);
        return new PagedResult<EmployeeDto>
        {
            Items = dtos,
            Page = query.Page,
            PageSize = query.PageSize,
            TotalItems = total
        };
    }
    public async Task<EmployeeDto?> GetByIdAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        return emp is null ? null : _mapper.Map<EmployeeDto>(emp);
    }

    public async Task<EmployeeDto> CreateAsync(CreateEmployeeDto dto)
    {
        var entity = _mapper.Map<Employee>(dto);
        await _repo.AddAsync(entity);
        return _mapper.Map<EmployeeDto>(entity);
    }

    public async Task<bool> UpdateAsync(UpdateEmployeeDto dto)
    {
        if (!await _repo.ExistsAsync(dto.Id)) return false;
        var entity = _mapper.Map<Employee>(dto);
        await _repo.UpdateAsync(entity);
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var emp = await _repo.GetByIdAsync(id);
        if (emp is null) return false;
        await _repo.DeleteAsync(emp);
        return true;
    }
}
