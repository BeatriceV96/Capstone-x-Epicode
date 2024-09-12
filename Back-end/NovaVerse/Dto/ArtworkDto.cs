using NovaVerse.Models;

public class ArtworkDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string? Photo { get; set; } // Qui puoi gestire sia URL che base64
    public int CategoryId { get; set; }
    public ArtworkType Type { get; set; }
    public int ArtistId { get; set; }
}
