using Microsoft.EntityFrameworkCore;
using EmployeeApi.Domain;

namespace EmployeeApi.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Auth
        public DbSet<User> Users => Set<User>();
        public DbSet<Profile> Profiles => Set<Profile>();
        public DbSet<UserEmail> UserEmails => Set<UserEmail>();
        public DbSet<Credential> Credentials => Set<Credential>();
        public DbSet<Session> Sessions => Set<Session>();

        // Contents
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<PostAudience> PostAudiences => Set<PostAudience>();
        public DbSet<PostReaction> PostReactions => Set<PostReaction>();
        public DbSet<CommentReaction> CommentReactions => Set<CommentReaction>();

        // People
        public DbSet<Follow> Follows => Set<Follow>();
        public DbSet<Block> Blocks => Set<Block>();

        // Chat (THÊM DbSet để query/migrate rõ ràng)
        public DbSet<Conversation> Conversations => Set<Conversation>();
        public DbSet<ConversationMember> ConversationMembers => Set<ConversationMember>();
        public DbSet<Message> Messages => Set<Message>();
        public DbSet<MessageAttachment> MessageAttachments => Set<MessageAttachment>();
        public DbSet<MessageReaction> MessageReactions => Set<MessageReaction>();
        public DbSet<MessageRead> MessageReads => Set<MessageRead>();
        public DbSet<PinnedMessage> PinnedMessages => Set<PinnedMessage>();
        public DbSet<ConversationInvite> ConversationInvites => Set<ConversationInvite>();
        public DbSet<ConversationRole> ConversationRoles => Set<ConversationRole>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            base.OnModelCreating(b);

            // ===== Auth.Users =====
            b.Entity<User>(e =>
            {
                e.ToTable("Users", "Auth");
                e.HasKey(x => x.UserId);
                e.Property(x => x.UserId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

                e.HasOne(x => x.Profile)
                 .WithOne(p => p.User!)
                 .HasForeignKey<Profile>(p => p.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(x => x.Emails)
                 .WithOne(eu => eu.User!)
                 .HasForeignKey(eu => eu.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasMany(x => x.Credentials)
                 .WithOne(c => c.User!)
                 .HasForeignKey(c => c.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ===== People.Profiles =====
            b.Entity<Profile>(e =>
            {
                e.ToTable("Profiles", "People"); // sửa đúng schema
                e.HasKey(x => x.UserId);
                e.Property(x => x.Handle).HasMaxLength(100).IsRequired();
                e.HasIndex(p => p.Handle).IsUnique();
            });

            // ===== Auth.UserEmails =====
            b.Entity<UserEmail>(e =>
            {
                e.ToTable("UserEmails", "Auth");
                e.HasKey(x => x.EmailId);
                e.Property(x => x.EmailId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.Email).HasMaxLength(320).IsRequired();
                e.HasIndex(x => x.Email);
                e.HasIndex(x => new { x.UserId, x.IsPrimary })
                 .HasFilter("[IsPrimary] = 1")
                 .IsUnique(false);
            });

            // ===== Auth.Credentials =====
            b.Entity<Credential>(e =>
            {
                e.ToTable("Credentials", "Auth");
                e.HasKey(x => x.CredentialId);
                e.Property(x => x.CredentialId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.HasIndex(x => new { x.Provider, x.ProviderSubject }).IsUnique();
            });

            // ===== Auth.Sessions =====
            b.Entity<Session>(e =>
            {
                e.ToTable("Sessions", "Auth");
                e.HasKey(x => x.SessionId);
                e.Property(x => x.SessionId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
                e.HasIndex(x => new { x.UserId, x.ExpiresAt, x.RevokedAt });
                e.HasOne<User>()
                 .WithMany()
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ===== Contents.Posts =====
            b.Entity<Post>(e =>
            {
                e.ToTable("Posts", "Contents");
                e.HasKey(x => x.PostId);
                e.Property(x => x.PostId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

                // tránh multiple cascade paths: Users -> Posts = NoAction
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.AuthorId)
                 .OnDelete(DeleteBehavior.NoAction);

                e.HasIndex(x => new { x.AuthorId, x.CreatedAt }).IsDescending(false, true);
            });

            // ===== Contents.PostAudiences =====
            b.Entity<PostAudience>(e =>
            {
                e.ToTable("PostAudiences", "Contents");
                e.HasKey(x => new { x.PostId, x.UserId, x.Mode });
                e.HasOne<Post>().WithMany()
                 .HasForeignKey(x => x.PostId)
                 .OnDelete(DeleteBehavior.Cascade);
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.NoAction);
                e.HasIndex(x => x.UserId);
            });

            // ===== Contents.Comments =====
            b.Entity<Comment>(e =>
            {
                e.ToTable("Comments", "Contents");
                e.HasKey(x => x.CommentId);
                e.Property(x => x.CommentId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
                e.Property(x => x.Body).HasMaxLength(2000).IsRequired();

                e.HasOne<Post>().WithMany()
                 .HasForeignKey(x => x.PostId)
                 .OnDelete(DeleteBehavior.Cascade);

                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.AuthorId)
                 .OnDelete(DeleteBehavior.NoAction);

                e.HasOne<Comment>().WithMany()
                 .HasForeignKey(x => x.ParentCommentId)
                 .OnDelete(DeleteBehavior.NoAction);

                e.HasIndex(x => new { x.PostId, x.CreatedAt });
            });

            // ===== Contents.PostReactions =====
            b.Entity<PostReaction>(e =>
            {
                e.ToTable("PostReactions", "Contents");
                e.HasKey(x => new { x.PostId, x.UserId });
                e.Property(x => x.ReactedAt).HasDefaultValueSql("SYSUTCDATETIME()");
                e.HasOne<Post>().WithMany()
                 .HasForeignKey(x => x.PostId)
                 .OnDelete(DeleteBehavior.Cascade);
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.NoAction);
                e.HasIndex(x => new { x.PostId, x.Type });
            });

            // ===== Contents.CommentReactions =====
            b.Entity<CommentReaction>(e =>
            {
                e.ToTable("CommentReactions", "Contents");
                e.HasKey(x => new { x.CommentId, x.UserId });
                e.Property(x => x.ReactedAt).HasDefaultValueSql("SYSUTCDATETIME()");
                e.HasOne<Comment>().WithMany()
                 .HasForeignKey(x => x.CommentId)
                 .OnDelete(DeleteBehavior.Cascade);
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.UserId)
                 .OnDelete(DeleteBehavior.NoAction);
            });

            // ===== People.Follows =====
            b.Entity<Follow>(e =>
            {
                e.ToTable("Follows", "People");
                e.HasKey(x => new { x.FollowerId, x.FolloweeId });
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.FollowerId)
                 .OnDelete(DeleteBehavior.NoAction);
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.FolloweeId)
                 .OnDelete(DeleteBehavior.NoAction);
            });

            // ===== People.Blocks =====
            b.Entity<Block>(e =>
            {
                e.ToTable("Blocks", "People");
                e.HasKey(x => new { x.BlockerId, x.BlockedId });
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");

                e.HasOne(x => x.Blocker)
                 .WithMany(u => u.BlocksFrom)
                 .HasForeignKey(x => x.BlockerId)
                 .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Blocked)
                 .WithMany(u => u.BlocksTo)
                 .HasForeignKey(x => x.BlockedId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            // ===== Chat.Conversations =====
            b.Entity<Conversation>()
             .HasIndex(c => c.DirectKey)
             .IsUnique()
             .HasFilter("[DirectKey] IS NOT NULL");

            b.Entity<ConversationMember>()
             .HasOne(cm => cm.Conversation)
             .WithMany(c => c.Members)
             .HasForeignKey(cm => cm.ConversationId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<ConversationMember>()
             .HasOne(cm => cm.User)
             .WithMany(u => u.ConversationMembers)
             .HasForeignKey(cm => cm.UserId)
             .OnDelete(DeleteBehavior.NoAction);

            b.Entity<Message>()
             .HasOne(m => m.Conversation)
             .WithMany(c => c.Messages)
             .HasForeignKey(m => m.ConversationId)
             .OnDelete(DeleteBehavior.NoAction);

            b.Entity<Message>()
             .HasOne(m => m.Author)
             .WithMany(u => u.AuthoredMessages)
             .HasForeignKey(m => m.AuthorId)
             .OnDelete(DeleteBehavior.NoAction);

            b.Entity<Message>()
             .HasOne(m => m.MemberPersona)
             .WithMany()
             .HasForeignKey(m => new { m.MemberConversationId, m.MemberUserId })
             .OnDelete(DeleteBehavior.NoAction);

            b.Entity<Message>()
             .HasOne<Message>()
             .WithMany()
             .HasForeignKey(m => m.ParentMessageId)
             .OnDelete(DeleteBehavior.ClientSetNull);

            b.Entity<Message>()
             .HasOne<Message>()
             .WithMany()
             .HasForeignKey(m => m.ThreadRootId)
             .OnDelete(DeleteBehavior.ClientSetNull);

            b.Entity<MessageAttachment>()
             .HasOne(a => a.Message)
             .WithMany(m => m.Attachments)
             .HasForeignKey(a => a.MessageId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<MessageReaction>()
             .HasOne(r => r.Message)
             .WithMany(m => m.Reactions)
             .HasForeignKey(r => r.MessageId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<MessageReaction>()
             .HasOne(r => r.User)
             .WithMany(u => u.MessageReactions)
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.NoAction);

            b.Entity<MessageRead>()
             .HasOne(r => r.Message)
             .WithMany(m => m.Reads)
             .HasForeignKey(r => r.MessageId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<MessageRead>()
             .HasOne(r => r.User)
             .WithMany(u => u.MessageReads)
             .HasForeignKey(r => r.UserId)
             .OnDelete(DeleteBehavior.NoAction);

            b.Entity<PinnedMessage>()
             .HasOne(p => p.Conversation)
             .WithMany(c => c.Pins)
             .HasForeignKey(p => p.ConversationId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<PinnedMessage>()
             .HasOne(p => p.Message)
             .WithMany()
             .HasForeignKey(p => p.MessageId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<PinnedMessage>()
             .HasOne(p => p.PinnedBy)
             .WithMany()
             .HasForeignKey(p => p.PinnedById)
             .OnDelete(DeleteBehavior.Restrict);

            b.Entity<ConversationInvite>()
             .HasOne(i => i.Conversation)
             .WithMany(c => c.Invites)
             .HasForeignKey(i => i.ConversationId)
             .OnDelete(DeleteBehavior.Cascade);

            b.Entity<ConversationInvite>()
             .HasOne(i => i.CreatedBy)
             .WithMany()
             .HasForeignKey(i => i.CreatedById)
             .OnDelete(DeleteBehavior.Restrict);

            b.Entity<ConversationRole>()
             .HasOne(r => r.Conversation)
             .WithMany()
             .HasForeignKey(r => r.ConversationId)
             .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
