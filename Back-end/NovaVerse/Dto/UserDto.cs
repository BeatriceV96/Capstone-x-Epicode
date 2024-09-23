using NovaVerse.Dto;

public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public string Bio { get; set; }
    public string ProfilePicture { get; set; }
    public DateTime CreateDate { get; set; }
    public List<ArtworkDto> Artworks { get; set; } = new List<ArtworkDto>();
}
