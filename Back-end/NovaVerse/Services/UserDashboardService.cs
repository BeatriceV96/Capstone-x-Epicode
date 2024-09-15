using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using NovaVerse.Models;
using System;

public class UserDashboardService : IUserDashboardService
{
    private readonly NovaVerseDbContext _context;

    public UserDashboardService(NovaVerseDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> GetUserById(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePicture = user.ProfilePicture,
            CreateDate = user.CreateDate
        };
    }

    public async Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        // Aggiorna i dati del profilo
        user.Username = userDto.Username;
        user.Email = userDto.Email;
        user.Bio = userDto.Bio;
        user.ProfilePicture = !string.IsNullOrEmpty(userDto.ProfilePicture)
            ? userDto.ProfilePicture
            : user.ProfilePicture;  // Se l'immagine è presente, aggiorna

        await _context.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePicture = user.ProfilePicture,
            CreateDate = user.CreateDate
        };
    }

    public async Task<bool> UpdateProfilePictureAsync(int userId, string profilePictureUrl)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return false;
        }

        user.ProfilePicture = profilePictureUrl;  // Aggiorna l'URL dell'immagine
        await _context.SaveChangesAsync();  // Salva le modifiche nel database

        return true;
    }


    public async Task<bool> AddFavoriteAsync(int userId, int artworkId)
    {
        var favorite = new Favorite
        {
            UserId = userId,
            ArtworkId = artworkId,
            CreateDate = DateTime.UtcNow
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveFavoriteAsync(int userId, int artworkId)
    {
        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ArtworkId == artworkId);

        if (favorite == null) return false;

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<List<UserActivityDto>> GetUserActivitiesAsync(int userId)
    {
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
}
