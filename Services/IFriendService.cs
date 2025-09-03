using EmployeeApi.Contracts;

namespace EmployeeApi.Services
{
    public interface IFriendService
    {
        Task SendRequestAsync(Guid fromUserId, Guid toUserId, CancellationToken ct);
        Task AcceptRequestAsync(Guid currentUserId, Guid fromUserId, CancellationToken ct);
        Task DeclineRequestAsync(Guid currentUserId, Guid fromUserId, CancellationToken ct);
        Task CancelRequestAsync(Guid currentUserId, Guid toUserId, CancellationToken ct);
        Task UnfriendAsync(Guid currentUserId, Guid friendUserId, CancellationToken ct);

        Task<IReadOnlyList<ProfileResponse>> GetFriendsAsync(Guid currentUserId, CancellationToken ct);
        Task<IReadOnlyList<ProfileResponse>> GetPendingRequestsAsync(Guid currentUserId, CancellationToken ct);
    }
}