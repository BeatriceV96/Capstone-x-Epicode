using NovaVerse.Dto;
using NovaVerse.Models;
using System.Threading.Tasks;

public interface IUserService
{

    Task<bool> Register(RegisterDto registerDto);

    Task<UserDto> Login(LoginDto loginDto);

    Task<UserDto> GetUserById(int id);
    Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto);

    Task<bool> UpdateProfilePictureAsync(int userId, string profilePictureBase64);

    Task<List<UserDto>> GetArtistsByQueryAsync(string query);

    Task Logout();
}
