using NovaVerse.Interfaces;
using NovaVerse.Context;
using NovaVerse.Models;
using NovaVerse.Dto;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;

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
            byte[] profilePictureData = null;
            if (registerDto.ProfilePicture != null)
            {
                using (var ms = new MemoryStream())
                {
                    await registerDto.ProfilePicture.CopyToAsync(ms);
                    profilePictureData = ms.ToArray();
                }
            }

            var user = new User
            {
                Username = registerDto.Username,
                Password = registerDto.Password,
                Email = registerDto.Email,
                ProfilePicture = profilePictureData,
                Bio = registerDto.Bio,
                Role = Enum.Parse<User.UserRole>(registerDto.Role),
                CreateDate = DateTime.Now
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
            if (user == null)
            {
                return null;
            }

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
            if (user == null)
            {
                return null;
            }

            user.Username = userDto.Username;
            user.Email = userDto.Email;
            user.Bio = userDto.Bio;
            user.ProfilePicture = userDto.ProfilePicture;

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

        public async Task<bool> UpdateProfilePictureAsync(int userId, byte[] profilePictureData)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.ProfilePicture = profilePictureData;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task Logout()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
