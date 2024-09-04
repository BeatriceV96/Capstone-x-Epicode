using Microsoft.AspNetCore.Mvc;
using NovaVerse.Interfaces;
using NovaVerse.Dto;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NovaVerse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        // Registrazione
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var result = await _userService.Register(registerDto);
            if (result)
            {
                return Ok();
            }
            return BadRequest("User registration failed.");
        }

        // Login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var userDto = await _userService.Login(loginDto);
            if (userDto == null)
            {
                return Unauthorized("Invalid username or password");
            }

            return Ok(userDto);  // Ritorna l'oggetto UserDto
        }

        // Logout
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.Logout();
            return Ok();
        }

        // Metodo per ottenere l'utente corrente autenticato
        [Authorize]  // Assicura che l'utente sia autenticato
        [HttpGet("currentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (User.Identity.IsAuthenticated)
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (userId != null)
                {
                    var user = await _userService.GetUserById(int.Parse(userId));
                    if (user != null)
                    {
                        return Ok(user);  // Ritorna i dettagli dell'utente autenticato
                    }
                }
            }

            return Unauthorized();
        }
    }
}
