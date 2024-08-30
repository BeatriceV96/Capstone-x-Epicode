using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaVerse.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFavoriteAndRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreatedDate",
                table: "Favorites",
                newName: "CreateDate");

            migrationBuilder.AlterColumn<int>(
                name: "ArtworkId",
                table: "Favorites",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "ArtistId",
                table: "Favorites",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Favorites_ArtistId",
                table: "Favorites",
                column: "ArtistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Favorites_Users_ArtistId",
                table: "Favorites",
                column: "ArtistId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Favorites_Users_ArtistId",
                table: "Favorites");

            migrationBuilder.DropIndex(
                name: "IX_Favorites_ArtistId",
                table: "Favorites");

            migrationBuilder.DropColumn(
                name: "ArtistId",
                table: "Favorites");

            migrationBuilder.RenameColumn(
                name: "CreateDate",
                table: "Favorites",
                newName: "CreatedDate");

            migrationBuilder.AlterColumn<int>(
                name: "ArtworkId",
                table: "Favorites",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }
    }
}
