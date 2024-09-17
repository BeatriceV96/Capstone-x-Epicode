using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using System.Security.Claims;

namespace NovaVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Solo gli utenti autenticati possono gestire i favoriti
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet("myfavorites")]
        public async Task<IActionResult> GetUserFavorites()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var favorites = await _favoriteService.GetUserFavoritesAsync(userId);
            Console.WriteLine(favorites); // Aggiungi questo per vedere il contenuto su console
            return Ok(favorites);
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddFavorite([FromBody] FavoriteDto favoriteDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var favorite = await _favoriteService.AddFavoriteAsync(userId, favoriteDto);
            if (favorite == null)
            {
                return BadRequest("Failed to add favorite. Please specify either ArtworkId or ArtistId.");
            }
            return Ok(favorite);
        }

        [HttpDelete("remove/{favoriteId}")]
        public async Task<IActionResult> RemoveFavorite(int favoriteId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _favoriteService.RemoveFavoriteAsync(userId, favoriteId);
            if (!result)
            {
                return BadRequest("Failed to remove favorite.");
            }
            return Ok("Favorite removed successfully.");
        }
    }
}
