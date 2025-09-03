using EmployeeApi.Contracts;
using EmployeeApi.DTOs;

namespace EmployeeApi.Services;

public enum ServiceError { None, NotFound, Forbidden, Unauthorized, BadRequest }

public interface IPostService
{
    Task<(ServiceError error, PostResponse? data)> CreateAsync(Guid userId, CreatePostRequest req, CancellationToken ct);
    Task<(ServiceError error, PostResponse? data)> GetByIdAsync(Guid? viewerId, Guid postId, CancellationToken ct);
    Task<(ServiceError error, PagedResult<PostResponse>? data)> ListAsync(
    Guid? viewerId,
    Guid? authorId,
    PagingQuery query,
    CancellationToken ct);
    Task<ServiceError> UpdateAsync(Guid userId, Guid postId, UpdatePostRequest req, CancellationToken ct);
    Task<ServiceError> DeleteAsync(Guid userId, Guid postId, CancellationToken ct);
}
