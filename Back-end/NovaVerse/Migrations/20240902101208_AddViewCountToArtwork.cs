using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaVerse.Migrations
{
    /// <inheritdoc />
    public partial class AddViewCountToArtwork : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArtworkId1",
                table: "TransactionArtworks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ViewCount",
                table: "Artworks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_TransactionArtworks_ArtworkId1",
                table: "TransactionArtworks",
                column: "ArtworkId1");

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionArtworks_Artworks_ArtworkId1",
                table: "TransactionArtworks",
                column: "ArtworkId1",
                principalTable: "Artworks",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TransactionArtworks_Artworks_ArtworkId1",
                table: "TransactionArtworks");

            migrationBuilder.DropIndex(
                name: "IX_TransactionArtworks_ArtworkId1",
                table: "TransactionArtworks");

            migrationBuilder.DropColumn(
                name: "ArtworkId1",
                table: "TransactionArtworks");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "Artworks");
        }
    }
}
