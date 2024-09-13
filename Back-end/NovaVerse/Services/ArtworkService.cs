using NovaVerse.Interfaces;
using NovaVerse.Context;
using NovaVerse.Dto;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NovaVerse.Services
{
    public class ArtworkService : IArtworkService
    {
        private readonly NovaVerseDbContext _context;

        public ArtworkService(NovaVerseDbContext context)
        {
            _context = context;
        }

        // Restituisce tutte le opere come ArtworkDto
        public async Task<List<ArtworkDto>> GetAllArtworksAsync()
        {
            return await _context.Artworks
                .Include(a => a.Category)
                .Include(a => a.Artist)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Price = a.Price,
                    Photo = a.Photo,
                    CategoryId = a.CategoryId,
                    ArtistId = a.ArtistId
                })
                .ToListAsync();
        }

        // Restituisce un'opera specifica per ID come ArtworkDto
        public async Task<ArtworkDto> GetArtworkByIdAsync(int id)
        {
            var artwork = await _context.Artworks
                .Include(a => a.Category)
                .Include(a => a.Artist)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (artwork == null)
            {
                return null;
            }

            // Converte Artwork in ArtworkDto
            return new ArtworkDto
            {
                Id = artwork.Id,
                Title = artwork.Title,
                Description = artwork.Description,
                Price = artwork.Price,
                Photo = artwork.Photo,
                CategoryId = artwork.CategoryId,
                ArtistId = artwork.ArtistId
            };
        }

        // Restituisce tutte le opere di una categoria come ArtworkDto
        public async Task<List<ArtworkDto>> GetArtworksByCategoryAsync(int categoryId)
        {
            return await _context.Artworks
                .Where(a => a.CategoryId == categoryId)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Price = a.Price,
                    Photo = a.Photo,
                    CategoryId = a.CategoryId,
                    ArtistId = a.ArtistId
                })
                .ToListAsync();
        }

        // Crea una nuova opera a partire da ArtworkDto
        public async Task<ArtworkDto> AddArtworkAsync(ArtworkDto artworkDto)
        {
            var newArtwork = new Artwork
            {
                Title = artworkDto.Title,
                Description = artworkDto.Description,
                Price = artworkDto.Price,
                Photo = artworkDto.Photo,
                CategoryId = artworkDto.CategoryId,
                ArtistId = artworkDto.ArtistId,
                CreateDate = DateTime.UtcNow
            };

            _context.Artworks.Add(newArtwork);
            await _context.SaveChangesAsync();

            // Restituisce il nuovo Artwork come ArtworkDto
            return new ArtworkDto
            {
                Id = newArtwork.Id,
                Title = newArtwork.Title,
                Description = newArtwork.Description,
                Price = newArtwork.Price,
                Photo = newArtwork.Photo,
                CategoryId = newArtwork.CategoryId,
                ArtistId = newArtwork.ArtistId
            };
        }

        // Aggiorna un'opera esistente
        public async Task<ArtworkDto> UpdateArtworkAsync(int id, ArtworkDto artworkDto)
        {
            var artwork = await _context.Artworks.FindAsync(id);
            if (artwork == null)
            {
                return null;
            }

            artwork.Title = artworkDto.Title;
            artwork.Description = artworkDto.Description;
            artwork.Price = artworkDto.Price;

            if (!string.IsNullOrEmpty(artworkDto.Photo))
            {
                artwork.Photo = artworkDto.Photo;
            }

            artwork.CategoryId = artworkDto.CategoryId;
            artwork.ArtistId = artworkDto.ArtistId;

            await _context.SaveChangesAsync();

            return new ArtworkDto
            {
                Id = artwork.Id,
                Title = artwork.Title,
                Description = artwork.Description,
                Price = artwork.Price,
                Photo = artwork.Photo,
                CategoryId = artwork.CategoryId,
                ArtistId = artwork.ArtistId
            };
        }

        // Cancella un'opera
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