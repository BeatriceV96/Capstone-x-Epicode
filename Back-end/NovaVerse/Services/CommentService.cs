using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class CommentService : ICommentService
{
    private readonly NovaVerseDbContext _context;

    public CommentService(NovaVerseDbContext context)
    {
        _context = context;
    }

    // Restituisce i commenti per un'opera specifica
    public async Task<List<CommentDto>> GetCommentsByArtworkAsync(int artworkId)
    {
        var comments = await _context.Comments
            .Include(c => c.User)  // Include l'utente per ottenere il profilo
            .Where(c => c.ArtworkId == artworkId)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                UserId = c.UserId,
                Username = c.User.Username,
                ProfilePicture = c.User.ProfilePicture,  
                ArtworkId = c.ArtworkId,
                CommentText = c.CommentText,
                CreateDate = c.CreateDate
            })
            .ToListAsync();

        return comments;
    }



    // Restituisce un singolo commento per ID
    public async Task<CommentDto> GetCommentByIdAsync(int commentId)
    {
        var comment = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.Id == commentId)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                UserId = c.UserId,
                Username = c.User.Username,
                ArtworkId = c.ArtworkId,
                CommentText = c.CommentText,
                CreateDate = c.CreateDate
            })
            .FirstOrDefaultAsync();

        return comment;
    }

    // Aggiunge un nuovo commento
    public async Task<CommentDto> AddCommentAsync(CommentDto commentDto)
    {
        var comment = new Comment
        {
            UserId = commentDto.UserId,
            ArtworkId = commentDto.ArtworkId,
            CommentText = commentDto.CommentText,
            CreateDate = commentDto.CreateDate ?? DateTime.Now
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        // Mappa il commento creato al CommentDto
        return new CommentDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            ArtworkId = comment.ArtworkId,
            CommentText = comment.CommentText,
            CreateDate = comment.CreateDate,
            Username = (await _context.Users.FindAsync(comment.UserId))?.Username
        };
    }

    // Aggiorna un commento esistente
    public async Task<CommentDto> UpdateCommentAsync(int commentId, CommentDto commentDto)
    {
        var comment = await _context.Comments.FindAsync(commentId);
        if (comment == null || comment.UserId != commentDto.UserId)
        {
            return null;
        }

        comment.CommentText = commentDto.CommentText;
        await _context.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            UserId = comment.UserId,
            ArtworkId = comment.ArtworkId,
            CommentText = comment.CommentText,
            CreateDate = comment.CreateDate,
            Username = (await _context.Users.FindAsync(comment.UserId))?.Username
        };
    }

    // Cancella un commento
    public async Task<bool> DeleteCommentAsync(int commentId, int userId)
    {
        var comment = await _context.Comments.FindAsync(commentId);
        if (comment == null || comment.UserId != userId)
        {
            return false;
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return true;
    }
}
