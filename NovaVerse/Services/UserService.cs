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

        public async Task<User> Login(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == loginDto.Username && x.Password == loginDto.Password);
            if (user == null) return null;

            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role.ToString()),
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
    };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties();

            await _httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), authProperties);

            return user;  // Ritorna l'oggetto User
        }

        public async Task Logout()
        {

            //Termina la sessione dell'utente utilizzando i cookie di autenticazione.
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
