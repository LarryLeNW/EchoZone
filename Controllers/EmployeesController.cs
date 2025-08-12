using EmployeeApi.DTOs;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _svc;
    public EmployeesController(IEmployeeService svc) { _svc = svc; }

    [HttpGet]
    public async Task<ActionResult<PagedResult<EmployeeDto>>> GetAll([FromQuery] EmployeeQuery query)
        => Ok(await _svc.GetAllAsync(query));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDto>> GetById(int id)
    {
        var emp = await _svc.GetByIdAsync(id);
        return emp is null ? NotFound() : Ok(emp);
    }

    [HttpPost]
    public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeDto input)
    {
        var created = await _svc.CreateAsync(input);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto input)
    {
        if (id != input.Id) return BadRequest("Id mismatch");
        var ok = await _svc.UpdateAsync(input);
        return ok ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _svc.DeleteAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
