using Microsoft.AspNetCore.Http;

namespace NovaVerse.Dto
{
    public class RegisterDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string ProfilePicture { get; set; } // Campo per l'immagine del profilo
        public string Bio { get; set; } // Campo per la bio
        public string Role { get; set; }
    }
}
