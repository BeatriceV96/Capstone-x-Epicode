using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using NovaVerse.Models;
using Microsoft.AspNetCore.Http;
using System.IO;

public class UserDashboardService : IUserDashboardService
{
    private readonly NovaVerseDbContext _context;

    public UserDashboardService(NovaVerseDbContext context)
    {
        _context = context;
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

    public async Task<UserDto> GetUserById(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
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

    public async Task<UserDto> UpdateUserProfileAsync(int userId, UserDto userDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return null;
        }

        user.Username = userDto.Username;
        user.Email = userDto.Email;
        user.Bio = userDto.Bio;

        await _context.SaveChangesAsync();

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

    public async Task<string> UpdateProfilePictureAsync(int userId, IFormFile profilePicture)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return null;
        }

        // Logica per gestire il caricamento del file
        var pictureUrl = await SaveProfilePictureAsync(profilePicture);
        user.ProfilePictureUrl = pictureUrl;

        await _context.SaveChangesAsync();

        return pictureUrl;
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

        if (favorite == null)
        {
            return false;
        }

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();

        return true;
    }

    private async Task<string> SaveProfilePictureAsync(IFormFile profilePicture)
    {
        if (profilePicture == null || profilePicture.Length == 0)
        {
            return null;
        }

        // Percorso per salvare l'immagine del profilo (puoi modificarlo a seconda delle tue necessità)
        var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        var fileName = Path.GetFileName(profilePicture.FileName);
        var filePath = Path.Combine(uploadPath, fileName);

        // Salva l'immagine sul disco
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await profilePicture.CopyToAsync(fileStream);
        }

        // Restituisci l'URL dell'immagine
        var pictureUrl = $"/images/{fileName}";
        return pictureUrl;
    }
}
