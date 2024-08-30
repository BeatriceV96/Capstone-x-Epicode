using NovaVerse.Context;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using NovaVerse.Dto;
using Microsoft.EntityFrameworkCore;

namespace NovaVerse.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly NovaVerseDbContext _context;

        public FavoriteService(NovaVerseDbContext context)
        {
            _context = context;
        }

        public async Task<List<Favorite>> GetUserFavoritesAsync(int userId)
        {
            return await _context.Favorites
                .Include(f => f.Artwork)
                .Include(f => f.Artist)
                .Where(f => f.UserId == userId)
                .ToListAsync();
        }

        public async Task<Favorite> AddFavoriteAsync(int userId, FavoriteDto favoriteDto)
        {
            if (favoriteDto.ArtworkId == null && favoriteDto.ArtistId == null)
            {
                return null;  
            }

            var favorite = new Favorite
            {
                UserId = userId,
                ArtworkId = favoriteDto.ArtworkId,
                ArtistId = favoriteDto.ArtistId,
                CreateDate = DateTime.Now
            };

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return favorite;
        }

        public async Task<bool> RemoveFavoriteAsync(int userId, int favoriteId)
        {
            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.Id == favoriteId);

            if (favorite == null)
            {
                return false;
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
