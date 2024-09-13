using NovaVerse.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NovaVerse.Interfaces
{
    public interface IArtworkService
    {
        Task<List<ArtworkDto>> GetAllArtworksAsync();
        Task<ArtworkDto> GetArtworkByIdAsync(int id);
        Task<List<ArtworkDto>> GetArtworksByCategoryAsync(int categoryId);
        Task<ArtworkDto> AddArtworkAsync(ArtworkDto artworkDto);
        Task<ArtworkDto> UpdateArtworkAsync(int id, ArtworkDto artworkDto);
        Task<bool> DeleteArtworkAsync(int id);
    }
}
