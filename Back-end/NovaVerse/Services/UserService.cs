using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Context;
using NovaVerse.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;

namespace NovaVerse.Services
{
    public class UserService : IUserService
    {
        private readonly NovaVerseDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(NovaVerseDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<bool> Register(RegisterDto registerDto)
        {
            // Verifica se c'è un URL immagine fornito o se l'utente ha caricato un'immagine
            string profilePicturePath = registerDto.ProfilePictureUrl;

            if (!string.IsNullOrEmpty(registerDto.ProfilePicture))  // Controlla se è stato caricato un file
            {
                // Se il file è stato caricato, salva l'immagine e aggiorna il percorso
                profilePicturePath = "/uploads/" + registerDto.ProfilePicture;  // Esempio di percorso del server
            }

            var user = new User
            {
                Username = registerDto.Username,
                Password = registerDto.Password,
                Email = registerDto.Email,
                Bio = registerDto.Bio,
                Role = Enum.Parse<User.UserRole>(registerDto.Role),
                ProfilePicture = profilePicturePath,  // Salva il percorso o l'URL qui
                CreateDate = DateTime.UtcNow
            };

            _context.Users.Add(user);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }


        public async Task<UserDto> Login(LoginDto loginDto)
        {
            bool isEmail = loginDto.Username.Contains('@');
            var user = isEmail
                ? await _context.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Username && x.Password == loginDto.Password)
                : await _context.Users.FirstOrDefaultAsync(x => x.Username == loginDto.Username && x.Password == loginDto.Password);

            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString(),
                Bio = user.Bio,
                ProfilePicture = user.ProfilePicture,
                CreateDate = user.CreateDate
            };
        }

        public async Task<UserDto> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                ProfilePicture = user.ProfilePicture,
                CreateDate = user.CreateDate
            };
        }

        public async Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.Bio = userDto.Bio;
            user.ProfilePicture = !string.IsNullOrEmpty(userDto.ProfilePicture)
                                  ? userDto.ProfilePicture
                                  : user.ProfilePicture;  // Se la foto è presente, aggiorna

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                ProfilePicture = user.ProfilePicture,
                CreateDate = user.CreateDate
            };
        }

        public async Task<bool> UpdateProfilePictureAsync(int userId, string profilePictureBase64OrUrl)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            if (!string.IsNullOrEmpty(profilePictureBase64OrUrl))
            {
                user.ProfilePicture = profilePictureBase64OrUrl;  // Accetta sia URL che base64
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task Logout()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
