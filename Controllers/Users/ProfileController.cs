using EmployeeApi.Contracts;
using EmployeeApi.Domain;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController(IProfileService service) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var sub = User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (sub is null) return Unauthorized();
        var uid = Guid.Parse(sub);
        var res = await service.GetMeAsync(uid, ct);
        return res is null ? NotFound() : Ok(res);
    }

    [HttpPut("me")]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest req, CancellationToken ct)
    {
        var sub = User.FindFirstValue("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
        if (sub is null) return Unauthorized();
        var uid = Guid.Parse(sub);
        await service.UpdateMeAsync(uid, req, ct);
        return NoContent();
    }


    [HttpGet("{handle}")]
    public async Task<IActionResult> GetByHandle([FromRoute] string handle, CancellationToken ct)
    {
        var profile = await service.GetByHandleAsync(handle, ct);
        return profile is null ? NotFound() : Ok(profile);
    }

}
