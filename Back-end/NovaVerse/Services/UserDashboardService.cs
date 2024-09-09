using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class UserDashboardService : IUserDashboardService
{
    private readonly NovaVerseDbContext _context;

    public UserDashboardService(NovaVerseDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId)
    {
        // Implementazione per ottenere le attività dell'utente
        return await _context.Comments
            .Where(c => c.UserId == userId)
            .Select(c => new UserActivityDto
            {
                ActivityDate = c.CreateDate,
                ActivityDescription = $"Commentato su {c.Artwork.Title}"
            })
            .ToListAsync();
    }

    public async Task<List<PurchaseSummaryDto>> GetUserPurchasesAsync(int userId)
    {
        // Implementazione per ottenere gli acquisti dell'utente
        return await _context.Transactions
            .Where(t => t.BuyerId == userId)
            .Select(t => new PurchaseSummaryDto
            {
                ArtworkId = t.ArtworkId,
                ArtworkTitle = t.Artwork.Title,
                PurchaseDate = t.TransactionDate,
                PurchasePrice = t.Amount
            })
            .ToListAsync();
    }

    public async Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return null;
        }

        // Aggiorna i campi dell'utente
        user.Username = userDto.Username;
        user.Email = userDto.Email;
        user.Bio = userDto.Bio;  // Assicurati che Bio sia presente in UserDto

        // Salva le modifiche
        await _context.SaveChangesAsync();

        // Restituisci l'oggetto aggiornato
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio // Restituisci anche la bio aggiornata
        };
    }

}
