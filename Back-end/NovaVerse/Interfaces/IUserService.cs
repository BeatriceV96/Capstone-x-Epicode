using NovaVerse.Dto;
using NovaVerse.Models;

namespace NovaVerse.Interfaces
{
    public interface IUserService
    {
        Task<bool> Register(RegisterDto registerDto);
        Task<UserDto> Login(LoginDto loginDto);
        Task Logout();
        Task<UserDto> GetUserById(int userId);
    }
}
