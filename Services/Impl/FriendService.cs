using AutoMapper;
using EmployeeApi.Contracts;
using EmployeeApi.Infrastructure;
using EmployeeApi.Domain;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Services.Impl
{
    public class FriendService(AppDbContext db, IMapper mapper) : IFriendService
    {
        public async Task SendRequestAsync(Guid fromUserId, Guid toUserId, CancellationToken ct)
        {
            if (fromUserId == toUserId)
                throw new InvalidOperationException("Không thể gửi lời mời kết bạn cho chính mình.");

            var exists = await db.Follows.FindAsync([fromUserId, toUserId], ct);
            if (exists != null)
                throw new InvalidOperationException("Đã gửi lời mời hoặc đã là bạn.");

            db.Follows.Add(new Follow
            {
                FollowerId = fromUserId,
                FolloweeId = toUserId,
                Status = FollowStatus.Pending,
                CreatedAt = DateTime.UtcNow
            });

            await db.SaveChangesAsync(ct);
        }

        public async Task AcceptRequestAsync(Guid currentUserId, Guid fromUserId, CancellationToken ct)
        {
            var req = await db.Follows.FindAsync([fromUserId, currentUserId], ct);
            if (req == null || req.Status != FollowStatus.Pending)
                throw new InvalidOperationException("Không tìm thấy lời mời kết bạn.");

            req.Status = FollowStatus.Accepted;

            // Đảm bảo 2 chiều
            var reverse = await db.Follows.FindAsync([currentUserId, fromUserId], ct);
            if (reverse == null)
            {
                db.Follows.Add(new Follow
                {
                    FollowerId = currentUserId,
                    FolloweeId = fromUserId,
                    Status = FollowStatus.Accepted,
                    CreatedAt = DateTime.UtcNow
                });
            }
            else
            {
                reverse.Status = FollowStatus.Accepted;
            }

            await db.SaveChangesAsync(ct);
        }

        public async Task DeclineRequestAsync(Guid currentUserId, Guid fromUserId, CancellationToken ct)
        {
            var req = await db.Follows.FindAsync([fromUserId, currentUserId], ct);
            if (req == null || req.Status != FollowStatus.Pending)
                throw new InvalidOperationException("Không tìm thấy lời mời để từ chối.");

            req.Status = FollowStatus.Declined;
            await db.SaveChangesAsync(ct);
        }

        public async Task CancelRequestAsync(Guid currentUserId, Guid toUserId, CancellationToken ct)
        {
            var req = await db.Follows.FindAsync([currentUserId, toUserId], ct);
            if (req == null || req.Status != FollowStatus.Pending)
                throw new InvalidOperationException("Không có yêu cầu nào để huỷ.");

            db.Follows.Remove(req);
            await db.SaveChangesAsync(ct);
        }

        public async Task UnfriendAsync(Guid currentUserId, Guid friendUserId, CancellationToken ct)
        {
            var f1 = await db.Follows.FindAsync([currentUserId, friendUserId], ct);
            var f2 = await db.Follows.FindAsync([friendUserId, currentUserId], ct);

            if (f1 == null && f2 == null)
                throw new InvalidOperationException("Không phải bạn bè.");

            if (f1 != null) db.Follows.Remove(f1);
            if (f2 != null) db.Follows.Remove(f2);

            await db.SaveChangesAsync(ct);
        }

        public async Task<IReadOnlyList<ProfileResponse>> GetFriendsAsync(Guid currentUserId, CancellationToken ct)
        {
            var friendIds = await db.Follows
                .Where(f => f.FollowerId == currentUserId && f.Status == FollowStatus.Accepted)
                .Select(f => f.FolloweeId)
                .ToListAsync(ct);

            var profiles = await db.Profiles
                .Where(p => friendIds.Contains(p.UserId))
                .ToListAsync(ct);

            return mapper.Map<IReadOnlyList<ProfileResponse>>(profiles);
        }

        public async Task<IReadOnlyList<ProfileResponse>> GetPendingRequestsAsync(Guid currentUserId, CancellationToken ct)
        {
            var requesterIds = await db.Follows
                .Where(f => f.FolloweeId == currentUserId && f.Status == FollowStatus.Pending)
                .Select(f => f.FollowerId)
                .ToListAsync(ct);

            var profiles = await db.Profiles
                .Where(p => requesterIds.Contains(p.UserId))
                .ToListAsync(ct);

            return mapper.Map<IReadOnlyList<ProfileResponse>>(profiles);
        }

    }
}