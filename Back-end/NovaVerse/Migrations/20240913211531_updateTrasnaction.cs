using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NovaVerse.Migrations
{
    /// <inheritdoc />
    public partial class updateTrasnaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artworks_Transactions_TransactionId",
                table: "Artworks");

            migrationBuilder.DropIndex(
                name: "IX_Artworks_TransactionId",
                table: "Artworks");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_ArtworkId",
                table: "Transactions",
                column: "ArtworkId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Artworks_ArtworkId",
                table: "Transactions",
                column: "ArtworkId",
                principalTable: "Artworks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Artworks_ArtworkId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_ArtworkId",
                table: "Transactions");

            migrationBuilder.CreateIndex(
                name: "IX_Artworks_TransactionId",
                table: "Artworks",
                column: "TransactionId",
                unique: true,
                filter: "[TransactionId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Artworks_Transactions_TransactionId",
                table: "Artworks",
                column: "TransactionId",
                principalTable: "Transactions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
