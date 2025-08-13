using EmployeeApi.Contracts;
using EmployeeApi.Domain;
using EmployeeApi.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Services;

public class PostService(AppDbContext db, IPostAccessService access) : IPostService
{
    public async Task<(ServiceError error, PostResponse? data)> CreateAsync(Guid userId, CreatePostRequest req, CancellationToken ct)
    {
        var post = new Post
        {
            PostId = Guid.NewGuid(),
            AuthorId = userId,
            Body = req.Body,
            MediaJson = req.MediaJson,
            Visibility = (PostVisibility)req.Visibility,
            AllowComments = req.AllowComments,
            AllowReactions = req.AllowReactions,
            CreatedAt = DateTime.UtcNow
        };

        await db.Posts.AddAsync(post, ct);

        if (post.Visibility == PostVisibility.Custom)
        {
            if (req.AllowUserIds is { Count: > 0 })
            {
                await db.PostAudiences.AddRangeAsync(
                    req.AllowUserIds.Select(uid => new PostAudience { PostId = post.PostId, UserId = uid, Mode = AudienceMode.Allow }), ct);
            }
            if (req.DenyUserIds is { Count: > 0 })
            {
                await db.PostAudiences.AddRangeAsync(
                    req.DenyUserIds.Select(uid => new PostAudience { PostId = post.PostId, UserId = uid, Mode = AudienceMode.Deny }), ct);
            }
        }

        await db.SaveChangesAsync(ct);

        var dto = ToDto(post);
        return (ServiceError.None, dto);
    }

    public async Task<(ServiceError error, PostResponse? data)> GetByIdAsync(Guid? viewerId, Guid postId, CancellationToken ct)
    {
        var post = await db.Posts.AsNoTracking().FirstOrDefaultAsync(p => p.PostId == postId, ct);
        if (post is null || post.IsDeleted) return (ServiceError.NotFound, null);

        var canView = await access.CanViewAsync(viewerId, post, ct);
        if (!canView) return (ServiceError.Forbidden, null);

        return (ServiceError.None, ToDto(post));
    }

    public async Task<(ServiceError error, IEnumerable<PostResponse> data)> ListAsync(Guid? viewerId, Guid? authorId, int page, int pageSize, CancellationToken ct)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 50);

        IQueryable<Post> q = db.Posts.AsNoTracking();
        if (authorId.HasValue) q = q.Where(p => p.AuthorId == authorId);

        q = access.ApplyVisibility(q, viewerId).OrderByDescending(p => p.CreatedAt);

        var items = await q.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(ct);
        return (ServiceError.None, items.Select(ToDto));
    }

    public async Task<ServiceError> UpdateAsync(Guid userId, Guid postId, UpdatePostRequest req, CancellationToken ct)
    {
        var post = await db.Posts.FirstOrDefaultAsync(p => p.PostId == postId, ct);
        if (post is null || post.IsDeleted) return ServiceError.NotFound;
        if (post.AuthorId != userId) return ServiceError.Forbidden;

        if (req.Body is not null) post.Body = req.Body;
        if (req.MediaJson is not null) post.MediaJson = req.MediaJson;
        if (req.Visibility.HasValue) post.Visibility = (PostVisibility)req.Visibility.Value;
        if (req.AllowComments.HasValue) post.AllowComments = req.AllowComments.Value;
        if (req.AllowReactions.HasValue) post.AllowReactions = req.AllowReactions.Value;
        post.UpdatedAt = DateTime.UtcNow;

        if (post.Visibility == PostVisibility.Custom)
        {
            if (req.AllowUserIds is not null)
            {
                var oldAllow = db.PostAudiences.Where(a => a.PostId == post.PostId && a.Mode == AudienceMode.Allow);
                db.PostAudiences.RemoveRange(oldAllow);
                await db.PostAudiences.AddRangeAsync(req.AllowUserIds.Select(uid =>
                    new PostAudience { PostId = post.PostId, UserId = uid, Mode = AudienceMode.Allow }), ct);
            }
            if (req.DenyUserIds is not null)
            {
                var oldDeny = db.PostAudiences.Where(a => a.PostId == post.PostId && a.Mode == AudienceMode.Deny);
                db.PostAudiences.RemoveRange(oldDeny);
                await db.PostAudiences.AddRangeAsync(req.DenyUserIds.Select(uid =>
                    new PostAudience { PostId = post.PostId, UserId = uid, Mode = AudienceMode.Deny }), ct);
            }
        }
        else
        {
            var old = db.PostAudiences.Where(a => a.PostId == post.PostId);
            db.PostAudiences.RemoveRange(old);
        }

        await db.SaveChangesAsync(ct);
        return ServiceError.None;
    }

    public async Task<ServiceError> DeleteAsync(Guid userId, Guid postId, CancellationToken ct)
    {
        var post = await db.Posts.FirstOrDefaultAsync(p => p.PostId == postId, ct);
        if (post is null) return ServiceError.NotFound;
        if (post.AuthorId != userId) return ServiceError.Forbidden;

        post.IsDeleted = true;
        post.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return ServiceError.None;
    }

    private static PostResponse ToDto(Post p) =>
        new(p.PostId, p.AuthorId, p.Body, p.MediaJson,
            (byte)p.Visibility, p.AllowComments, p.AllowReactions,
            p.CreatedAt, p.UpdatedAt, p.CommentCount, p.ReactionCount);
}
