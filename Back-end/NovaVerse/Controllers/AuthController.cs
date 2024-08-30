using Microsoft.AspNetCore.Mvc;
using NovaVerse.Interfaces;
using NovaVerse.Dto;

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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userService.Login(loginDto);
            if (user == null)
            {
                return Unauthorized("Invalid username or password");  //se password o username sbagliati
            }

            return Ok(user);  // Ritorna l'oggetto User come risposta
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _userService.Logout();
            return Ok();
        }
    }
}
