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
    [Authorize(Roles = "Artist")]
    public class ArtistDashboardController : ControllerBase
    {
        private readonly IArtistDashboardService _artistDashboardService;

        public ArtistDashboardController(IArtistDashboardService artistDashboardService)
        {
            _artistDashboardService = artistDashboardService;
        }

        private int GetArtistId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        [HttpGet("artworks")]
        public async Task<IActionResult> GetArtistArtworks()
        {
            var artistId = GetArtistId();
            var artworks = await _artistDashboardService.GetArtistArtworksAsync(artistId);
            return Ok(artworks);
        }

        [HttpGet("sales")]
        public async Task<IActionResult> GetArtistSales()
        {
            var artistId = GetArtistId();
            var sales = await _artistDashboardService.GetArtistSalesAsync(artistId);
            return Ok(sales);
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateArtistProfile([FromBody] UserDto userDto)
        {
            var artistId = GetArtistId();

            if (artistId != userDto.Id)
            {
                return BadRequest("Non puoi modificare un profilo che non è il tuo.");
            }

            var updatedArtist = await _artistDashboardService.UpdateArtistProfileAsync(userDto);

            if (updatedArtist == null)
            {
                return BadRequest("Errore durante l'aggiornamento del profilo.");
            }

            return Ok(updatedArtist);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetArtistProfile()
        {
            var artistId = GetArtistId();
            var artist = await _artistDashboardService.GetUserById(artistId);

            if (artist == null)
            {
                return NotFound("Artist not found.");
            }

            return Ok(artist); // Restituisce il profilo artista con bio e data di creazione
        }
    }
}
