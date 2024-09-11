using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NovaVerse.Dto;
using NovaVerse.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;

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

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            return claim != null ? int.Parse(claim.Value) : 0;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = GetUserId();
            var user = await _userDashboardService.GetUserById(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(user); // Restituisce il profilo utente
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UserDto userDto)
        {
            var userId = GetUserId();
            var updatedUser = await _userDashboardService.UpdateUserProfileAsync(userId, userDto);

            if (updatedUser == null)
            {
                return BadRequest("Failed to update profile.");
            }

            return Ok(updatedUser);
        }

        [HttpPut("update-profile-picture")]
        public async Task<IActionResult> UpdateProfilePicture([FromBody] string profilePicture)
        {
            var userId = GetUserId();

            if (string.IsNullOrEmpty(profilePicture))
            {
                return BadRequest("No profile picture provided.");
            }

            var success = await _userDashboardService.UpdateProfilePictureAsync(userId, profilePicture);

            if (!success)
            {
                return BadRequest("Failed to update profile picture.");
            }

            return Ok(new { Message = "Profile picture updated successfully." });
        }


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
