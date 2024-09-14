using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface ICommentService
    {
        Task<List<CommentDto>> GetCommentsByArtworkAsync(int artworkId);  // Restituisce una lista di CommentDto
        Task<CommentDto> GetCommentByIdAsync(int commentId);  // Restituisce un singolo CommentDto
        Task<CommentDto> AddCommentAsync(CommentDto commentDto);  // Aggiunge e restituisce un CommentDto
        Task<CommentDto> UpdateCommentAsync(int commentId, CommentDto commentDto);  // Aggiorna e restituisce un CommentDto
        Task<bool> DeleteCommentAsync(int commentId, int userId);  // Cancella un commento
    }
}
