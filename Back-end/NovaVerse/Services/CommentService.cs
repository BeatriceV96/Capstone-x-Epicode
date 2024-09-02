using NovaVerse.Context;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using NovaVerse.Dto;
using Microsoft.EntityFrameworkCore;

namespace NovaVerse.Services
{
    public class CommentService : ICommentService
    {
        private readonly NovaVerseDbContext _context;

        public CommentService(NovaVerseDbContext context)
        {
            _context = context;
        }

        public async Task<List<Comment>> GetCommentsByArtworkAsync(int artworkId)
        {
            return await _context.Comments
                .Include(c => c.User)
                .Where(c => c.ArtworkId == artworkId)
                .ToListAsync();
        }

        public async Task<Comment> AddCommentAsync(CommentDto commentDto)
        {
            var comment = new Comment
            {
                UserId = commentDto.UserId,
                ArtworkId = commentDto.ArtworkId,
                CommentText = commentDto.CommentText,
                CreateDate = DateTime.Now
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            return comment;
        }

        public async Task<Comment> UpdateCommentAsync(int commentId, CommentDto commentDto)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null || comment.UserId != commentDto.UserId)
            {
                return null; // Il commento non esiste o l'utente non è autorizzato a modificarlo
            }

            comment.CommentText = commentDto.CommentText;
            await _context.SaveChangesAsync();

            return comment;
        }

        public async Task<bool> DeleteCommentAsync(int commentId, int userId)
        {
            var comment = await _context.Comments.FindAsync(commentId);
            if (comment == null || comment.UserId != userId)
            {
                return false; // Il commento non esiste o l'utente non è autorizzato a cancellarlo
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
