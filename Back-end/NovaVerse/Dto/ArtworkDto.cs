using NovaVerse.Models;

namespace NovaVerse.Dto
{
    public class ArtworkDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string? Photo { get; set; }  // Percorso immagine o URL, opzionale
        public string? ImageUrl { get; set; }  // URL dell'immagine opzionale
        public string? CategoryName { get; set; } // Nome della categoria
        public int CategoryId { get; set; } // ID della categoria
        public ArtworkType Type { get; set; }
        public int ArtistId { get; set; }
        public string ArtistName { get; set; }
        public DateTime CreateDate { get; set; } // Data di creazione
    }
}
