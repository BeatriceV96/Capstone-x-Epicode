using NovaVerse.Dto;
using NovaVerse.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IArtworkService
    {
        // Restituisce tutte le opere
        Task<List<ArtworkDto>> GetAllArtworksAsync();

        // Restituisce una singola opera per ID
        Task<ArtworkDto> GetArtworkByIdAsync(int id);

        // Restituisce tutte le opere per una categoria specifica
        Task<List<ArtworkDto>> GetArtworksByCategoryAsync(int categoryId);

        // Crea una nuova opera
        Task<ArtworkDto> AddArtworkAsync(ArtworkDto artworkDto);

        // Aggiorna un'opera esistente
        Task<ArtworkDto> UpdateArtworkAsync(int id, ArtworkDto artworkDto);

        // Cancella un'opera
        Task<bool> DeleteArtworkAsync(int id);
    }
}