using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using System.Collections.Generic;
using System.Linq;
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
                .Include(a => a.TransactionArtworks) // Include la collezione di TransactionArtworks
                .ThenInclude(ta => ta.Transaction) // Include le transazioni associate
                .Where(a => a.ArtistId == artistId)
                .Select(a => new ArtworkSummaryDto
                {
                    ArtworkId = a.Id,
                    Title = a.Title,
                    ViewCount = a.ViewCount, // Conteggio delle visualizzazioni dell'opera
                    SalesCount = a.TransactionArtworks.Count(), // Conteggio delle vendite
                    TotalEarnings = a.TransactionArtworks.Sum(ta => ta.Transaction.Amount) // Somma dei guadagni totali
                })
                .ToListAsync();

            return artworks;
        }

        public async Task<List<SaleSummaryDto>> GetArtistSalesAsync(int artistId)
        {
            var sales = await _context.TransactionArtworks
                .Include(ta => ta.Transaction) // Include la transazione associata
                .ThenInclude(t => t.Buyer) // Include la relazione con l'acquirente
                .Include(ta => ta.Artwork) // Include l'opera d'arte associata
                .Where(ta => ta.Artwork.ArtistId == artistId)
                .Select(ta => new SaleSummaryDto
                {
                    ArtworkId = ta.ArtworkId, // ID dell'opera d'arte
                    ArtworkTitle = ta.Artwork.Title, // Titolo dell'opera d'arte
                    SaleDate = ta.Transaction.TransactionDate, // Data della transazione
                    SalePrice = ta.Transaction.Amount // Importo della transazione
                })
                .ToListAsync();

            return sales;
        }


    }
}
