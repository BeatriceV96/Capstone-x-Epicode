public class RegisterDto
{
    public string Username { get; set; }
    public string Password { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }
    public string Role { get; set; }

    // Campo per il percorso o l'URL dell'immagine caricata
    public string? ProfilePicture { get; set; }

    // Campo facoltativo per un URL immagine
    public string? ProfilePictureUrl { get; set; }
}
