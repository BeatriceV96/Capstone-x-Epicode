using NovaVerse.Models;

public class ArtworkDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string? Photo { get; set; }  // Percorso immagine o URL, opzionale
    public string? ImageUrl { get; set; }  // URL dell'immagine opzionale
    public int CategoryId { get; set; }
    public ArtworkType Type { get; set; }
    public int ArtistId { get; set; }
}
