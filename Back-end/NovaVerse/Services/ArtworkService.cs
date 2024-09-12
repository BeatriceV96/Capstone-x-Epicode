﻿using NovaVerse.Interfaces;
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

        public async Task<List<ArtworkDto>> GetArtworksByCategoryAsync(int categoryId)
        {
            var artworks = await _context.Artworks
                .Where(a => a.CategoryId == categoryId)
                .Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Description = a.Description,
                    Price = a.Price,
                    Photo = a.Photo,
     
                })
                .ToListAsync();

            return artworks;
        }
    


    public async Task<Artwork> AddArtworkAsync(ArtworkDto artworkDto)
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

            return newArtwork;
        }

        public async Task<Artwork> UpdateArtworkAsync(int id, ArtworkDto artworkDto)
        {
            var artwork = await _context.Artworks.FindAsync(id);
            if (artwork == null)
            {
                return null;
            }

            // Aggiorna le proprietà dell'opera
            artwork.Title = artworkDto.Title;
            artwork.Description = artworkDto.Description;
            artwork.Price = artworkDto.Price;

            // Aggiorna la foto solo se è stata fornita una nuova
            if (!string.IsNullOrEmpty(artworkDto.Photo))
            {
                artwork.Photo = artworkDto.Photo; 
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
