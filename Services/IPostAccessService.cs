using EmployeeApi.Domain;

namespace EmployeeApi.Services;

public interface IPostAccessService
{
    Task<bool> CanViewAsync(Guid? viewerId, Post post, CancellationToken ct = default);
    IQueryable<Post> ApplyVisibility(IQueryable<Post> posts, Guid? viewerId);
}

