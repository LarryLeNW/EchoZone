using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "ok", serverTime = DateTime.UtcNow });
}
