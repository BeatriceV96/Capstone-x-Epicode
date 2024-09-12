using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using System.Threading.Tasks;

namespace NovaVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "ArtistOnly")] // Solo gli artisti possono creare, aggiornare e eliminare
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly IArtworkService _artworkService;

        public CategoryController(ICategoryService categoryService, IArtworkService artworkService)
        {
            _categoryService = categoryService;
            _artworkService = artworkService; 
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            if (categories == null || categories.Count == 0)
            {
                return NoContent(); // Cambia da NotFound a NoContent
            }

            return Ok(categories.ToArray());
        }

        // Recupera una singola categoria per ID
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound($"Category with ID {id} not found.");
            }
            return Ok(category);
        }

        // Nuovo endpoint per ottenere le opere associate a una categoria
       
        [HttpGet("{id}/artworks")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoryWithArtworks(int id)
        {
            var artworks = await _artworkService.GetArtworksByCategoryAsync(id);
            if (artworks == null || artworks.Count == 0)
            {
                return NotFound("No artworks found for this category.");
            }
            return Ok(artworks);
        }

        [HttpGet("{categoryId}/artworks")]
        [AllowAnonymous] // Permetti agli utenti non autenticati di vedere le opere associate
        public async Task<IActionResult> GetArtworksByCategory(int categoryId)
        {
            var artworks = await _artworkService.GetArtworksByCategoryAsync(categoryId);
            if (artworks == null || artworks.Count == 0)
            {
                return NoContent(); // Se non ci sono opere, restituisce 204
            }
            return Ok(artworks); // Restituisce la lista delle opere
        }


        // Crea una nuova categoria (Solo per artisti)
        [Authorize(Policy = "ArtistOnly")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); // Restituisci gli errori di validazione
            }

            var category = await _categoryService.AddCategoryAsync(categoryDto);
            if (category == null)
            {
                return BadRequest(new { message = "Creazione della categoria fallita." });
            }
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
        }

        // Aggiorna una categoria esistente (Solo per artisti)
        [Authorize(Policy = "ArtistOnly")]
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryDto categoryDto)
        {
            var category = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            if (category == null)
            {
                return BadRequest(new { message = "Aggiornamento della categoria fallito." });
            }
            return Ok(category); // Restituisce la categoria aggiornata
        }

        // Elimina una categoria (Solo per artisti)
        [Authorize(Policy = "ArtistOnly")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound(new { message = $"Categoria con ID {id} non trovata." });
            }

            try
            {
                var result = await _categoryService.DeleteCategoryAsync(id);
                if (!result)
                {
                    return BadRequest(new { message = "Eliminazione della categoria fallita. Potrebbe esserci un collegamento con altre entità." });
                }

                return Ok(new { message = "Categoria eliminata con successo." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Errore del server durante l'eliminazione.", error = ex.Message });
            }
        }


    }
}
