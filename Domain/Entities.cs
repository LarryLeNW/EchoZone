using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace EmployeeApi.Domain;


public enum ConversationType : byte { Direct = 1, Group = 2 }
public enum ConversationPrivacy : byte { Open = 1, Private = 2, Hidden = 3 }
public enum AnonymityMode : byte { Disabled = 0, Optional = 1, Required = 2 }
public enum MessageType : byte { Text = 1, Media = 2, System = 3 }
public enum MemberRole : byte { Owner = 1, Admin = 2, Moderator = 3, Member = 4 }

public enum PostVisibility : byte { Public = 0, Followers = 1, Friends = 2, Private = 3, Custom = 4 }
public enum AudienceMode : byte { Allow = 1, Deny = 2 }
public enum ReactionType : byte { Like = 1, Love = 2, Haha = 3, Wow = 4, Sad = 5, Angry = 6, Care = 7 }
public enum FollowStatus : byte { Pending = 0, Accepted = 1, Declined = 2 }

public enum NotificationType : byte
{
    Like = 1,
    Comment = 2,
    Mention = 3,
    FriendRequest = 4,
    Message = 5,
}


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

    [InverseProperty(nameof(ConversationMember.User))]
    public ICollection<ConversationMember> ConversationMembers { get; set; } = [];

    [InverseProperty(nameof(Message.Author))]
    public ICollection<Message> AuthoredMessages { get; set; } = [];

    [InverseProperty(nameof(MessageReaction.User))]
    public ICollection<MessageReaction> MessageReactions { get; set; } = [];

    [InverseProperty(nameof(MessageRead.User))]
    public ICollection<MessageRead> MessageReads { get; set; } = [];

    [InverseProperty(nameof(Block.Blocker))]
    public ICollection<Block> BlocksFrom { get; set; } = [];

    [InverseProperty(nameof(Block.Blocked))]
    public ICollection<Block> BlocksTo { get; set; } = [];
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

    [ForeignKey(nameof(BlockerId))]
    [InverseProperty(nameof(User.BlocksFrom))]
    public User? Blocker { get; set; }

    [ForeignKey(nameof(BlockedId))]
    [InverseProperty(nameof(User.BlocksTo))]
    public User? Blocked { get; set; }
}

// conversations feature ...
[Table("Conversations", Schema = "Chat")]
[Index(nameof(CreatedAt), Name = "IX_Conversations_CreatedAt")]
public class Conversation
{
    [Key] public Guid ConversationId { get; set; }

    [Required] public ConversationType Type { get; set; } = ConversationType.Group;
    [MaxLength(200)] public string? Title { get; set; }

    [Required] public ConversationPrivacy Privacy { get; set; } = ConversationPrivacy.Private;
    [Required] public AnonymityMode AnonymityMode { get; set; } = AnonymityMode.Disabled;

    [Required] public Guid CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }

    [MaxLength(200)] public string? DirectKey { get; set; }

    public ICollection<ConversationMember> Members { get; set; } = [];
    public ICollection<Message> Messages { get; set; } = [];
    public ICollection<PinnedMessage> Pins { get; set; } = [];
    public ICollection<ConversationInvite> Invites { get; set; } = [];
}

[Table("ConversationMembers", Schema = "Chat")]
[PrimaryKey(nameof(ConversationId), nameof(UserId))]
[Index(nameof(Role), Name = "IX_ConversationMembers_Role")]
public class ConversationMember
{
    public Guid ConversationId { get; set; }
    public Guid UserId { get; set; }

    [Required] public MemberRole Role { get; set; } = MemberRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public bool IsAnonymous { get; set; } = false;
    [MaxLength(100)] public string? DisplayNameOverride { get; set; }
    [MaxLength(400)] public string? AvatarOverride { get; set; }

    public Conversation? Conversation { get; set; }
    public User? User { get; set; }
}

[Table("Messages", Schema = "Chat")]
[Index(nameof(ConversationId), nameof(CreatedAt), Name = "IX_Messages_ConvTime")]
[Index(nameof(ThreadRootId), nameof(CreatedAt), Name = "IX_Messages_ThreadTime")]
public class Message
{
    [Key] public Guid MessageId { get; set; }

    [Required] public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }

    public Guid? AuthorId { get; set; }
    public User? Author { get; set; }

    public Guid? MemberUserId { get; set; }
    public Guid? MemberConversationId { get; set; }
    [ForeignKey(nameof(MemberConversationId) + "," + nameof(MemberUserId))]
    public ConversationMember? MemberPersona { get; set; }

    [Required] public MessageType Type { get; set; } = MessageType.Text;

    public string? Body { get; set; }
    public string? MediaJson { get; set; }

    public Guid? ParentMessageId { get; set; }
    public Guid? ThreadRootId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EditedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
    public bool DeleteForEveryone { get; set; } = false;
    public DateTime? ExpiresAt { get; set; }

    public ICollection<MessageAttachment> Attachments { get; set; } = [];
    public ICollection<MessageReaction> Reactions { get; set; } = [];
    public ICollection<MessageRead> Reads { get; set; } = [];
}

[Table("MessageAttachments", Schema = "Chat")]
[Index(nameof(MessageId), Name = "IX_MessageAttachments_MessageId")]
public class MessageAttachment
{
    [Key] public Guid AttachmentId { get; set; }
    [Required] public Guid MessageId { get; set; }
    public Message? Message { get; set; }

    [Required, MaxLength(1000)] public string Url { get; set; } = default!;
    [MaxLength(150)] public string? MimeType { get; set; }
    public int? SizeBytes { get; set; }
    public int? Width { get; set; }
    public int? Height { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("MessageReactions", Schema = "Chat")]
[PrimaryKey(nameof(MessageId), nameof(UserId), nameof(Emoji))]
[Index(nameof(MessageId), Name = "IX_MessageReactions_MessageId")]
public class MessageReaction
{
    public Guid MessageId { get; set; }
    public Guid UserId { get; set; }

    [Required, MaxLength(32)] public string Emoji { get; set; } = default!;
    public DateTime ReactedAt { get; set; } = DateTime.UtcNow;

    public Message? Message { get; set; }
    public User? User { get; set; }
}

[Table("MessageReads", Schema = "Chat")]
[PrimaryKey(nameof(MessageId), nameof(UserId))]
[Index(nameof(UserId), nameof(ReadAt), Name = "IX_MessageReads_UserTime")]
public class MessageRead
{
    public Guid MessageId { get; set; }
    public Guid UserId { get; set; }
    public DateTime ReadAt { get; set; } = DateTime.UtcNow;

    public Message? Message { get; set; }
    public User? User { get; set; }
}

[Table("PinnedMessages", Schema = "Chat")]
[PrimaryKey(nameof(ConversationId), nameof(MessageId))]
public class PinnedMessage
{
    public Guid ConversationId { get; set; }
    public Guid MessageId { get; set; }
    public Guid PinnedById { get; set; }
    public DateTime PinnedAt { get; set; } = DateTime.UtcNow;

    public Conversation? Conversation { get; set; }
    public Message? Message { get; set; }
    public User? PinnedBy { get; set; }
}

[Table("ConversationInvites", Schema = "Chat")]
[Index(nameof(Code), IsUnique = true, Name = "UX_ConversationInvites_Code")]
public class ConversationInvite
{
    [Key] public Guid InviteId { get; set; }
    [Required] public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }

    [Required] public Guid CreatedById { get; set; }
    public User? CreatedBy { get; set; }

    [Required, MaxLength(64)] public string Code { get; set; } = default!;
    public int? MaxUses { get; set; }
    public int Uses { get; set; } = 0;
    public DateTime? ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("ConversationRoles", Schema = "Chat")]
[PrimaryKey(nameof(ConversationId), nameof(Name))]
public class ConversationRole
{
    public Guid ConversationId { get; set; }
    public Conversation? Conversation { get; set; }

    [MaxLength(50)] public string Name { get; set; } = default!; // "Admin","Member"...
    // permissions: {"send":true,"pin":true,"invite":true,"kick":false,"enableAnon":true}
    [Required] public string PermissionsJson { get; set; } = "{\"send\":true}";
}

[Table("Notifications", Schema = "People")]
public class Notification
{
    [Key] public Guid NotificationId { get; set; }

    [Required] public Guid UserId { get; set; }

    [Required] public Guid ActorId { get; set; }
    [Required] public NotificationType Type { get; set; }

    [Required] public Guid ObjectId { get; set; }
    [Required, MaxLength(30)] public string ObjectType { get; set; }

    [MaxLength(400)] public string? DataJson { get; set; }

    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(100)] public string? GroupKey { get; set; }

    public User? User { get; set; }
    public User? Actor { get; set; }
}
