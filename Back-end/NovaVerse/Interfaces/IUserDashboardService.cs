using NovaVerse.Dto;
using NovaVerse.Models;

public interface IUserDashboardService
{
    Task<UserDto> GetUserById(int userId);
    Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId);
    Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId);
    Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto);
    Task<bool> UpdateProfilePictureAsync(int userId, byte[] profilePictureData);

    Task<bool> AddFavoriteAsync(int userId, int artworkId);
    Task<bool> RemoveFavoriteAsync(int userId, int artworkId); 
}
