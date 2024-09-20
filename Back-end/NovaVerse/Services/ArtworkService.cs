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
                .Include(a => a.Category) // Assicurati di includere la categoria
                .Include(a => a.Artist)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Price = a.Price,
                    Photo = a.Photo,
                    ImageUrl = a.ImageUrl,
                    CategoryName = a.Category.Name, // Recupera il nome della categoria
                    Type = a.Type,
                    ArtistId = a.ArtistId,
                    ArtistName = a.Artist.Username,
                    CreateDate = a.CreateDate // Recupera la data di creazione
                })
                .ToListAsync();
        }

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

            return new ArtworkDto
            {
                Id = artwork.Id,
                Title = artwork.Title,
                Description = artwork.Description,
                Price = artwork.Price,
                Photo = artwork.Photo,
                ImageUrl = artwork.ImageUrl,
                CategoryName = artwork.Category.Name,
                Type = artwork.Type,
                ArtistId = artwork.ArtistId,
                ArtistName = artwork.Artist.Username,
                CreateDate = artwork.CreateDate
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
                Photo = artworkDto.Photo,  // Il percorso relativo dell'immagine
                CategoryId = artworkDto.CategoryId,
                Type = artworkDto.Type,
                ArtistId = artworkDto.ArtistId,
                CreateDate = DateTime.UtcNow // Assicurati di impostare la data di creazione correttamente
            };

            _context.Artworks.Add(newArtwork);
            await _context.SaveChangesAsync();

            return new ArtworkDto
            {
                Id = newArtwork.Id,
                Title = newArtwork.Title,
                Description = newArtwork.Description,
                Price = newArtwork.Price,
                Photo = newArtwork.Photo,
                CategoryId = newArtwork.CategoryId,
                Type = newArtwork.Type,
                ArtistId = newArtwork.ArtistId,
                CreateDate = newArtwork.CreateDate // Passa la data di creazione correttamente
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
                ArtistId = artwork.ArtistId,
                ArtistName = artwork.Artist.Username
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

        public async Task<List<ArtworkDto>> GetRandomArtworksAsync()
        {
            var randomArtworks = await _context.Artworks
                .OrderBy(r => Guid.NewGuid()) // Ordina casualmente
                .Take(4) // Prendi un numero casuale di opere, ad esempio 5
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Price = a.Price,
                    Photo = a.Photo,
                    ArtistId = a.ArtistId,
                    ArtistName = a.Artist.Username
                })
                .ToListAsync();

            return randomArtworks;
        }
    }
}
