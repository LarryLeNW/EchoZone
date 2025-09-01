using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeApi.Migrations
{
    /// <inheritdoc />
    public partial class CreateConversations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockedId",
                schema: "People",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockerId",
                schema: "People",
                table: "Blocks");

            migrationBuilder.EnsureSchema(
                name: "Chat");

            migrationBuilder.RenameTable(
                name: "Profiles",
                schema: "Auth",
                newName: "Profiles",
                newSchema: "People");

            migrationBuilder.CreateTable(
                name: "Conversations",
                schema: "Chat",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<byte>(type: "tinyint", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Privacy = table.Column<byte>(type: "tinyint", nullable: false),
                    AnonymityMode = table.Column<byte>(type: "tinyint", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastMessageAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DirectKey = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.ConversationId);
                    table.ForeignKey(
                        name: "FK_Conversations_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ConversationInvites",
                schema: "Chat",
                columns: table => new
                {
                    InviteId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    MaxUses = table.Column<int>(type: "int", nullable: true),
                    Uses = table.Column<int>(type: "int", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationInvites", x => x.InviteId);
                    table.ForeignKey(
                        name: "FK_ConversationInvites_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Chat",
                        principalTable: "Conversations",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConversationInvites_Users_CreatedById",
                        column: x => x.CreatedById,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ConversationMembers",
                schema: "Chat",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Role = table.Column<byte>(type: "tinyint", nullable: false),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsAnonymous = table.Column<bool>(type: "bit", nullable: false),
                    DisplayNameOverride = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AvatarOverride = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationMembers", x => new { x.ConversationId, x.UserId });
                    table.ForeignKey(
                        name: "FK_ConversationMembers_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Chat",
                        principalTable: "Conversations",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ConversationMembers_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "ConversationRoles",
                schema: "Chat",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PermissionsJson = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ConversationRoles", x => new { x.ConversationId, x.Name });
                    table.ForeignKey(
                        name: "FK_ConversationRoles_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Chat",
                        principalTable: "Conversations",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                schema: "Chat",
                columns: table => new
                {
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AuthorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MemberUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    MemberConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Type = table.Column<byte>(type: "tinyint", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MediaJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentMessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ThreadRootId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EditedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeleteForEveryone = table.Column<bool>(type: "bit", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.MessageId);
                    table.ForeignKey(
                        name: "FK_Messages_ConversationMembers_MemberConversationId_MemberUserId",
                        columns: x => new { x.MemberConversationId, x.MemberUserId },
                        principalSchema: "Chat",
                        principalTable: "ConversationMembers",
                        principalColumns: new[] { "ConversationId", "UserId" });
                    table.ForeignKey(
                        name: "FK_Messages_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Chat",
                        principalTable: "Conversations",
                        principalColumn: "ConversationId");
                    table.ForeignKey(
                        name: "FK_Messages_Messages_ParentMessageId",
                        column: x => x.ParentMessageId,
                        principalSchema: "Chat",
                        principalTable: "Messages",
                        principalColumn: "MessageId");
                    table.ForeignKey(
                        name: "FK_Messages_Messages_ThreadRootId",
                        column: x => x.ThreadRootId,
                        principalSchema: "Chat",
                        principalTable: "Messages",
                        principalColumn: "MessageId");
                    table.ForeignKey(
                        name: "FK_Messages_Users_AuthorId",
                        column: x => x.AuthorId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "MessageAttachments",
                schema: "Chat",
                columns: table => new
                {
                    AttachmentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    MimeType = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    SizeBytes = table.Column<int>(type: "int", nullable: true),
                    Width = table.Column<int>(type: "int", nullable: true),
                    Height = table.Column<int>(type: "int", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageAttachments", x => x.AttachmentId);
                    table.ForeignKey(
                        name: "FK_MessageAttachments_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "Chat",
                        principalTable: "Messages",
                        principalColumn: "MessageId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MessageReactions",
                schema: "Chat",
                columns: table => new
                {
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Emoji = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    ReactedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageReactions", x => new { x.MessageId, x.UserId, x.Emoji });
                    table.ForeignKey(
                        name: "FK_MessageReactions_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "Chat",
                        principalTable: "Messages",
                        principalColumn: "MessageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MessageReactions_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "MessageReads",
                schema: "Chat",
                columns: table => new
                {
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MessageReads", x => new { x.MessageId, x.UserId });
                    table.ForeignKey(
                        name: "FK_MessageReads_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "Chat",
                        principalTable: "Messages",
                        principalColumn: "MessageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MessageReads_Users_UserId",
                        column: x => x.UserId,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "PinnedMessages",
                schema: "Chat",
                columns: table => new
                {
                    ConversationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MessageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PinnedById = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PinnedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PinnedMessages", x => new { x.ConversationId, x.MessageId });
                    table.ForeignKey(
                        name: "FK_PinnedMessages_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalSchema: "Chat",
                        principalTable: "Conversations",
                        principalColumn: "ConversationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PinnedMessages_Messages_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "Chat",
                        principalTable: "Messages",
                        principalColumn: "MessageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PinnedMessages_Users_PinnedById",
                        column: x => x.PinnedById,
                        principalSchema: "Auth",
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ConversationInvites_ConversationId",
                schema: "Chat",
                table: "ConversationInvites",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationInvites_CreatedById",
                schema: "Chat",
                table: "ConversationInvites",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "UX_ConversationInvites_Code",
                schema: "Chat",
                table: "ConversationInvites",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ConversationMembers_Role",
                schema: "Chat",
                table: "ConversationMembers",
                column: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_ConversationMembers_UserId",
                schema: "Chat",
                table: "ConversationMembers",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_CreatedAt",
                schema: "Chat",
                table: "Conversations",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_CreatedById",
                schema: "Chat",
                table: "Conversations",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_DirectKey",
                schema: "Chat",
                table: "Conversations",
                column: "DirectKey",
                unique: true,
                filter: "[DirectKey] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_MessageAttachments_MessageId",
                schema: "Chat",
                table: "MessageAttachments",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReactions_MessageId",
                schema: "Chat",
                table: "MessageReactions",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReactions_UserId",
                schema: "Chat",
                table: "MessageReactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReads_UserTime",
                schema: "Chat",
                table: "MessageReads",
                columns: new[] { "UserId", "ReadAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_AuthorId",
                schema: "Chat",
                table: "Messages",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConvTime",
                schema: "Chat",
                table: "Messages",
                columns: new[] { "ConversationId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_MemberConversationId_MemberUserId",
                schema: "Chat",
                table: "Messages",
                columns: new[] { "MemberConversationId", "MemberUserId" });

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ParentMessageId",
                schema: "Chat",
                table: "Messages",
                column: "ParentMessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ThreadTime",
                schema: "Chat",
                table: "Messages",
                columns: new[] { "ThreadRootId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PinnedMessages_MessageId",
                schema: "Chat",
                table: "PinnedMessages",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_PinnedMessages_PinnedById",
                schema: "Chat",
                table: "PinnedMessages",
                column: "PinnedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockedId",
                schema: "People",
                table: "Blocks",
                column: "BlockedId",
                principalSchema: "Auth",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockerId",
                schema: "People",
                table: "Blocks",
                column: "BlockerId",
                principalSchema: "Auth",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockedId",
                schema: "People",
                table: "Blocks");

            migrationBuilder.DropForeignKey(
                name: "FK_Blocks_Users_BlockerId",
                schema: "People",
                table: "Blocks");

            migrationBuilder.DropTable(
                name: "ConversationInvites",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "ConversationRoles",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "MessageAttachments",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "MessageReactions",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "MessageReads",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "PinnedMessages",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "Messages",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "ConversationMembers",
                schema: "Chat");

            migrationBuilder.DropTable(
                name: "Conversations",
                schema: "Chat");

            migrationBuilder.RenameTable(
                name: "Profiles",
                schema: "People",
                newName: "Profiles",
                newSchema: "Auth");

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockedId",
                schema: "People",
                table: "Blocks",
                column: "BlockedId",
                principalSchema: "Auth",
                principalTable: "Users",
                principalColumn: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blocks_Users_BlockerId",
                schema: "People",
                table: "Blocks",
                column: "BlockerId",
                principalSchema: "Auth",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
