using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IUserDashboardService
    {
        Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId);
        Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId);
    }
}
