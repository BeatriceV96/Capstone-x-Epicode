using NovaVerse.Interfaces;
using System.Text;
using System.Security.Cryptography;

namespace NovaVerse.Services
{
    public class PasswordEncoder : IPasswordEncoder
    {
        public string Encode(string password)
        {
            using (var sha = SHA256.Create()) 
            {
                var asByteArray = Encoding.UTF8.GetBytes(password);
                var hashedPassword = sha.ComputeHash(asByteArray);
                return Convert.ToBase64String(hashedPassword);
            }
        }

        public bool IsSame(string plainText, string codeText)
        {
            return Encode(plainText) == codeText;
        }
    }

}
