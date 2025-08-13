using System.Security.Claims;
using EmployeeApi.Contracts;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(IProfileService service) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var sub = User.FindFirstValue("sub");
        if (sub is null) return Unauthorized();
        var uid = Guid.Parse(sub);

        var res = await service.GetMeAsync(uid, ct);
        return res is null ? NotFound() : Ok(res);
    }

    [HttpPut("me")]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest req, CancellationToken ct)
    {
        var sub = User.FindFirstValue("sub");
        if (sub is null) return Unauthorized();
        var uid = Guid.Parse(sub);

        await service.UpdateMeAsync(uid, req, ct);
        return NoContent();
    }
}
