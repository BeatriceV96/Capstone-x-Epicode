namespace NovaVerse.Dto
{
    public class UserDto
    {
        public int Id { get; set; }          // L'ID dell'utente
        public string Username { get; set; } // Il nome utente
        public string Email { get; set; }    // L'email dell'utente
        public string Role { get; set; }    // Il ruolo dell'utente
    }
}
