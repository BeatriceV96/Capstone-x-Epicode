using NovaVerse.Dto;
using NovaVerse.Models;

public interface IUserDashboardService
{
    Task<UserDto> GetUserById(int userId);
    Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId);
    Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId);
    Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto);
    Task<string> UpdateProfilePictureAsync(int userId, IFormFile profilePicture); // Nuovo metodo
    Task<bool> AddFavoriteAsync(int userId, int artworkId); // Nuovo metodo
    Task<bool> RemoveFavoriteAsync(int userId, int artworkId); // Nuovo metodo
}
