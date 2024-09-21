using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using NovaVerse.Services;
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
        private readonly ICategoryService _categoryService;

        public ArtistArtworkController(IArtworkService artworkService, NovaVerseDbContext context, ICategoryService categoryService)
        {
            _artworkService = artworkService;
            _context = context;
            _categoryService = categoryService;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllArtworks()
        {
            var artworks = await _artworkService.GetAllArtworksAsync();
            return Ok(artworks);
        }

        [AllowAnonymous] // Consenti l'accesso a chiunque, incluso il Cliente
        [HttpGet("category/{categoryId}/artworks")]
        public async Task<IActionResult> GetArtworksByCategory(int categoryId)
        {
            var artworks = await _context.Artworks
                .Where(a => a.CategoryId == categoryId)
                .ToListAsync();

            return Ok(artworks);
        }


        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArtworkById(int id)
        {
            var artwork = await _artworkService.GetArtworkByIdAsync(id);
            if (artwork == null)
            {
                return NotFound(new { message = $"Artwork with ID {id} not found." });
            }

            // Includi il nome della categoria
            var category = await _categoryService.GetCategoryByIdAsync(artwork.CategoryId);
            var artworkDto = new ArtworkDto
            {
                Id = artwork.Id,
                Title = artwork.Title,
                Description = artwork.Description,
                Price = artwork.Price,
                Photo = artwork.Photo,
                ImageUrl = artwork.ImageUrl,
                CategoryId = artwork.CategoryId,
                CategoryName = category?.Name,
                ArtistName = artwork.ArtistName,
                ArtistId = artwork.ArtistId,
                CreateDate = artwork.CreateDate
            };

            return Ok(artworkDto);
        }



        [HttpPost("create")]
        public async Task<IActionResult> CreateArtwork([FromForm] ArtworkDto artworkDto, [FromForm] IFormFile? photoFile = null)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verifica il nome dell'artista
            if (string.IsNullOrWhiteSpace(artworkDto.ArtistName))
            {
                return BadRequest(new { errors = new { ArtistName = new[] { "The ArtistName field is required." } } });
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


            // Log per assicurarsi che l'ID dell'artista sia corretto
            Console.WriteLine("ArtistId assegnato: " + artistId);

            // Crea l'opera nel database
            var createdArtwork = await _artworkService.AddArtworkAsync(artworkDto);
            if (createdArtwork == null)
            {
                return BadRequest("Errore nella creazione dell'opera.");
            }

            return Ok(createdArtwork);
        }


        [HttpPut("update/{id}")]
        [Authorize(Policy = "ArtistOnly")]
        public async Task<IActionResult> UpdateArtwork(int id, [FromForm] ArtworkDto artworkDto, [FromForm] IFormFile? photoFile = null)
{
    // Log per vedere i dati ricevuti
    Console.WriteLine($"Title: {artworkDto.Title}, Description: {artworkDto.Description}, Price: {artworkDto.Price}, CategoryId: {artworkDto.CategoryId}");

    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
    var artwork = await _artworkService.GetArtworkByIdAsync(id);

    if (artwork == null)
    {
        return NotFound(new { message = $"Artwork with ID {id} not found." });
    }

    if (artwork.ArtistId != userId)
    {
        return Unauthorized("Non sei autorizzato a modificare questa opera.");
    }

            if (!ModelState.IsValid)
            {
                Console.WriteLine("ModelState non valido:");
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    Console.WriteLine(error.ErrorMessage);
                }
                return BadRequest(ModelState);
            }


            // Se viene fornita una nuova immagine, gestiamo il caricamento dell'immagine
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

        // Aggiorna il percorso dell'immagine nel DTO
        artworkDto.Photo = "/uploads/" + uniqueFileName;
    }

    // Aggiorniamo l'opera tramite il servizio
    var updatedArtwork = await _artworkService.UpdateArtworkAsync(id, artworkDto);
    if (updatedArtwork == null)
    {
        return BadRequest("Errore durante l'aggiornamento dell'opera.");
    }

    return Ok(updatedArtwork);
}



        [HttpDelete("delete/{id}")]
        [Authorize(Policy = "ArtistOnly")]
        public async Task<IActionResult> DeleteArtwork(int id)
        {
            // Recupera l'ID dell'utente autenticato
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // Recupera l'opera dal servizio
            var artwork = await _artworkService.GetArtworkByIdAsync(id);

            // Verifica se l'opera esiste e appartiene all'utente
            if (artwork == null)
            {
                return NotFound("Opera non trovata.");
            }

            if (artwork.ArtistId != userId)
            {
                return Unauthorized("Non sei autorizzato a eliminare questa opera.");
            }

            // Tenta di eliminare l'opera
            try
            {
                var success = await _artworkService.DeleteArtworkAsync(id);
                if (!success)
                {
                    return BadRequest("Non è stato possibile eliminare l'opera. Verifica che non ci siano dipendenze.");
                }
            }
            catch (DbUpdateException dbEx)
            {
                // Gestione specifica degli errori di vincolo referenziale
                return BadRequest($"Errore durante l'eliminazione: {dbEx.Message}. " +
                                  "Potrebbe essere presente una dipendenza (come articoli nel carrello) che impedisce l'eliminazione.");
            }
            catch (Exception ex)
            {
                // Gestione degli errori generici
                return StatusCode(500, $"Si è verificato un errore imprevisto: {ex.Message}");
            }

            // Se tutto va bene, ritorna il messaggio di successo
            return Ok("Opera eliminata con successo.");
        }


        [AllowAnonymous] // Per permettere l'accesso anche agli utenti non autenticati
        [HttpGet("random")]
        public async Task<IActionResult> GetRandomArtworks()
        {
            var artworks = await _artworkService.GetRandomArtworksAsync();
            if (artworks == null || !artworks.Any())
            {
                return NotFound("No artworks found.");
            }
            return Ok(artworks);
        }

    }
}
