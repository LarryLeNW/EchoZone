using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)] 
public class ErrorsController : ControllerBase
{
    [Route("/error")]
    [HttpGet, HttpPost, HttpPut, HttpDelete, HttpPatch, HttpHead, HttpOptions]
    public IActionResult HandleError()
    {
        var feature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
        return Problem(title: "Unhandled error", detail: feature?.Error.Message, statusCode: 500);
    }
}
