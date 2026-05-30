using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DevCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "cards",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "TEXT", nullable: false),
                    full_name = table.Column<string>(type: "TEXT", nullable: false),
                    title = table.Column<string>(type: "TEXT", nullable: false),
                    bio = table.Column<string>(type: "TEXT", nullable: false),
                    avatar_url = table.Column<string>(type: "TEXT", nullable: false),
                    theme_name = table.Column<string>(type: "TEXT", nullable: false),
                    skills = table.Column<string>(type: "jsonb", nullable: false),
                    social_links = table.Column<string>(type: "jsonb", nullable: false),
                    projects = table.Column<string>(type: "jsonb", nullable: false),
                    created_at = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cards", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "cards");
        }
    }
}
