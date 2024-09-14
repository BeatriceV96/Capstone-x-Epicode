using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NovaVerse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "ArtistOnly")]
    public class ArtistArtworkController : Controller
    {
        private readonly IArtworkService _artworkService;
        private readonly NovaVerseDbContext _context;

        public ArtistArtworkController(IArtworkService artworkService, NovaVerseDbContext context)
        {
            _artworkService = artworkService;
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllArtworks()
        {
            var artworks = await _artworkService.GetAllArtworksAsync();
            return Ok(artworks);
        }

        [HttpGet("category/{categoryId}/artworks")]
        public async Task<IActionResult> GetArtworksByCategory(int categoryId)
        {
            var artworks = await _context.Artworks
                .Where(a => a.CategoryId == categoryId)
                .ToListAsync();

            return Ok(artworks);
        }

       [HttpGet("{id}")]
        public async Task<IActionResult> GetArtworkById(int id)
        {
            var artwork = await _artworkService.GetArtworkByIdAsync(id);
            if (artwork == null)
            {
                return NotFound(new { message = $"Artwork with ID {id} not found." });
            }

            return Ok(artwork);
        }


        [HttpPost("create")]
        public async Task<IActionResult> CreateArtwork([FromForm] ArtworkDto artworkDto, [FromForm] IFormFile? photoFile = null)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Gestisci il caricamento dell'immagine dal file
            if (photoFile != null && photoFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(photoFile.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await photoFile.CopyToAsync(fileStream);
                }

                artworkDto.Photo = "/uploads/" + uniqueFileName;
            }

            // Se viene fornito un URL, usa quello come foto
            if (!string.IsNullOrWhiteSpace(artworkDto.ImageUrl))
            {
                artworkDto.Photo = artworkDto.ImageUrl;
            }

            // Imposta l'ID dell'artista autenticato
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            artworkDto.ArtistId = artistId;

            // Crea l'opera nel database
            var createdArtwork = await _artworkService.AddArtworkAsync(artworkDto);
            if (createdArtwork == null)
            {
                return BadRequest("Errore nella creazione dell'opera.");
            }

            return Ok(createdArtwork);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromBody] ArtworkDto artworkDto)
        {
            if (artworkDto == null || id != artworkDto.Id)
            {
                return BadRequest(new { message = "Invalid artwork data." });
            }

            var updatedArtwork = await _artworkService.UpdateArtworkAsync(id, artworkDto);
            if (updatedArtwork == null)
            {
                return NotFound(new { message = $"Artwork with ID {id} not found." });
            }

            return Ok(updatedArtwork);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArtwork(int id)
        {
            var success = await _artworkService.DeleteArtworkAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Artwork with ID {id} not found." });
            }

            return NoContent();
        }
    }
}
