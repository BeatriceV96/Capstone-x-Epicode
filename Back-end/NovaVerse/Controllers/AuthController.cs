﻿using Microsoft.AspNetCore.Mvc;
using NovaVerse.Interfaces;
using NovaVerse.Dto;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;

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
        public async Task<IActionResult> Register([FromForm] RegisterDto registerDto, IFormFile profilePicture)
        {
            string profilePictureUrl = null;

            // Gestione upload file immagine
            if (profilePicture != null && profilePicture.Length > 0)
            {
                var fileName = Path.GetFileName(profilePicture.FileName);
                var filePath = Path.Combine("wwwroot/uploads", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await profilePicture.CopyToAsync(stream);
                }

                // Salva solo il percorso relativo
                profilePictureUrl = $"/uploads/{fileName}";
                Console.WriteLine("Profile Picture Path: " + profilePictureUrl); 
            }

            // Se non esiste un file, usa l'URL dell'immagine fornito
            if (!string.IsNullOrEmpty(registerDto.ProfilePictureUrl))
            {
                profilePictureUrl = registerDto.ProfilePictureUrl;
            }

            registerDto.ProfilePicture = profilePictureUrl;

            // Esegui la registrazione
            var result = await _userService.Register(registerDto);
            if (!result)
            {
                return BadRequest("Registrazione fallita.");
            }

            var user = await _userService.Login(new LoginDto { Username = registerDto.Username, Password = registerDto.Password });

            return Ok(user); 
        }





        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var user = await _userService.Login(loginDto);
            if (user == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var claims = new List<Claim>
{
    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
    new Claim(ClaimTypes.Name, user.Username),
    new Claim(ClaimTypes.Role, user.Role)
};


            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

            return Ok(new { user });
        }


        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }


        [Authorize]
        [HttpGet("currentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
            {
                var user = await _userService.GetUserById(int.Parse(userId));
                if (user != null)
                {
                    return Ok(user); 
                }
            }

            return Unauthorized();
        }
    }
}