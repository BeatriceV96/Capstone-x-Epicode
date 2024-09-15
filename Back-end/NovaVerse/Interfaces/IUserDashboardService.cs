using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserDashboardService
{
    Task<UserDto> GetUserById(int userId);
    Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto);
    Task<bool> UpdateProfilePictureAsync(int userId, string profilePictureBase64OrUrl);
    Task<bool> AddFavoriteAsync(int userId, int artworkId);
    Task<bool> RemoveFavoriteAsync(int userId, int artworkId);
    Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId);
    Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId);
}
