using NovaVerse.Dto;
using NovaVerse.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IArtworkService
    {
        // Restituisce tutte le opere
        Task<List<Artwork>> GetAllArtworksAsync();

        // Restituisce una singola opera per ID
        Task<Artwork> GetArtworkByIdAsync(int id);

        // Restituisce tutte le opere per una categoria specifica
        Task<List<Artwork>> GetArtworksByCategoryAsync(int categoryId);

        // Aggiunge una nuova opera
        Task<Artwork> AddArtworkAsync(ArtworkDto artworkDto);

        // Aggiorna un'opera esistente
        Task<Artwork> UpdateArtworkAsync(int id, ArtworkDto artworkDto);

        // Cancella un'opera
        Task<bool> DeleteArtworkAsync(int id);
    }
}
