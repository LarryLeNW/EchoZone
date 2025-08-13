using System.Security.Claims;
using EmployeeApi.Domain;
using EmployeeApi.Infrastructure;
using EmployeeApi.Services;
using Microsoft.EntityFrameworkCore;

public class PostAccessService(AppDbContext db) : IPostAccessService
{
    public async Task<bool> CanViewAsync(Guid? viewerId, Post post, CancellationToken ct = default)
    {
        if (post.IsDeleted) return false;
        if (post.Visibility == PostVisibility.Public) return true;

        if (!viewerId.HasValue) return false;
        var viewer = viewerId.Value;
        if (viewer == post.AuthorId) return true;

        var blocked = await db.Blocks.AnyAsync(b =>
                (b.BlockerId == post.AuthorId && b.BlockedId == viewer) ||
                (b.BlockerId == viewer && b.BlockedId == post.AuthorId), ct);
        if (blocked) return false;

        return post.Visibility switch
        {
            PostVisibility.Private => false,
            PostVisibility.Followers => await db.Follows.AnyAsync(f =>
                                        f.FollowerId == viewer && f.FolloweeId == post.AuthorId && f.Status == FollowStatus.Accepted, ct),
            PostVisibility.Friends => await db.Follows.AnyAsync(f =>
                                        f.FollowerId == viewer && f.FolloweeId == post.AuthorId && f.Status == FollowStatus.Accepted, ct)
                                     && await db.Follows.AnyAsync(f =>
                                        f.FollowerId == post.AuthorId && f.FolloweeId == viewer && f.Status == FollowStatus.Accepted, ct),
            PostVisibility.Custom => await db.PostAudiences.AnyAsync(a =>
                                        a.PostId == post.PostId && a.UserId == viewer && a.Mode == AudienceMode.Allow, ct)
                                     && !await db.PostAudiences.AnyAsync(a =>
                                        a.PostId == post.PostId && a.UserId == viewer && a.Mode == AudienceMode.Deny, ct),
            _ => false
        };
    }

    public IQueryable<Post> ApplyVisibility(IQueryable<Post> posts, Guid? viewerId)
    {
        posts = posts.Where(p => !p.IsDeleted);

        if (!viewerId.HasValue)
            return posts.Where(p => p.Visibility == PostVisibility.Public);

        var v = viewerId.Value;

        return posts.Where(p =>
            // Block
            !db.Blocks.Any(b => (b.BlockerId == p.AuthorId && b.BlockedId == v)
                             || (b.BlockerId == v && b.BlockedId == p.AuthorId))
            &&
            (
                p.Visibility == PostVisibility.Public
                || p.AuthorId == v
                || (p.Visibility == PostVisibility.Followers &&
                    db.Follows.Any(f => f.FollowerId == v && f.FolloweeId == p.AuthorId && f.Status == FollowStatus.Accepted))
                || (p.Visibility == PostVisibility.Friends &&
                    db.Follows.Any(f => f.FollowerId == v && f.FolloweeId == p.AuthorId && f.Status == FollowStatus.Accepted) &&
                    db.Follows.Any(f => f.FollowerId == p.AuthorId && f.FolloweeId == v && f.Status == FollowStatus.Accepted))
                || (p.Visibility == PostVisibility.Custom &&
                    db.PostAudiences.Any(a => a.PostId == p.PostId && a.UserId == v && a.Mode == AudienceMode.Allow) &&
                   !db.PostAudiences.Any(a => a.PostId == p.PostId && a.UserId == v && a.Mode == AudienceMode.Deny))
            )
        );
    }
}


