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

                // Profile 1-1
                e.HasOne(x => x.Profile)
                 .WithOne(p => p.User!)
                 .HasForeignKey<Profile>(p => p.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Emails 1-n
                e.HasMany(x => x.Emails)
                 .WithOne(eu => eu.User!)
                 .HasForeignKey(eu => eu.UserId)
                 .OnDelete(DeleteBehavior.Cascade);

                // Credentials 1-n
                e.HasMany(x => x.Credentials)
                 .WithOne(c => c.User!)
                 .HasForeignKey(c => c.UserId)
                 .OnDelete(DeleteBehavior.Cascade);
            });

            // ===== Auth.Profile =====
            b.Entity<Profile>(e =>
            {
                e.ToTable("Profiles", "Auth");
                e.HasKey(x => x.UserId); // 1-1 với Users
                e.Property(x => x.Handle).HasMaxLength(100).IsRequired();
                e.HasIndex(p => p.Handle).IsUnique(); // unique handle
            });

            // ===== Auth.UserEmails =====
            b.Entity<UserEmail>(e =>
            {
                e.ToTable("UserEmails", "Auth");
                e.HasKey(x => x.EmailId);
                e.Property(x => x.EmailId).HasDefaultValueSql("NEWSEQUENTIALID()");
                e.Property(x => x.Email).HasMaxLength(320).IsRequired();
                e.HasIndex(x => x.Email); // phụ để search
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

                // Tránh multiple cascade paths:
                // User -> Posts : NO ACTION
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.AuthorId)
                 .OnDelete(DeleteBehavior.NoAction);

                // Index: (AuthorId, CreatedAt DESC)
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
                 .OnDelete(DeleteBehavior.NoAction); // tránh thêm đường cascade từ User
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

                // Post -> Comments : CASCADE (xoá post xoá comment)
                e.HasOne<Post>().WithMany()
                 .HasForeignKey(x => x.PostId)
                 .OnDelete(DeleteBehavior.Cascade);

                // User -> Comments : NO ACTION (cắt đường cascade thứ 2)
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.AuthorId)
                 .OnDelete(DeleteBehavior.NoAction);

                // self reference parent: NO ACTION
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
                 .OnDelete(DeleteBehavior.NoAction); // tránh cascade từ User
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
                 .OnDelete(DeleteBehavior.NoAction); // tránh cascade từ User
            });

            // ===== People.Follows =====
            b.Entity<Follow>(e =>
            {
                e.ToTable("Follows", "People");
                e.HasKey(x => new { x.FollowerId, x.FolloweeId });
                e.Property(x => x.CreatedAt).HasDefaultValueSql("SYSUTCDATETIME()");
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.FollowerId)
                 .OnDelete(DeleteBehavior.NoAction); // tránh User cascade
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
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.BlockerId)
                 .OnDelete(DeleteBehavior.NoAction);
                e.HasOne<User>().WithMany()
                 .HasForeignKey(x => x.BlockedId)
                 .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
