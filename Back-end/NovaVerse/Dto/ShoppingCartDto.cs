namespace NovaVerse.Dto
{
    public class ShoppingCartDto
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Collegamento all'utente proprietario del carrello
        public DateTime CreateDate { get; set; }
        public List<ShoppingCartItemDto> Items { get; set; } // Lista degli articoli nel carrello
        public decimal TotalCost { get; set; } // Costo totale del carrello
    }
}
