using NovaVerse.Interfaces;
using NovaVerse.Context;
using NovaVerse.Dto;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Models;

namespace NovaVerse.Services
{
    public class ArtworkService : IArtworkService
    {
        private readonly NovaVerseDbContext _context;

        public ArtworkService(NovaVerseDbContext context)
        {
            _context = context;
        }

        public async Task<List<Artwork>> GetAllArtworksAsync()
        {
            return await _context.Artworks
                .Include(a => a.Category)
                .Include(a => a.Artist)
                .ToListAsync();
        }

        public async Task<Artwork> GetArtworkByIdAsync(int id)
        {
            return await _context.Artworks
                .Include(a => a.Category)
                .Include(a => a.Artist)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Artwork>> GetArtworksByCategoryAsync(int categoryId)
        {
            return await _context.Artworks
                .Where(a => a.CategoryId == categoryId) // Filtra per la categoria
                .Include(a => a.Category)
                .Include(a => a.Artist)
                .ToListAsync();
        }


        public async Task<Artwork> AddArtworkAsync(ArtworkDto artworkDto)
        {
            var artwork = new Artwork
            {
                Title = artworkDto.Title,
                Description = artworkDto.Description,
                Price = artworkDto.Price,
                ImageUrl = artworkDto.ImageUrl,
                CategoryId = artworkDto.CategoryId,
                Type = artworkDto.Type,
                CreateDate = DateTime.Now,
            };

            _context.Artworks.Add(artwork);
            await _context.SaveChangesAsync();

            return artwork;
        }

        public async Task<Artwork> UpdateArtworkAsync(int id, ArtworkDto artworkDto)
        {
            var artwork = await _context.Artworks.FindAsync(id);
            if (artwork == null)
            {
                return null;
            }

            artwork.Title = artworkDto.Title;
            artwork.Description = artworkDto.Description;
            artwork.Price = artworkDto.Price;
            artwork.ImageUrl = artworkDto.ImageUrl;
            artwork.CategoryId = artworkDto.CategoryId;
            artwork.Type = artworkDto.Type;

            await _context.SaveChangesAsync();
            return artwork;
        }

        public async Task<bool> DeleteArtworkAsync(int id)
        {
            var artwork = await _context.Artworks.FindAsync(id);
            if (artwork == null)
            {
                return false;
            }

            _context.Artworks.Remove(artwork);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
