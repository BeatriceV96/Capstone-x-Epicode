using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaVerse.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCartItems_Artworks_ArtworkId",
                table: "ShoppingCartItems");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCartItems_Artworks_ArtworkId",
                table: "ShoppingCartItems",
                column: "ArtworkId",
                principalTable: "Artworks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShoppingCartItems_Artworks_ArtworkId",
                table: "ShoppingCartItems");

            migrationBuilder.AddForeignKey(
                name: "FK_ShoppingCartItems_Artworks_ArtworkId",
                table: "ShoppingCartItems",
                column: "ArtworkId",
                principalTable: "Artworks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
