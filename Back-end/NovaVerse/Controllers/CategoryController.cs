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

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // Recupera tutte le categorie
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
        [AllowAnonymous] // Permetti agli utenti non autenticati di visualizzare una singola categoria
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound($"Category with ID {id} not found.");
            }
            return Ok(category);
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
                    return BadRequest(new { message = $"Eliminazione della categoria fallita. La categoria con ID {id} potrebbe essere collegata ad altre entità." });
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
