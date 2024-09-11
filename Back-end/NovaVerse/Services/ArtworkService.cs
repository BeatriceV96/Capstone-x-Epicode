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
                .Where(a => a.CategoryId == categoryId)
                .Include(a => a.Artist) 
                .ToListAsync();
        }

        public async Task<Artwork> AddArtworkAsync(ArtworkDto artworkDto, byte[] imageBytes)
        {
            var artwork = new Artwork
            {
                Title = artworkDto.Title,
                Description = artworkDto.Description,
                Price = artworkDto.Price,
                Photo = imageBytes,
                CategoryId = artworkDto.CategoryId,
                Type = artworkDto.Type,
                ArtistId = artworkDto.ArtistId,
                CreateDate = DateTime.Now
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
            if (artworkDto.Photo != null)
            {
                using (var ms = new MemoryStream())
                {
                    await artworkDto.Photo.CopyToAsync(ms);
                    artwork.Photo = ms.ToArray();
                }
            }
            artwork.CategoryId = artworkDto.CategoryId;
            artwork.Type = artworkDto.Type;
            artwork.ArtistId = artworkDto.ArtistId;

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
