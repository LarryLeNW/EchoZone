using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace EmployeeApi.Migrations
{
    /// <inheritdoc />
    public partial class InitPostgres : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    EmployeeCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Department = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Title = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Position = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Salary = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    HiredAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "Department", "Email", "EmployeeCode", "FullName", "HiredAt", "IsActive", "Position", "Salary", "Title" },
                values: new object[,]
                {
                    { 1, "HR", "a@example.com", "E0001", "Nguyen Van A", new DateTimeOffset(new DateTime(2023, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 7, 0, 0, 0)), true, "HR", 15000000m, "HR Officer" },
                    { 2, "IT", "b@example.com", "E0002", "Tran Thi B", new DateTimeOffset(new DateTime(2023, 5, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 7, 0, 0, 0)), true, "Backend", 30000000m, "Developer" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");
        }
    }
}
