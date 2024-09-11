using NovaVerse.Dto;

public interface IUserDashboardService
{
    Task<UserDto> GetUserById(int userId);
    Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId);
    Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId);
    Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto);
    Task<bool> UpdateProfilePictureAsync(int userId, string profilePictureBase64);
    Task<bool> AddFavoriteAsync(int userId, int artworkId);
    Task<bool> RemoveFavoriteAsync(int userId, int artworkId);
}
