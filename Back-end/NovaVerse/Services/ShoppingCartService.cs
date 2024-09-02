using NovaVerse.Context;
using NovaVerse.Interfaces;
using NovaVerse.Models;
using NovaVerse.Dto;
using Microsoft.EntityFrameworkCore;

namespace NovaVerse.Services
{
    public class ShoppingCartService : IShoppingCartService
    {
        private readonly NovaVerseDbContext _context;

        public ShoppingCartService(NovaVerseDbContext context)
        {
            _context = context;
        }

        public async Task<ShoppingCartDto> GetShoppingCartByUserIdAsync(int userId)
        {
            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartItems)
                .ThenInclude(ci => ci.Artwork)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return null;
            }

            var cartDto = new ShoppingCartDto
            {
                Id = cart.Id,
                UserId = cart.UserId,
                CreateDate = cart.CreateDate,
                Items = cart.ShoppingCartItems.Select(ci => new ShoppingCartItemDto
                {
                    Id = ci.Id,
                    ArtworkId = ci.ArtworkId,
                    ArtworkTitle = ci.Artwork.Title,
                    PriceAtAddTime = ci.PriceAtAddTime,
                    Quantity = ci.Quantity
                }).ToList(),
                TotalCost = cart.ShoppingCartItems.Sum(ci => ci.PriceAtAddTime * ci.Quantity)
            };

            return cartDto;
        }

        public async Task<ShoppingCartItemDto> AddItemToCartAsync(int userId, ShoppingCartItemDto itemDto)
        {
            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new ShoppingCart
                {
                    UserId = userId,
                    CreateDate = DateTime.Now,
                    ShoppingCartItems = new List<ShoppingCartItem>()
                };
                _context.ShoppingCarts.Add(cart);
            }

            var existingItem = cart.ShoppingCartItems.FirstOrDefault(ci => ci.ArtworkId == itemDto.ArtworkId);
            if (existingItem != null)
            {
                existingItem.Quantity += itemDto.Quantity;
            }
            else
            {
                var artwork = await _context.Artworks.FindAsync(itemDto.ArtworkId);
                var newItem = new ShoppingCartItem
                {
                    ArtworkId = itemDto.ArtworkId,
                    PriceAtAddTime = artwork.Price,
                    Quantity = itemDto.Quantity
                };
                cart.ShoppingCartItems.Add(newItem);
            }

            await _context.SaveChangesAsync();
            return itemDto;
        }

        public async Task<bool> RemoveItemFromCartAsync(int userId, int itemId)
        {
            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                return false;
            }

            var item = cart.ShoppingCartItems.FirstOrDefault(ci => ci.Id == itemId);
            if (item == null)
            {
                return false;
            }

            cart.ShoppingCartItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckoutAsync(int userId)
        {
            var cart = await _context.ShoppingCarts
                .Include(c => c.ShoppingCartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.ShoppingCartItems.Any())
            {
                return false;
            }

            // Processare il pagamento (da implementare in base al gateway di pagamento scelto)
            // Creare una transazione per ogni articolo nel carrello

            _context.ShoppingCartItems.RemoveRange(cart.ShoppingCartItems);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
