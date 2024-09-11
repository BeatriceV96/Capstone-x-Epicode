using Microsoft.AspNetCore.Http;

public class UserDto
{
    public int Id { get; set; }          // L'ID dell'utente
    public string Username { get; set; } // Il nome utente
    public string Email { get; set; }    // L'email dell'utente
    public string Role { get; set; }     // Il ruolo dell'utente
    public string Bio { get; set; }      // La biografia dell'utente
    public byte[] ProfilePicture { get; set; } 
    public DateTime CreateDate { get; set; } // Data di creazione
}
