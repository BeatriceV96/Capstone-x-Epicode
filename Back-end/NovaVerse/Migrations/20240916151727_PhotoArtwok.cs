using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaVerse.Migrations
{
    /// <inheritdoc />
    public partial class PhotoArtwok : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Artworks",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Artworks");
        }
    }
}
