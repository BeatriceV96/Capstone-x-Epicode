namespace NovaVerse.Dto
{
    public class ShoppingCartItemDto
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; } // Collegamento all'opera d'arte
        public string ArtworkTitle { get; set; }
        public decimal PriceAtAddTime { get; set; } // Prezzo dell'opera al momento dell'aggiunta
        public int Quantity { get; set; }
        public string? ArtworkPhoto { get; set; }
        public string? ArtworkImageUrl { get; set; } // Opzione per un URL remoto
    }
}
