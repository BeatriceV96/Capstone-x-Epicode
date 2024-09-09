using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ArtistDashboardService : IArtistDashboardService
{
    private readonly NovaVerseDbContext _context;

    public ArtistDashboardService(NovaVerseDbContext context)
    {
        _context = context;
    }

    public async Task<List<ArtworkSummaryDto>> GetArtistArtworksAsync(int artistId)
    {
        return await _context.Artworks
            .Include(a => a.TransactionArtworks)  // Assumendo che TransactionArtworks sia una collezione di vendite
            .Where(a => a.ArtistId == artistId)
            .Select(a => new ArtworkSummaryDto
            {
                ArtworkId = a.Id,
                Title = a.Title,
                ViewCount = a.ViewCount,   // Statistiche di visualizzazione
                SalesCount = a.TransactionArtworks.Count(), // Numero di vendite
                TotalEarnings = a.TransactionArtworks.Sum(ta => ta.Transaction.Amount) // Guadagni totali
            })
            .ToListAsync();
    }

    public async Task<List<SaleSummaryDto>> GetArtistSalesAsync(int artistId)
    {
        return await _context.TransactionArtworks
            .Include(ta => ta.Transaction)
            .Include(ta => ta.Artwork)
            .Where(ta => ta.Artwork.ArtistId == artistId)
            .GroupBy(ta => new
            {
                ta.ArtworkId,
                ta.Artwork.Title
            })
            .Select(g => new SaleSummaryDto
            {
                ArtworkId = g.Key.ArtworkId,
                ArtworkTitle = g.Key.Title,
                TotalSales = g.Sum(ta => ta.Transaction.Amount) // Totale delle vendite
            })
            .ToListAsync();
    }

    public async Task<UserDto> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return null;
        }

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePictureUrl = user.ProfilePictureUrl,
            CreateDate = user.CreateDate
        };
    }

    public async Task<UserDto> UpdateArtistProfileAsync(UserDto userDto)
    {
        var user = await _context.Users.FindAsync(userDto.Id);
        if (user == null)
        {
            return null;
        }

        user.Username = userDto.Username;
        user.Email = userDto.Email;
        user.Bio = userDto.Bio;
        user.ProfilePictureUrl = userDto.ProfilePictureUrl;  // Aggiungi questa riga se vuoi aggiornare anche l'immagine del profilo

        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePictureUrl = user.ProfilePictureUrl
        };
    }
}
