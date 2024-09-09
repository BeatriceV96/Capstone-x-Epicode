using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NovaVerse.Models;

namespace NovaVerse.Services
{
    public class ArtistDashboardService : IArtistDashboardService
    {
        private readonly NovaVerseDbContext _context;

        public ArtistDashboardService(NovaVerseDbContext context)
        {
            _context = context;
        }

        public async Task<List<ArtworkSummaryDto>> GetArtistArtworksAsync(int artistId)
        {
            var artworks = await _context.Artworks
                .Include(a => a.TransactionArtworks)
                .ThenInclude(ta => ta.Transaction)
                .Where(a => a.ArtistId == artistId)
                .Select(a => new ArtworkSummaryDto
                {
                    ArtworkId = a.Id,
                    Title = a.Title,
                    ViewCount = a.ViewCount,
                    SalesCount = a.TransactionArtworks.Count(),
                    TotalEarnings = a.TransactionArtworks.Sum(ta => ta.Transaction.Amount)
                })
                .ToListAsync();

            return artworks;
        }

        public async Task<List<SaleSummaryDto>> GetArtistSalesAsync(int artistId)
        {
            var sales = await _context.TransactionArtworks
                .Include(ta => ta.Transaction)
                .ThenInclude(t => t.Buyer)
                .Include(ta => ta.Artwork)
                .Where(ta => ta.Artwork.ArtistId == artistId)
                .Select(ta => new SaleSummaryDto
                {
                    ArtworkId = ta.ArtworkId,
                    ArtworkTitle = ta.Artwork.Title,
                    SaleDate = ta.Transaction.TransactionDate,
                    SalePrice = ta.Transaction.Amount
                })
                .ToListAsync();

            return sales;
        }

        public async Task<UserDto> GetUserById(int id)
        {
            var artist = await _context.Users.FindAsync(id);
            if (artist == null)
            {
                return null;
            }

            return new UserDto
            {
                Id = artist.Id,
                Username = artist.Username,
                Email = artist.Email,
                Bio = artist.Bio,  // Recupera la bio
                ProfilePictureUrl = artist.ProfilePictureUrl,  // Recupera l'URL del profilo
                CreateDate = artist.CreateDate  // Recupera la data di creazione
            };
        }

        public async Task<UserDto> UpdateArtistProfileAsync(UserDto userDto)
        {
            var artist = await _context.Users.FirstOrDefaultAsync(u => u.Id == userDto.Id);

            if (artist == null)
            {
                return null;
            }

            // Aggiorna i dettagli del profilo
            artist.Username = userDto.Username;
            artist.Email = userDto.Email;
            artist.Bio = userDto.Bio;  // Aggiungi eventuali altre proprietà, se necessario
            artist.ProfilePictureUrl = userDto.ProfilePictureUrl;

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = artist.Id,
                Username = artist.Username,
                Email = artist.Email,
                Role = artist.Role.ToString(),
                Bio = artist.Bio,
                ProfilePictureUrl = artist.ProfilePictureUrl,
                CreateDate = artist.CreateDate
            };
        }
    }
}
