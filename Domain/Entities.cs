using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Domain;

[Table("Users", Schema = "Auth")]
public class User
{
    [Key] public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
    public byte Status { get; set; } = 1; // 1=active

    public Profile? Profile { get; set; }
    public List<UserEmail> Emails { get; set; } = [];
    public List<Credential> Credentials { get; set; } = [];
}

[Table("Profiles", Schema = "People")]
public class Profile
{
    [Key, ForeignKey(nameof(User))] public Guid UserId { get; set; }
    [Required, MaxLength(100)] public string DisplayName { get; set; } = default!;
    [Required, MaxLength(30)] public string Handle { get; set; } = default!;
    [MaxLength(280)] public string? Bio { get; set; }
    [MaxLength(400)] public string? AvatarUrl { get; set; }
    public bool IsPrivate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}

[Table("UserEmails", Schema = "Auth")]
public class UserEmail
{
    [Key] public Guid EmailId { get; set; }
    public Guid UserId { get; set; }
    [Required, MaxLength(320)] public string Email { get; set; } = default!;
    public bool IsPrimary { get; set; }
    public bool IsVerified { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }

    [NotMapped] public string EmailNormalized => Email.Trim().ToLowerInvariant();
}

[Table("Credentials", Schema = "Auth")]
public class Credential
{
    [Key] public Guid CredentialId { get; set; }
    public Guid UserId { get; set; }
    [Required, MaxLength(50)] public string Provider { get; set; } = "local";
    [Required, MaxLength(255)] public string ProviderSubject { get; set; } = "local";
    public byte[]? PasswordHash { get; set; }             // hash PBKDF2
    [MaxLength(50)] public string? PasswordAlgo { get; set; } // "PBKDF2"
    public DateTime? PasswordUpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}

[Table("Sessions", Schema = "Auth")]
public class Session
{
    [Key] public Guid SessionId { get; set; }
    public Guid UserId { get; set; }
    public byte[] RefreshTokenHash { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUsedAt { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime? RevokedAt { get; set; }
    public Guid? ParentSessionId { get; set; }
    public Guid? ReplacedBySessionId { get; set; }
    [MaxLength(45)] public string? IpAddress { get; set; }
    [MaxLength(512)] public string? UserAgent { get; set; }
    [MaxLength(100)] public string? DeviceName { get; set; }
}

public enum PostVisibility : byte { Public = 0, Followers = 1, Friends = 2, Private = 3, Custom = 4 }
public enum AudienceMode : byte { Allow = 1, Deny = 2 }
public enum ReactionType : byte { Like = 1, Love = 2, Haha = 3, Wow = 4, Sad = 5, Angry = 6, Care = 7 }
public enum FollowStatus : byte { Pending = 0, Accepted = 1, Declined = 2 }

[Table("Posts", Schema = "Contents")]
[Index(nameof(AuthorId), nameof(CreatedAt), Name = "IX_Posts_AuthorTime")]
public class Post
{
    [Key] public Guid PostId { get; set; }

    [Required] public Guid AuthorId { get; set; }
    public User? Author { get; set; }

    public string? Body { get; set; }
    public string? MediaJson { get; set; }

    [Required] public PostVisibility Visibility { get; set; } = PostVisibility.Public;
    public bool AllowComments { get; set; } = true;
    public bool AllowReactions { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;

    public int CommentCount { get; set; } = 0;
    public int ReactionCount { get; set; } = 0;

    public ICollection<PostAudience> Audiences { get; set; } = [];
    public ICollection<PostReaction> Reactions { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
}

/* Audience tuỳ chỉnh (whitelist/blacklist) */
[Table("PostAudiences", Schema = "Contents")]
[PrimaryKey(nameof(PostId), nameof(UserId), nameof(Mode))]
public class PostAudience
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public AudienceMode Mode { get; set; } // 1=allow, 2=deny

    public Post? Post { get; set; }
}

[Table("Comments", Schema = "Contents")]
[Index(nameof(PostId), nameof(CreatedAt), Name = "IX_Comments_PostTime")]
public class Comment
{
    [Key] public Guid CommentId { get; set; }

    [Required] public Guid PostId { get; set; }
    public Post? Post { get; set; }

    [Required] public Guid AuthorId { get; set; }
    public User? Author { get; set; }

    public Guid? ParentCommentId { get; set; }
    [ForeignKey(nameof(ParentCommentId))]
    public Comment? Parent { get; set; }
    public ICollection<Comment> Replies { get; set; } = [];

    [Required, MaxLength(2000)] public string Body { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;

    public ICollection<CommentReaction> Reactions { get; set; } = [];
}

[Table("PostReactions", Schema = "Contents")]
[PrimaryKey(nameof(PostId), nameof(UserId))]
[Index(nameof(PostId), nameof(Type), Name = "IX_PostReactions_Type")]
public class PostReaction
{
    public Guid PostId { get; set; }
    public Guid UserId { get; set; }
    public ReactionType Type { get; set; }
    public DateTime ReactedAt { get; set; } = DateTime.UtcNow;

    public Post? Post { get; set; }
}

[Table("CommentReactions", Schema = "Contents")]
[PrimaryKey(nameof(CommentId), nameof(UserId))]
public class CommentReaction
{
    public Guid CommentId { get; set; }
    public Guid UserId { get; set; }
    public ReactionType Type { get; set; }
    public DateTime ReactedAt { get; set; } = DateTime.UtcNow;

    public Comment? Comment { get; set; }
}

/* ===================== FOLLOW & BLOCK ===================== */
[Table("Follows", Schema = "People")]
[PrimaryKey(nameof(FollowerId), nameof(FolloweeId))]
public class Follow
{
    public Guid FollowerId { get; set; }
    public Guid FolloweeId { get; set; }
    public FollowStatus Status { get; set; } = FollowStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("Blocks", Schema = "People")]
[PrimaryKey(nameof(BlockerId), nameof(BlockedId))]
public class Block
{
    public Guid BlockerId { get; set; }
    public Guid BlockedId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
