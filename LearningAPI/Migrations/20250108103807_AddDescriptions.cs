using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDescriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ResourceTypeDescription",
                table: "ResourceTypes",
                type: "longtext",
                nullable: false);

            migrationBuilder.AddColumn<string>(
                name: "ResourceDescription",
                table: "Resources",
                type: "longtext",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResourceTypeDescription",
                table: "ResourceTypes");

            migrationBuilder.DropColumn(
                name: "ResourceDescription",
                table: "Resources");
        }
    }
}
