using System.Security.Claims;
using EmployeeApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers.Users
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendController(IFriendService service) : ControllerBase
    {
        private Guid GetUserId()
            => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        [HttpPost("{targetId:guid}/request")]
        public async Task<IActionResult> SendRequest(Guid targetId, CancellationToken ct)
        {
            await service.SendRequestAsync(GetUserId(), targetId, ct);
            return Ok(new { message = "Friend request sent" });
        }

        [HttpPost("{fromUserId:guid}/accept")]
        public async Task<IActionResult> Accept(Guid fromUserId, CancellationToken ct)
        {
            await service.AcceptRequestAsync(GetUserId(), fromUserId, ct);
            return Ok(new { message = "Friend request accepted" });
        }

        [HttpPost("{fromUserId:guid}/decline")]
        public async Task<IActionResult> Decline(Guid fromUserId, CancellationToken ct)
        {
            await service.DeclineRequestAsync(GetUserId(), fromUserId, ct);
            return Ok(new { message = "Friend request declined" });
        }

        [HttpDelete("{targetId:guid}/cancel")]
        public async Task<IActionResult> Cancel(Guid targetId, CancellationToken ct)
        {
            await service.CancelRequestAsync(GetUserId(), targetId, ct);
            return Ok(new { message = "Friend request canceled" });
        }

        [HttpDelete("{friendId:guid}/unfriend")]
        public async Task<IActionResult> Unfriend(Guid friendId, CancellationToken ct)
        {
            await service.UnfriendAsync(GetUserId(), friendId, ct);
            return Ok(new { message = "Unfriended successfully" });
        }

        [HttpGet("friends")]
        public async Task<IActionResult> Friends(CancellationToken ct)
        {
            var res = await service.GetFriendsAsync(GetUserId(), ct);
            return Ok(res);
        }

        [HttpGet("requests/pending")]
        public async Task<IActionResult> PendingRequests(CancellationToken ct)
        {
            var res = await service.GetPendingRequestsAsync(GetUserId(), ct);
            return Ok(res);
        }
    }
}