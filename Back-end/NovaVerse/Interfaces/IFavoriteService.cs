using NovaVerse.Models;
using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IFavoriteService
    {
        Task<List<Favorite>> GetUserFavoritesAsync(int userId);  // Recupera la lista dei favoriti di un utente
        Task<Favorite> AddFavoriteAsync(int userId, FavoriteDto favoriteDto);  // Aggiungi un nuovo preferito (opera d'arte o artista)
        Task<bool> RemoveFavoriteAsync(int userId, int favoriteId);  // Rimuove un preferito dall'elenco dell'utente
    }
}
