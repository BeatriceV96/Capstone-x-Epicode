using NovaVerse.Dto;

public interface IUserDashboardService
{
    Task<UserDto> GetUserById(int userId);  // Definisci questo metodo
    Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId);
    Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId);
    Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto);
}
