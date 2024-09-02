using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NovaVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("artwork/{artworkId}")]
        public async Task<IActionResult> GetCommentsByArtwork(int artworkId)
        {
            var comments = await _commentService.GetCommentsByArtworkAsync(artworkId);
            return Ok(comments);
        }

        [HttpPost("add")]
        [Authorize] // Solo utenti autenticati possono aggiungere commenti
        public async Task<IActionResult> AddComment([FromBody] CommentDto commentDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            commentDto.UserId = userId;
            var comment = await _commentService.AddCommentAsync(commentDto);
            return Ok(comment);
        }

        [HttpPut("update/{commentId}")]
        [Authorize] // Solo l'autore del commento o un admin può modificarlo
        public async Task<IActionResult> UpdateComment(int commentId, [FromBody] CommentDto commentDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            commentDto.UserId = userId;
            var comment = await _commentService.UpdateCommentAsync(commentId, commentDto);
            if (comment == null)
            {
                return Unauthorized("Non sei autorizzato a modificare questo commento.");
            }
            return Ok(comment);
        }

        [HttpDelete("delete/{commentId}")]
        [Authorize] // Solo l'autore del commento o un admin può eliminarlo
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var success = await _commentService.DeleteCommentAsync(commentId, userId);
            if (!success)
            {
                return Unauthorized("Non sei autorizzato a eliminare questo commento.");
            }
            return Ok("Commento eliminato con successo.");
        }
    }
}
