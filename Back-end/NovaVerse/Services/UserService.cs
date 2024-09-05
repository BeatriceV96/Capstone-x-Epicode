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
                ProfilePictureUrl = registerDto.ProfilePictureUrl,  
                Bio = registerDto.Bio,  
                Role = Enum.Parse<User.UserRole>(registerDto.Role),  //Parsing per enum
                CreateDate = DateTime.Now
            };

            _context.Users.Add(user);
            var result = await _context.SaveChangesAsync();
            return result > 0;
        }

        public async Task<UserDto> Login(LoginDto loginDto)
        {
            // Controlla se l'input è un'email o un nome utente
            bool isEmail = loginDto.Username.Contains('@');

            // Cerca l'utente per email o nome utente
            var user = isEmail
                ? await _context.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Username && x.Password == loginDto.Password)
                : await _context.Users.FirstOrDefaultAsync(x => x.Username == loginDto.Username && x.Password == loginDto.Password);

            if (user == null) return null;

            // Restituisci i dettagli dell'utente come UserDto
            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };

            return userDto;
        }

        public async Task<UserDto> GetUserById(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role.ToString()
            };

            return userDto;
        }

        public async Task Logout()
        {

            //Termina la sessione dell'utente utilizzando i cookie di autenticazione.
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
