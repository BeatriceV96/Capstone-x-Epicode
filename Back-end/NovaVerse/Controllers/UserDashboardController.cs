using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NovaVerse.Context;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NovaVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Consente l'accesso sia agli Artisti che ai Clienti
    public class UserDashboardController : ControllerBase
    {
        private readonly IUserDashboardService _userDashboardService;
        private readonly NovaVerseDbContext _context;

        public UserDashboardController(IUserDashboardService userDashboardService, NovaVerseDbContext context)
        {
            _userDashboardService = userDashboardService;
            _context = context;
        }

        [HttpGet("users/{id}")]
        public int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null && int.TryParse(claim.Value, out var userId) ? userId : 0;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userProfile = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Bio = user.Bio,
                ProfilePicture = user.ProfilePicture, 
                Role = user.Role.ToString(),
                CreateDate = user.CreateDate
            };

            return Ok(userProfile);
        }



        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserDto userDto)
        {
            if (!ModelState.IsValid)  // Verifica se il modello è valido
            {
                return BadRequest(ModelState);
            }

            var userId = GetUserId();
            var updatedUser = await _userDashboardService.UpdateUserProfileAsync(userId, userDto);

            if (updatedUser == null)
            {
                return BadRequest("Failed to update profile.");
            }

            return Ok(updatedUser);
        }

        [HttpPut("update-profile-picture")]
        public async Task<IActionResult> UpdateProfilePicture([FromForm] IFormFile profilePicture)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value); // Recupera l'ID dell'utente loggato
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found");
            }

            // Verifica che il file immagine sia presente
            if (profilePicture != null && profilePicture.Length > 0)
            {
                // Crea il percorso dove salvare l'immagine
                var uploadsFolder = Path.Combine("wwwroot/uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                // Genera un nome unico per il file immagine
                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(profilePicture.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Salva il file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilePicture.CopyToAsync(stream);
                }

                // Aggiorna l'URL del profilo immagine nel database
                user.ProfilePicture = "/uploads/" + uniqueFileName;

                // Salva le modifiche nel database
                await _context.SaveChangesAsync();

                return Ok(new { ProfilePicture = user.ProfilePicture });
            }
            else
            {
                return BadRequest("No image file provided");
            }
        }




        // Aggiungi un'opera ai preferiti
        [HttpPost("favorites/{artworkId}")]
        public async Task<IActionResult> AddFavorite(int artworkId)
        {
            var userId = GetUserId();
            var success = await _userDashboardService.AddFavoriteAsync(userId, artworkId);

            if (!success)
            {
                return BadRequest("Failed to add favorite.");
            }

            return Ok("Favorite added.");
        }

        // Rimuovi un'opera dai preferiti
        [HttpDelete("favorites/{artworkId}")]
        public async Task<IActionResult> RemoveFavorite(int artworkId)
        {
            var userId = GetUserId();
            var success = await _userDashboardService.RemoveFavoriteAsync(userId, artworkId);

            if (!success)
            {
                return BadRequest("Failed to remove favorite.");
            }

            return Ok("Favorite removed.");
        }
    }
}
