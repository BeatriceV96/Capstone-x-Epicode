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
        [AllowAnonymous] // Permetti agli utenti non autenticati di visualizzare le categorie
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            if (categories == null || categories.Count == 0)
            {
                return NotFound(new { message = "Nessuna categoria trovata." });
            }
            return Ok(categories);
        }

        // Recupera una singola categoria per ID
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            Console.WriteLine($"Fetching category with ID: {id}");
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                Console.WriteLine($"Category with ID {id} not found.");
                return NotFound($"Category with ID {id} not found.");
            }
            return Ok(category);
        }



        // Crea una nuova categoria (Solo per artisti)
        [Authorize(Policy = "ArtistOnly")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryDto categoryDto)
        {
            if (categoryDto == null)
            {
                return BadRequest(new { message = "Dati della categoria non validi." });
            }

            var category = await _categoryService.AddCategoryAsync(categoryDto);
            if (category == null)
            {
                return BadRequest(new { message = "Creazione della categoria fallita." });
            }
            return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);  // Restituisce lo stato 201 e il percorso per la nuova risorsa
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
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result)
            {
                return BadRequest(new { message = "Eliminazione della categoria fallita." });
            }

            return Ok(new { message = "Categoria eliminata con successo." });
        }
    }
}
