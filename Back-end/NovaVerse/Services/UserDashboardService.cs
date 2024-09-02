using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace NovaVerse.Services
{
    public class UserDashboardService : IUserDashboardService
    {
        private readonly NovaVerseDbContext _context;

        public UserDashboardService(NovaVerseDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId)
        {
            // Esempio semplice di attività basate sui commenti
            return await _context.Comments
                .Where(c => c.UserId == userId)
                .Select(c => new UserActivityDto
                {
                    ActivityDate = c.CreateDate,
                    ActivityDescription = $"Commentato su {c.Artwork.Title}"
                }).ToListAsync();
        }

        public async Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId)
        {
            return await _context.Transactions
                .Where(t => t.BuyerId == userId)
                .Select(t => new PurchaseSummaryDto
                {
                    ArtworkId = t.ArtworkId,
                    ArtworkTitle = t.Artwork.Title,
                    PurchaseDate = t.TransactionDate,
                    PurchasePrice = t.Amount
                }).ToListAsync();
        }
    }
}
