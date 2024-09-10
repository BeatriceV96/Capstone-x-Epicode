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
    [Authorize(Policy = Policies.Artist)]  // Solo l'artista può accedere
    public class ArtistArtworkController : Controller
    {
        private readonly IArtworkService _artworkService;

        public ArtistArtworkController(IArtworkService artworkService) // Dependency Injection
        {
            _artworkService = artworkService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllArtworks()
        {
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var artworks = await _artworkService.GetAllArtworksAsync();
            return Ok(artworks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtwork(int id)
        {
            var artwork = await _artworkService.GetArtworkByIdAsync(id);
            if (artwork == null)
            {
                return NotFound("Opera non trovata.");
            }

            // Verifica che l'artista loggato sia il proprietario dell'opera
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (artwork.ArtistId != artistId)
            {
                return Unauthorized("Non puoi accedere a questa opera.");
            }

            return Ok(artwork);
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetArtworksByCategory(int categoryId)
        {
            var artworks = await _artworkService.GetArtworksByCategoryAsync(categoryId);
            if (artworks == null || artworks.Count == 0)
            {
                return NotFound("Nessuna opera trovata per questa categoria.");
            }
            return Ok(artworks);
        }


        [Authorize(Policy = "ArtistOnly")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateArtwork([FromBody] ArtworkDto artworkDto)
        {
            var artwork = await _artworkService.AddArtworkAsync(artworkDto);
            if (artwork == null)
            {
                return BadRequest("Failed to create artwork.");
            }
            return Ok(artwork);
        }

        [Authorize(Policy = "ArtistOnly")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromBody] ArtworkDto artworkDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var artwork = await _artworkService.GetArtworkByIdAsync(id);

            if (artwork.ArtistId != userId)
            {
                return Unauthorized("Non sei autorizzato a modificare questa opera.");
            }

            var updatedArtwork = await _artworkService.UpdateArtworkAsync(id, artworkDto);
            if (updatedArtwork == null)
            {
                return BadRequest("Failed to update artwork.");
            }

            return Ok(updatedArtwork);
        }

        [Authorize(Policy = "ArtistOnly")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteArtwork(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var artwork = await _artworkService.GetArtworkByIdAsync(id);

            if (artwork.ArtistId != userId)
            {
                return Unauthorized("Non sei autorizzato a eliminare questa opera.");
            }

            var success = await _artworkService.DeleteArtworkAsync(id);
            if (!success)
            {
                return BadRequest("Failed to delete artwork.");
            }

            return Ok("Artwork deleted successfully.");
        }
    }
}
