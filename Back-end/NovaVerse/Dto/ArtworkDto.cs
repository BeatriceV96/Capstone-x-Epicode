using NovaVerse.Models;

namespace NovaVerse.Dto
{
    public class ArtworkDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public ArtworkType Type { get; set; }
        public int ArtistId { get; set; }  // Aggiungi questo campo
    }
}
