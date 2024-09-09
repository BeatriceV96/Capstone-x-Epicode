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

        [HttpGet("activities")]
        public async Task<IActionResult> GetUserActivities()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var activities = await _userDashboardService.GetUserActivitiesAsync(userId);
            return Ok(activities);
        }

        [HttpGet("purchases")]
        public async Task<IActionResult> GetUserPurchases()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var purchases = await _userDashboardService.GetUserPurchasesAsync(userId);
            return Ok(purchases);
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserDto userDto)
        {
            // Ottieni l'ID dell'utente dal token di autenticazione
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            // Passa l'ID dell'utente e il DTO al servizio
            var result = await _userDashboardService.UpdateUserProfileAsync(userId, userDto);

            if (result == null)
            {
                return BadRequest("Failed to update user profile.");
            }

            return Ok(result);
        }

    }
}
