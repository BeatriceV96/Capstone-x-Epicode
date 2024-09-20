using NovaVerse.Dto;
using NovaVerse.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IShoppingCartService
    {
        Task<ShoppingCartDto> GetShoppingCartByUserIdAsync(int userId); // Recupera il carrello per un determinato utente
        Task<ShoppingCartItemDto> AddItemToCartAsync(int userId, ShoppingCartItemDto itemDto); 
        Task<bool> RemoveItemFromCartAsync(int userId, int itemId);
        Task<bool> UpdateItemQuantityAsync(int userId, int itemId, int quantity);
        Task<bool> CheckoutAsync(int userId); // Processa il pagamento e completa la transazione
    }
}
