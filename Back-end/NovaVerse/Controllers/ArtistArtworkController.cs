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
    [Authorize(Policy = "ArtistOnly")]
    public class ArtistArtworkController : Controller
    {
        private readonly IArtworkService _artworkService;

        public ArtistArtworkController(IArtworkService artworkService)
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
                return NotFound("Opera non trovata.");
            }

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
            try
            {
                var artworks = await _artworkService.GetArtworksByCategoryAsync(categoryId);
                if (artworks == null || artworks.Count == 0)
                {
                    return NotFound("Nessuna opera trovata per questa categoria.");
                }
                return Ok(artworks);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Errore interno del server.");
            }
        }

        [Authorize(Policy = "ArtistOnly")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateArtwork([FromForm] ArtworkDto artworkDto)
        {
            // Verifica se l'immagine è presente
            if (artworkDto.Photo == null || artworkDto.Photo.Length == 0)
            {
                ModelState.AddModelError("Photo", "L'immagine dell'opera è richiesta");
                return BadRequest(ModelState);
            }

            byte[] imageBytes = null;

            // Se l'immagine è presente, copiala in un array di byte
            if (artworkDto.Photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await artworkDto.Photo.CopyToAsync(memoryStream);
                    imageBytes = memoryStream.ToArray();
                }
            }

            // Recupera l'ID dell'artista dall'utente autenticato
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            artworkDto.ArtistId = artistId;

            // Aggiungi l'artwork con l'immagine
            var artwork = await _artworkService.AddArtworkAsync(artworkDto, imageBytes);
            if (artwork == null)
            {
                return BadRequest("Creazione dell'opera fallita");
            }

            return Ok(artwork);
        }



        [Authorize(Policy = "ArtistOnly")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromForm] ArtworkDto artworkDto)
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
