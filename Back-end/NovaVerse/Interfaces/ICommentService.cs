using NovaVerse.Dto;
using NovaVerse.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface ICommentService
    {
        Task<List<Comment>> GetCommentsByArtworkAsync(int artworkId);
        Task<Comment> AddCommentAsync(CommentDto commentDto);
        Task<Comment> UpdateCommentAsync(int commentId, CommentDto commentDto);
        Task<bool> DeleteCommentAsync(int commentId, int userId);
    }
}
