using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace LearningAPI.Migrations
{
    /// <inheritdoc />
    public partial class SustainabilityAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FoodWasteEntries",
                columns: table => new
                {
                    WasteId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    IngredientId = table.Column<int>(type: "int", nullable: false),
                    WasteAmount = table.Column<int>(type: "int", nullable: false),
                    LoggedOn = table.Column<DateTime>(type: "datetime", nullable: false),
                    WasteReason = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FoodWasteEntries", x => x.WasteId);
                    table.ForeignKey(
                        name: "FK_FoodWasteEntries_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SustainabilityBadges",
                columns: table => new
                {
                    BadgeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BadgeName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    BadgeDescription = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    AwardedOn = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SustainabilityBadges", x => x.BadgeId);
                    table.ForeignKey(
                        name: "FK_SustainabilityBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SustainabilityGoals",
                columns: table => new
                {
                    SustainabilityGoalId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    GoalName = table.Column<string>(type: "longtext", nullable: false),
                    GoalDescription = table.Column<string>(type: "longtext", nullable: false),
                    TargetValue = table.Column<int>(type: "int", nullable: false),
                    CurrentValue = table.Column<int>(type: "int", nullable: false),
                    Deadline = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SustainabilityGoals", x => x.SustainabilityGoalId);
                    table.ForeignKey(
                        name: "FK_SustainabilityGoals_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_FoodWasteEntries_UserId",
                table: "FoodWasteEntries",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SustainabilityBadges_UserId",
                table: "SustainabilityBadges",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SustainabilityGoals_UserId",
                table: "SustainabilityGoals",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FoodWasteEntries");

            migrationBuilder.DropTable(
                name: "SustainabilityBadges");

            migrationBuilder.DropTable(
                name: "SustainabilityGoals");
        }
    }
}
