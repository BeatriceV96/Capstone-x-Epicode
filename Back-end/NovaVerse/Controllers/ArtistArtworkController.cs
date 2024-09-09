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

        [HttpPost("create")]
        public async Task<IActionResult> CreateArtwork([FromBody] ArtworkDto artworkDto)
        {
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // Imposta l'ID dell'artista sull'opera che si sta creando
            artworkDto.ArtistId = artistId;

            var artwork = await _artworkService.AddArtworkAsync(artworkDto);
            if (artwork == null)
            {
                return BadRequest("Creazione dell'opera fallita.");
            }
            return Ok(artwork);
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromBody] ArtworkDto artworkDto)
        {
            var existingArtwork = await _artworkService.GetArtworkByIdAsync(id);
            if (existingArtwork == null)
            {
                return NotFound("Opera non trovata.");
            }

            // Verifica che l'artista loggato sia il proprietario dell'opera
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (existingArtwork.ArtistId != artistId)
            {
                return Unauthorized("Non puoi modificare questa opera.");
            }

            // Aggiorna l'opera
            var updatedArtwork = await _artworkService.UpdateArtworkAsync(id, artworkDto);
            if (updatedArtwork == null)
            {
                return BadRequest("Modifica dell'opera fallita.");
            }
            return Ok(updatedArtwork);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteArtwork(int id)
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
                return Unauthorized("Non puoi eliminare questa opera.");
            }

            var result = await _artworkService.DeleteArtworkAsync(id);
            if (!result)
            {
                return BadRequest("Eliminazione dell'opera fallita.");
            }
            return Ok("Opera eliminata con successo.");
        }
    }
}
