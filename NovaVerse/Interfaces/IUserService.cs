using NovaVerse.Dto;
using NovaVerse.Models;

namespace NovaVerse.Interfaces
{
    public interface IUserService
    {
        Task<bool> Register(RegisterDto registerDto);
        Task<User> Login(LoginDto loginDto);
        Task Logout();
    }
}
