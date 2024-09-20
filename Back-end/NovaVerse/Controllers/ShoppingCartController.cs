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
    public class ShoppingCartController : ControllerBase
    {
        private readonly IShoppingCartService _shoppingCartService;

        public ShoppingCartController(IShoppingCartService shoppingCartService)
        {
            _shoppingCartService = shoppingCartService;
        }

        [HttpGet]
        public async Task<IActionResult> GetShoppingCart()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var cart = await _shoppingCartService.GetShoppingCartByUserIdAsync(userId);
            if (cart == null)
            {
                return NotFound("Carrello non trovato.");
            }
            return Ok(cart);
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddItemToCart([FromBody] ShoppingCartItemDto itemDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var item = await _shoppingCartService.AddItemToCartAsync(userId, itemDto);
            return Ok(item);
        }

        [HttpPut("updateQuantity/{itemId}")]
        public async Task<IActionResult> UpdateCartItemQuantity(int itemId, [FromBody] ShoppingCartItemDto itemDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var success = await _shoppingCartService.UpdateItemQuantityAsync(userId, itemId, itemDto.Quantity);
            if (!success)
            {
                return NotFound(new { message = "Articolo non trovato o carrello non esistente." });
            }
            return Ok(new { message = "Quantità aggiornata con successo." });
        }


        [HttpDelete("remove/{itemId}")]
        public async Task<IActionResult> RemoveItemFromCart(int itemId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var success = await _shoppingCartService.RemoveItemFromCartAsync(userId, itemId);
            if (!success)
            {
                return NotFound(new { message = "Elemento non trovato nel carrello." });
            }
            return Ok(new { message = "Elemento rimosso dal carrello." });
        }


        [HttpPost("checkout")]
        public async Task<IActionResult> Checkout()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var success = await _shoppingCartService.CheckoutAsync(userId);
            if (!success)
            {
                return BadRequest("Errore durante il checkout.");
            }
            return Ok("Checkout completato con successo.");
        }
    }
}
