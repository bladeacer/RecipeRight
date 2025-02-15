using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace LearningAPI.Migrations
{
    /// <inheritdoc />
    public partial class stub : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tutorials");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "Attributes",
                columns: table => new
                {
                    AttributesId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    AttributeName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    AttributeDescription = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Attributes", x => x.AttributesId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ResourceTypes",
                columns: table => new
                {
                    ResourceTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    TypeName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    ResourceTypeDescription = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResourceTypes", x => x.ResourceTypeId);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "UserAttributes",
                columns: table => new
                {
                    UserAttributesId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserAttributeName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    UserAttributeDescription = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    AttributeId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserAttributes", x => x.UserAttributesId);
                    table.ForeignKey(
                        name: "FK_UserAttributes_Attributes_AttributeId",
                        column: x => x.AttributeId,
                        principalTable: "Attributes",
                        principalColumn: "AttributesId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserAttributes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Resources",
                columns: table => new
                {
                    ResourceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    ResourceName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    ResourceDescription = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    ResourceTypeId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Resources", x => x.ResourceId);
                    table.ForeignKey(
                        name: "FK_Resources_ResourceTypes_ResourceTypeId",
                        column: x => x.ResourceTypeId,
                        principalTable: "ResourceTypes",
                        principalColumn: "ResourceTypeId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Resources_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_ResourceTypeId",
                table: "Resources",
                column: "ResourceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Resources_UserId",
                table: "Resources",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAttributes_AttributeId",
                table: "UserAttributes",
                column: "AttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserAttributes_UserId",
                table: "UserAttributes",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Resources");

            migrationBuilder.DropTable(
                name: "UserAttributes");

            migrationBuilder.DropTable(
                name: "ResourceTypes");

            migrationBuilder.DropTable(
                name: "Attributes");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "longtext",
                nullable: false);

            migrationBuilder.CreateTable(
                name: "Tutorials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    ImageFile = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: true),
                    Title = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tutorials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tutorials_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Tutorials_UserId",
                table: "Tutorials",
                column: "UserId");
        }
    }
}
