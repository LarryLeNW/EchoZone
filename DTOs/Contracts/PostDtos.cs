namespace EmployeeApi.Contracts;

public record CreatePostRequest(
    string? Body,
    string? MediaJson,
    byte Visibility,
    bool AllowComments = true,
    bool AllowReactions = true,
    List<Guid>? AllowUserIds = null,
    List<Guid>? DenyUserIds = null
);

public record UpdatePostRequest(
    string? Body = null,
    string? MediaJson = null,
    byte? Visibility = null,
    bool? AllowComments = null,
    bool? AllowReactions = null,
    List<Guid>? AllowUserIds = null,
    List<Guid>? DenyUserIds = null
);

public record PostResponse(
    Guid PostId, Guid AuthorId,
    string? Body, string? MediaJson,
    byte Visibility, bool AllowComments, bool AllowReactions,
    DateTime CreatedAt, DateTime? UpdatedAt,
    int CommentCount, int ReactionCount,
    string? AuthorDisplayName,
    string? AuthorHandle,
    string? AuthorAvatarUrl
);