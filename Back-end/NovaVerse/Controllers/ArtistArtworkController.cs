using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
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

        [HttpGet("category/{categoryId}/artworks")]
        public async Task<IActionResult> GetArtworksByCategory(int categoryId)
        {
            try
            {
                var artworks = await _artworkService.GetArtworksByCategoryAsync(categoryId);
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
        public async Task<IActionResult> CreateArtwork([FromForm] ArtworkDto artworkDto, [FromForm] IFormFile? photoFile = null)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Se l'utente carica un file immagine
            if (photoFile != null && photoFile.Length > 0)
            {
                // Gestione dell'immagine caricata come file
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + photoFile.FileName;
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photoFile.CopyToAsync(fileStream);
                }

                artworkDto.Photo = "/uploads/" + uniqueFileName; // Salva il percorso relativo
            }
            // Caso in cui nessuna immagine venga fornita (opzionale)
            else
            {
                artworkDto.Photo = null; // Non viene fornita alcuna immagine
            }

            // Imposta l'ID dell'artista dall'utente autenticato
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            artworkDto.ArtistId = artistId;

            // Debug: log dei dati ricevuti nel DTO per verificare
            Console.WriteLine($"Title: {artworkDto.Title}, Description: {artworkDto.Description}, Price: {artworkDto.Price}, CategoryId: {artworkDto.CategoryId}, ArtistId: {artworkDto.ArtistId}, Photo: {artworkDto.Photo}");

            // Crea l'opera tramite il servizio
            var createdArtwork = await _artworkService.AddArtworkAsync(artworkDto);
            if (createdArtwork == null)
            {
                return BadRequest("Errore nella creazione dell'opera.");
            }

            return Ok(createdArtwork);
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