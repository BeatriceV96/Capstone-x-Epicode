using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Models;
using NovaVerse.Interfaces;
using NovaVerse.Services;
using System.Security.Claims;
using System.Threading.Tasks;
using static NovaVerse.Models.User;

namespace NovaVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Artist")]
    public class ArtistDashboardController : ControllerBase
    {
        private readonly IArtistDashboardService _artistDashboardService;
        private readonly NovaVerseDbContext _context;
        private readonly IUserService _userService;

        public ArtistDashboardController(IArtistDashboardService artistDashboardService, NovaVerseDbContext context, IUserService userService)
        {
            _artistDashboardService = artistDashboardService;
            _context = context;
            _userService = userService;
        }

        private int GetArtistId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        //NUOVO MESSO IL 22/09/2021
        [HttpGet("artist/{id}")]
        [AllowAnonymous]  // Permette l'accesso pubblico
        public async Task<IActionResult> GetArtistById(int id)
        {
            var artist = await _context.Users
                .Include(u => u.Artworks)
                .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Artist);

            if (artist == null)
            {
                Console.WriteLine($"Artista con ID {id} non trovato.");
                return NotFound();
            }

            Console.WriteLine($"Artista trovato: {artist.Username}, ID: {artist.Id}");
            return Ok(new UserDto
            {
                Id = artist.Id,
                Username = artist.Username,
                Bio = artist.Bio,
                ProfilePicture = artist.ProfilePicture,
                CreateDate = artist.CreateDate,
                Artworks = artist.Artworks.Select(a => new ArtworkDto
                {
                    Id = a.Id,
                    Title = a.Title,
                    Photo = a.Photo,
                    Price = a.Price
                }).ToList()
            });
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


        [AllowAnonymous]
        [HttpGet("search/{query}")]
        public async Task<IActionResult> SearchArtists(string query)
        {
            var artists = await _context.Users
                .Where(u => u.Role == UserRole.Artist && u.Username.Contains(query))
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Bio = u.Bio,
                    ProfilePicture = u.ProfilePicture,
                    CreateDate = u.CreateDate
                })
                .ToListAsync();

            if (artists == null || !artists.Any())
            {
                return NotFound("Nessun artista trovato.");
            }

            return Ok(artists);
        }

    }
}