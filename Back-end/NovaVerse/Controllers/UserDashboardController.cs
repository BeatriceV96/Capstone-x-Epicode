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
    }
}
