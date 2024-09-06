using BCrypt.Net;
using NovaVerse.Interfaces;

namespace NovaVerse.Services
{
    public class PasswordHasher : IPasswordHasher
    {
        // Metodo per generare l'hash della password
        public string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        // Metodo per verificare la password rispetto all'hash
        public bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
