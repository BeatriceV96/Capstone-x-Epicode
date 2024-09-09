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
    [Authorize]
    public class UserDashboardController : ControllerBase
    {
        private readonly IUserDashboardService _userDashboardService;

        public UserDashboardController(IUserDashboardService userDashboardService)
        {
            _userDashboardService = userDashboardService;
        }

        // Metodo per ottenere il profilo dell'utente
        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var user = await _userDashboardService.GetUserById(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user); // Restituisce il profilo utente con bio e data di creazione
        }


        // Metodo per ottenere le attività dell'utente
        [HttpGet("activities")]
        public async Task<IActionResult> GetUserActivities()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var activities = await _userDashboardService.GetUserActivitiesAsync(userId);
            return Ok(activities);
        }

        // Metodo per ottenere gli acquisti dell'utente
        [HttpGet("purchases")]
        public async Task<IActionResult> GetUserPurchases()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var purchases = await _userDashboardService.GetUserPurchasesAsync(userId);
            return Ok(purchases);
        }

        // Metodo per aggiornare il profilo dell'utente
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserDto userDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var updatedUser = await _userDashboardService.UpdateUserProfileAsync(userId, userDto);

            if (updatedUser == null)
            {
                return BadRequest("Failed to update profile.");
            }

            return Ok(updatedUser); // Restituisce il profilo aggiornato
        }
    }
}
