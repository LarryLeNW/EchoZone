using EmployeeApi.Contracts;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EmployeeApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController(IPostService posts) : ControllerBase
{
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreatePostRequest req, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var (err, dto) = await posts.CreateAsync(userId.Value, req, ct);
        if (err != ServiceError.None) return this.FromError(err);

        return CreatedAtAction(nameof(GetById), new { id = dto!.PostId }, dto);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var viewer = User.GetUserId();
        var (err, dto) = await posts.GetByIdAsync(viewer, id, ct);
        return err == ServiceError.None ? Ok(dto) : this.FromError(err);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> List([FromQuery] Guid? authorId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20, CancellationToken ct = default)
    {
        var viewer = User.GetUserId();
        var (err, list) = await posts.ListAsync(viewer, authorId, page, pageSize, ct);
        return err == ServiceError.None ? Ok(list) : this.FromError(err);
    }

    [HttpPatch("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePostRequest req, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var err = await posts.UpdateAsync(userId.Value, id, req, ct);
        return err == ServiceError.None ? NoContent() : this.FromError(err);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var userId = User.GetUserId();
        if (userId is null) return Unauthorized();

        var err = await posts.DeleteAsync(userId.Value, id, ct);
        return err == ServiceError.None ? NoContent() : this.FromError(err);
    }
}

public static class ControllerErrorExtensions
{
    public static IActionResult FromError(this ControllerBase c, ServiceError e, string? message = null) => e switch
    {
        ServiceError.NotFound => c.NotFound(),
        ServiceError.Forbidden => c.Forbid(),
        ServiceError.Unauthorized => c.Unauthorized(),
        ServiceError.BadRequest => c.BadRequest(new { message = message ?? "Bad request" }),
        _ => c.Problem()
    };
}


