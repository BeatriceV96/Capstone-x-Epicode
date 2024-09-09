using NovaVerse.Interfaces;
using NovaVerse.Context;
using NovaVerse.Models;
using NovaVerse.Dto;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;

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
            var user = new User
            {
                Username = registerDto.Username,
                Password = registerDto.Password,
                Email = registerDto.Email,
                ProfilePictureUrl = registerDto.ProfilePictureUrl,  // Assicurati che questo campo sia mappato
                Bio = registerDto.Bio,  // Assicurati che questo campo sia mappato
                Role = Enum.Parse<User.UserRole>(registerDto.Role),
                CreateDate = DateTime.Now  // Imposta la data di creazione
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
                ProfilePictureUrl = user.ProfilePictureUrl,  
                CreateDate = user.CreateDate  
            };
        }


        public async Task<UserDto> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return null;
            }

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,  // Recupera la bio
                ProfilePictureUrl = user.ProfilePictureUrl,  // Recupera l'URL del profilo
                CreateDate = user.CreateDate  // Recupera la data di creazione
            };
        }


        public async Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return null;
            }

            // Aggiorna i campi modificabili
            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.Bio = userDto.Bio;  // Aggiorna la bio
            user.ProfilePictureUrl = userDto.ProfilePictureUrl;

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,  // Restituisci la bio aggiornata
                CreateDate = user.CreateDate
            };
        }


        public async Task Logout()
        {

            //Termina la sessione dell'utente utilizzando i cookie di autenticazione.
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}