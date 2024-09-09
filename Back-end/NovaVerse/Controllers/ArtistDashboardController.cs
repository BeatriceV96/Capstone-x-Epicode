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
    [Authorize(Roles = "Artist")] // Solo gli artisti possono accedere
    public class ArtistDashboardController : ControllerBase
    {
        private readonly IArtistDashboardService _artistDashboardService;

        public ArtistDashboardController(IArtistDashboardService artistDashboardService)
        {
            _artistDashboardService = artistDashboardService;
        }

        [HttpGet("artworks")]
        public async Task<IActionResult> GetArtistArtworks()
        {
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var artworks = await _artistDashboardService.GetArtistArtworksAsync(artistId);
            return Ok(artworks);
        }

        [HttpGet("sales")]
        public async Task<IActionResult> GetArtistSales()
        {
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var sales = await _artistDashboardService.GetArtistSalesAsync(artistId);
            return Ok(sales);
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateArtistProfile([FromBody] UserDto userDto)
        {
            var artistId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // Assicurati che l'artista stia aggiornando il proprio profilo
            if (artistId != userDto.Id)
            {
                return BadRequest("Non puoi modificare un profilo che non è il tuo.");
            }

            // Chiama il metodo specifico per aggiornare i profili degli artisti
            var updatedArtist = await _artistDashboardService.UpdateArtistProfileAsync(userDto);

            if (updatedArtist == null)
            {
                return BadRequest("Errore durante l'aggiornamento del profilo.");
            }

            return Ok(updatedArtist);
        }

    }
}
