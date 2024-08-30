using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaVerse.Dto;
using NovaVerse.Interfaces;


namespace NovaVerse.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = Policies.Artist)]  //AUTORIZZO SOLO L'ARTISTA
    public class ArtistArtworkController : Controller
    {
        private readonly IArtworkService _artworkService;

            public ArtistArtworkController(IArtworkService artworkService) //Dependency Injection
        {
                _artworkService = artworkService;
            }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllArtworks()
        {
            var artworks = await _artworkService.GetAllArtworksAsync();
            return Ok(artworks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtwork(int id)
        {
            var artwork = await _artworkService.GetArtworkByIdAsync(id);
            if (artwork == null)
            {
                return NotFound();
            }
            return Ok(artwork);
        }

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

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromBody] ArtworkDto artworkDto)
        { 
            var artwork = await _artworkService.UpdateArtworkAsync(id, artworkDto);
            if (artwork == null)
            {
                return BadRequest("Failed to update artwork.");
            }
            return Ok(artwork);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteArtwork(int id)
        {
            var result = await _artworkService.DeleteArtworkAsync(id);
            if (!result)
            {
                return BadRequest("Failed to delete artwork.");
            }
            return Ok("Artwork deleted successfully.");
        }
    }
}
